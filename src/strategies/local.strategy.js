import passport from 'passport'; //instancia principal de Passport
import { Strategy as LocalStrategy } from 'passport-local'; //estrategia de autenticación local
import { UserModel } from '../models/User.model.js'; //modelo de usuarios
import { isValidPassword } from '../utils/hash.js'; //función auxiliar que compara la contraseña ingresada con el hash almacenado en la base de datos. 

//Se define una función encargada de registrar la estrategia local en Passport. Esta función se ejecuta en app.js, antes de inicializar Passport. 
export const initializeLocalStrategy = () => {
  passport.use(
    'local', //nombre de la estrategia nombre de la estrategia utilizado posteriormente en passport.authenticate('local') 
    new LocalStrategy(
      {
        usernameField: 'email',  //se define email como identificador en lugar de username
        passwordField: 'password'  //se define que password contenga la contraseña enviada por el cliente. 

      },
      async (email, password, done) => { //Función de verificación que Passport ejecuta al recibir las credenciales 

        try { //Búsqueda del usuario en la base de datos
          const user = await UserModel.findOne({ email });  //Búsqueda del usuario en la base de datos (mongo DB)

          if (!user) { //Si el usuario no existe, la autenticación falla. 
            return done(null, false, { message: 'Usuario no encontrado' });
          }

          if (!isValidPassword(user, password)) { 
            return done(null, false, { message: 'Contraseña incorrecta' }); //validación de contraseña utilizando bcrypt
          }

          return done(null, user); //Usuario autenticado correctamente
        } catch (error) {
          return done(error); //manejo de errores, en caso de error interno, Passport lo recibe y lo maneja. 
        }
      }
    )
  );
};