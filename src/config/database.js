import mongoose from "mongoose"; /*Se utiliza la librería Mongoose como ODM (Object Data Modeling), que permite interactuar con MongoDB mediante esquemas y modelos en JavaScript. */

export const connectDB = async () => { //Se define una función asíncrona que encapsula la lógica de conexión a la base de datos.

  try {
    await mongoose.connect(process.env.MONGO_URI); //Se establece la conexión utilizando la URI definida en las variables de entorno. 

    console.log("MongoDB connected");//Se imprime un mensaje en consola para confirmar que la conexión fue establecida correctamente. 
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }/*En caso de error:
se muestra el error en consola
se finaliza el proceso con process.exit(1)
Esto evita que la aplicación continúe ejecutándose sin una conexión válida a la base de datos. */

};