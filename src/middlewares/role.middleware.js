//midleware de autorización por roles (RBAC)

export const authorize = (...roles) => {
    return  (req, res, next) =>{

        if(!req.user) { //verificar autenticación
            return res.status(401).json({ message: 'No autenticado'});
        }
        if (!roles.includes(req.user.role)){ //verifica rol permitido
            return res.status(403).json({ message: 'No autorizado'});
        }
        next(); //continua luego de verificar
    };
};