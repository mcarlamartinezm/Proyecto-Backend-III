import bcrypt from 'bcrypt'; //Se importa la librería bcrypt para generar hashes seguros de contraseña y comparar contraseñas ingresadas con hashes almacenados.

export const createHash = password => //recibe una contraseña en texto plano y devuelve su versión encriptada. 
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//bcrypt.hashSync combina la contraseña con el salt 
//bcrypt.genSaltSync(10) genera un salt con 10 rondas de procesamiento
//El resultado es un hash irreversible

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);
//esta función compara la contraseña ingresada con el hash almacenado en user.password
//devuelve true si coincide o false si no coincide