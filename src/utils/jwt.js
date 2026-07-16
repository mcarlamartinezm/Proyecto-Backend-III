import jwt from 'jsonwebtoken'; //Se importa la librería jsonwebtoken, encargada de firmar y verificar tokens JWT. 

export const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
}
/*La función jwt.sign genera el token utilizando 3 parámetros:
- user (payload) contiene la información del usuario ej. id, email, role, etc.
- process.env.JWT_SECRET (Clave secreta) se usa para firmar el token y garantizar su integridad.
- opciones (expiresIn) define expiración en una hora.*/