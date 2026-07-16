import jwt from 'jsonwebtoken';

// Middleware de autenticación para VISTAS (render)
//Valida JWT desde cookies y redirige si no está autenticado
export const auth = (req, res, next) => { 
    const token = req.cookies.token; //obtiene el token desde la cookie httpOnly

    if (!token){ //si no existe -> usuario no autenticado, redirección a login
        return res.redirect('/login');
    }
    try { //verifica el token con clave secreta
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; //adjunta información del usuario al Request para uso de vistas
        next(); //permite continuar a ruta protegida
    } catch (error) { //error si token es inválido o expirado
        return res.redirect('/login'); //redirecciona a login (vista)
    }
};


//Middleware de autenticación con AuthSession, verifica si existe usuario almacenado en la sesión del servidor
export const authSession = (req, res, next) =>{
    if (!req.session.user) {
        return res.status(401).send('Sesión no autorizada (session)'); //error si la sessión no es autorizada
    }
    next(); //Continúa con usuario identificado vía session.
};


//Middleware de autenticación para API (JWT)
//devuelve respuestas HTTP estándar, en lugar de redirecciones
export const authJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token){
        return res.status(401).json({ error: 'No autenticado' });
    }

    try { //verificación del token JWT
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; //usuario disponible para middlewares siguientes
        next();
    } catch (error) { // error por token inválido o expirado
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};