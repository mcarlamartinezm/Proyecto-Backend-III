import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../models/user.model.js';


passport.use( //Se registra una nueva estrategia de autenticación en Passport. 

    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID, //identificador de la aplicación entregado por Google. 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, //clave secreta de la aplicación. 
            callbackURL: '/api/session/googlecallback' //endpoint al que Google redirige después de autenticar al usuario. 
        }, 
        async (accessToken, refreshToken, profile, done) =>{ //Función de verificación ejecutada cuando Google devuelve la información del usuario autenticado 
            /*accessToken: token de acceso otorgado por Google.
            refreshToken: token para renovar acceso.
            profile: información pública del usuario.
            done: callback de Passport para finalizar la autenticación.*/ 
            try{
                const email = profile.emails[0].value; //Obtiene el correo electrónico principal del perfil entregado por Google. 

                let user = await UserModel.findOne({email}); //Busca en la base de datos si ya existe un usuario con ese correo. 

                if (!user){
                    user = await UserModel.create({
                        first_name: profile.name.givenName,
                        last_name: profile.name.familyName,
                        email,
                        password: 'oauth',
                    }); //Si el usuario no existe, se crea automáticamente utilizando la información proporcionada por Google. 
                }
                return done(null, user); //Finaliza la autenticación y entrega el usuario autenticado a Passport, quedando disponible en req.user
            }catch (error){
                return done(error); //Si ocurre un error durante el proceso, Passport lo maneja 
            }
        }
    )
);

export default passport;