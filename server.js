import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

connectDB();