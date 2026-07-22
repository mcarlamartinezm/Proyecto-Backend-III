import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../models/user.model.js';

export const initializeGoogleStrategy = () => {

    //Si las credenciales de Google no están configuradas, se omite la estrategia.
    //Esto permite ejecutar pruebas (Mocha/Supertest) sin necesidad de OAuth.
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.warn("Google OAuth no configurado. Se omite la estrategia.");
        return;
    }

    //Se registra una nueva estrategia de autenticación en Passport.
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID, //Identificador de la aplicación entregado por Google.
                clientSecret: process.env.GOOGLE_CLIENT_SECRET, //Clave secreta de la aplicación.
                callbackURL: "/api/session/googlecallback" //Endpoint al que Google redirige después de autenticar al usuario.
            },
            async (accessToken, refreshToken, profile, done) => {
                /* accessToken: token de acceso otorgado por Google.
                   refreshToken: token para renovar acceso.
                   profile: información pública del usuario.
                   done: callback de Passport para finalizar la autenticación.
                */

                try {
                    const email = profile.emails[0].value;

                    let user = await UserModel.findOne({ email });

                    //Si el usuario no existe, se crea automáticamente con los datos entregados por Google.
                    if (!user) {
                        user = await UserModel.create({
                            first_name: profile.name.givenName,
                            last_name: profile.name.familyName,
                            email,
                            password: "oauth",
                        });
                    }

                    //Finaliza la autenticación devolviendo el usuario encontrado o creado.
                    return done(null, user);

                } catch (error) {
                    //Si ocurre un error, Passport lo recibe mediante done(error).
                    return done(error);
                }
            }
        )
    );
};

export default passport;