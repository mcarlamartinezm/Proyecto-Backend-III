import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });

    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
};

startServer();