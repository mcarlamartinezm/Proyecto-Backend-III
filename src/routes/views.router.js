import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js'; //principal
import { authorize } from '../middlewares/role.middleware.js';
//import { authorize } from 'passport'; //implementación auth sin rol
//import { authSession } from '../middlewares/auth.middleware.js'; //implementacion de Authsession

const router = Router();

router.get('/login', (req, res) => {
    const success = req.query.success;
    res.render('login', { success });
});

router.get('/register', (req, res) => {
    res.render('register');
});

//====== Auth -no activado-
 /*router.get('/profile', auth, (req, res) => { res.render('profile', { user: req.user }); 
 });*/
 /*Esta versión protege la ruta /profile utilizando solo el middleware `auth`. El middleware valida la existencia y validez del JWT almacenado en la cookie, decodifica su contenido y lo asigna a `req.user`. Si el token es válido, se renderiza la vista profile con la información del usuario. Esta implementación demuestra autenticación basada exclusivamente en JWT, sin aplicar validación adicional por roles.*/


//===== AuthSession  -no activado-
/*router.get('/profile', authSession, (req, res) => {
    res.render('profile', { user: req.session.user });
});*/
/*Esta versión utiliza el middleware `authSession`, el cual verifica la existencia de req.session.user  almacenado en el servidor mediante express-session. Si la sesión existe, se renderiza la vista profile utilizando los datos guardados en la sesión. Esta alternativa demuestra un mecanismo de autenticación stateful, donde el estado del usuario se mantiene en el servidor. Se conserva como evidencia del uso de sesiones como alternativa a JWT. */


//====== Auth + roles, Ruta protegida con JWT y control de acceso por roles (RBAC)
router.get('/profile', auth, authorize('user', 'admin'), //valida autenticación mediante JWT y autorización por rol
(req, res) => {
    res.render('profile', { user: req.user});
});


//Validación solo para rol de administradores
router.get('/admin', auth, authorize('admin'), (req, res) => { 
    res.send('Panel de administrador');
}
);


export default router;