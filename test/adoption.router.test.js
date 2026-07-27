import { describe, it, before, after } from "mocha";  //organiza el test
import { expect } from "chai"; //para las comprobaciones
import request from "supertest"; //peticiones HTTP
import mongoose from "mongoose"; //Conecta a data base
import { MongoMemoryServer } from "mongodb-memory-server"; //Memoria temporal
import app from "../src/app.js";
import { UserModel } from "../models/user.model.js";
import { PetModel } from "../models/pet.model.js";
import { AdoptionModel } from "../models/adoption.model.js";
import { createUser, createAdmin, createPet, createAdoption } from "./helpers/test.factory.js"; //elementos de mi factory helpers

const requester = request(app); //cliente simulado para mi app
//Declaración de variables
let mongoServer;
let testUser;
let adminUser;
let testPet;
let testAdoption;

//Bloque de conexión db temporal
before(async function () { //bloque a ejecutar antes de las pruebas
    mongoServer = await MongoMemoryServer.create(); //crea la instancia para ser guardada en memoria temporal
    const uri = mongoServer.getUri(); //(uniform resource identifier) variable con un identificador del recurso creado.
    await mongoose.connect(uri); //conecta el uri a mongo
});
after(async function () {
    await mongoose.connection.close();
    await mongoServer.stop();
});

//Creación de usuario ficticio



//=====Test todas las adopciones=======
describe("Adoption Router", function () {
    it("Debe obtener todas las adopciones", async function () {
        const response = await requester.get("/api/adoptions"); //petición HTTP (get) de test a mi API
        expect(response.status).to.equal(200); //espero que responde correctamente
        expect(response.body.payload).to.be.an("array"); //espero que el payload sea un array
        expect(response.body.status).to.equal("success"); //espero que el estado json sea exitosa
    }); 
});

//=======Test adopciones por id========



