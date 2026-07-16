import { Router } from 'express';
import { register } from '../controllers/session.controller.js';
import { login } from '../controllers/session.controller.js';
import { generateToken } from '../utils/jwt.js'
import passport from 'passport';

const router = Router();

router.post('/register', register); //registrar nuevo usuario

//=======login manual (validación directa con bcrypt + JWT)
router.post("/login", login); //validar credenciales y generar JWT

//login con passport (local Strategy)
router.post(
  '/login-passport',
  passport.authenticate('local', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name
      });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 1000,
        path: '/'
      });

      res.json({ message: 'Login con Passport exitoso' });

    } catch (error) {
      res.status(500).json({ error: 'Error en login con Passport' });
    }
  }
);

//=========login con google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email']})
); //redirección de google, pide acceso a perfil y mail de usuario.
router.get(
  '/googlecallback', //callback desde google
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const user = req.user; //usuario autenticado por google

      const token = generateToken({ //generación del JWT con datos relevantes
        id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name
      });

      res.cookie('token', token, { //guarda el token en una cookie segura
        httpOnly: true, //no accesible desde js (seguridad)
        sameSite: 'lax', //Protección CSRF básica
        secure: false, //true en producción con HTTPS
        maxAge: 60 * 60 * 1000, // 1 hora
        path: '/' 
      });

      res.redirect('/profile'); //redirección a vista protegida
    } catch (error) { //manejo de error si falla el callback
      res.status(500).send('Error en Google callback');
    }
  }
);

//test para verificar si existe el usuario en session
//endopoint de prueba para verificar persisencia de sesión en el servidor
router.get('/session-user', (req, res) => {
    res.json(req.session.user || 'No hay usuario en sesión');
});


//==== Logout, destrucción de la sesión + eliminación de JWT (cookie)
router.post('/logout', (req, res) => {

  // Destruye la sesión del servidor (si existe)
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }

    // Limpia la cookie JWT del cliente
    res.clearCookie('token', {
      httpOnly: true, //no accesible desde JS
      secure: false, //true en producción HTTPS
      sameSite: 'lax', 
      //maxAge no es necesario pues estamos cerrando la sesión. 
      path: '/' //disponible en toda la app
    });

    // Redirige a login
    res.redirect('/login?logout=1');
  }); //respuesta redireccionando a login

});


export default router;