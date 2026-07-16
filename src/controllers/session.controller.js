import { UserModel } from '../models/User.model.js';
import { createHash } from '../utils/hash.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//============registrar usuario
export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // validar campos
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // verificar si ya existe
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'Usuario ya existe' });
    }

    // crear usuario
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password) //bcrypt contraseña encriptada
    };

    const result = await UserModel.create(newUser);

    res.redirect('/login?success=1'); //redirige a login cuando termina

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//================Loguear Usuario
export const login = async (req, res) => {
  try{
    const {email, password} =req.body;

    //validar que lleguen datos
    if (!email|| !password){
      return res.status(400).json ({ error: "Faltan datos por ingresar" });
    }

    //Buscar usuario en la base de datos
    const user = await UserModel.findOne ({ email });

    if (!user) {
      return res.status(400).json ({ error: "Usuario no encontrado"});
    }

    //Validar la contraseña
    const isValidPassword = await bcrypt.compare (password, user.password);

    if (!isValidPassword) {
      return res.status(401).json ({ error: "Credenciales de usuario Inválidas"});
    }

    //========= session de usuario
    //Guarda información del usuario en el servidor
    //Permite mantener estado entre los requests
   req.session.user = {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role
   }; 
 
    //payload auxiliar (referencia para JWT)
    /*const payload = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
    };*/


    // Genera JasonWebToken (metodo principal de autenticación) Firma token con información mínima del user
    const token = jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role,
      first_name: user.first_name
    }, process.env.JWT_SECRET, { expiresIn: '1h' 
    
  });

    //Respuesta httpOnly. Almacena JWT de forma segura en el cliente httpOnly, protección XSS
    res.cookie('token', token, { 
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 60 * 60 * 1000, // 1 hora
      path: '/'
    })

    // redirección a ruta protegida
    res.redirect('/profile');


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor"});
  };
}