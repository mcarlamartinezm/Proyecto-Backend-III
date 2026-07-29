import { describe, it, before, after } from "mocha";  //organiza el test
import { expect } from "chai"; //para las comprobaciones
import request from "supertest"; //peticiones HTTP
import mongoose from "mongoose"; //Conecta a data base
import { MongoMemoryServer } from "mongodb-memory-server"; //Memoria temporal
import app from "../src/app.js";
import { PetModel } from "../src/models/pet.model.js";
import { AdoptionModel } from "../src/models/adoption.model.js";
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
    testUser = await createUser(); //crea un usuario
    adminUser = await createAdmin(); //crea un administrador
    testPet = await createPet(); //crea una mascota
    testAdoption = await createAdoption(testUser, testPet); //crea una adopción
});
after(async function () {
    await mongoose.connection.close();
    await mongoServer.stop();
});


//======================================
// SESSION.ROUTES
// VALIDACIÓN DE USUARIOS 
//======================================

describe("Session Router", function () {

    //=============== Caso: Autenticación de usuario ===========
    it("Debe autenticar correctamente un usuario mediante Passport Local Strategy", async function () {
        const response = await requester
            .post("/api/session/login-passport")
            .send({
                email: testUser.email,
                password: "123456"
            });
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Login con Passport exitoso");
        expect(response.headers["set-cookie"]).to.exist;
        const tokenCookie = response.headers["set-cookie"].find(cookie =>
            cookie.startsWith("token=")
        );
        expect(tokenCookie).to.exist;
    });
});

//======================================
// PET.ROUTES
// ADMINISTRADOR DE MASCOTAS
//======================================

describe("Pet Router", function () {

    //====== caso: Crear mascota ======
    it("Debe permitir que un administrador registre una mascota", async function () {
        const response = await requester
            .post("/api/pets")
            .send({
                name: "Rocky",
                species: "Perro",
                age: 4
            });
        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload).to.be.an("object");
        expect(response.body.payload).to.have.property("_id");
        expect(response.body.payload.name).to.equal("Rocky");
        expect(response.body.payload.species).to.equal("Perro");
        expect(response.body.payload.age).to.equal(4);
        // Verificar que realmente quedó registrada en la BD
        const pet = await PetModel.findById(response.body.payload._id);
        expect(pet).to.exist;
        expect(pet.name).to.equal("Rocky");
    });

    
    //====== Caso: Eliminar mascota ======
    it("Debe permitir que un administrador elimine una mascota", async function () {
        const pet = await createPet();
        const response = await requester.delete(`/api/pets/${pet._id}`);
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.message).to.equal("Mascota eliminada correctamente");
        // Verificar que ya no exista en la BD
        const deletedPet = await PetModel.findById(pet._id);
        expect(deletedPet).to.equal(null);
    });
});


//======================================
// ADOPTION.ROUTES
// ADMINISTRACIÓN DE LAS ADOPCIONES
//======================================
describe("Adoption Router", function () {

    //=============== Caso: Todas las adopciones===========
    it("Debe obtener todas las adopciones", async function () {
        const response = await requester.get("/api/adoptions"); //petición HTTP (get) de test a mi API
        expect(response.status).to.equal(200); //espero que responde correctamente
        expect(response.body.payload).to.be.an("array"); //espero que el payload sea un array
        expect(response.body.status).to.equal("success"); //espero que el estado json sea exitosa
        expect(response.body.payload.length).to.be.greaterThan(0); //espero que tenga al menos una adopción
        const adoption = response.body.payload.find(      adoption => adoption._id === testAdoption._id.toString()
    ); //Busca un array cuya id, sea la misma id que creamos en before, y guardala en la variable adoption
        expect(adoption).to.exist;
    }); 

    //============= Caso: Adopciones por id ==============
    it("Debe obtener una adopción por su ID", async function () {
        const response = await requester.get(`/api/adoptions/${testAdoption._id}`
        );
        expect(response.status).to.equal(200); //responde cod 200
        expect(response.body.status).to.equal("success"); //estado en success
        expect(response.body.payload).to.be.an("object"); //devuelve un objeto
        expect(response.body.payload._id).to.equal(
            testAdoption._id.toString() );//ese objeto tiene exactamente el mismo _id que creamos en el before()
    }); 

    //============= Caso: 404 adopción inexistente ========
    it("Debe devolver 404 si la adopción no existe", async function () {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await requester.get(`/api/adoptions/${fakeId}`);
        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
    });

    //=========== Caso: 400 formato de adopción inválido =========
    it("Debe devolver un error cuando el ID tiene un formato inválido", async function () {
        const response = await requester.get("/api/adoptions/abc123");
        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
    });

    //=========== Caso: Crear adopción exitosa============
    it("Debe crear una nueva adopción", async function () {
        const newUser = await createUser();
        const newPet = await createPet();
        const response = await requester.post("/api/adoptions")
            .send({
                owner: newUser._id,
                pet: newPet._id
            });
        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload).to.be.an("object");
        expect(response.body.payload).to.have.property("_id");
        expect(response.body.payload.owner).to.equal(newUser._id.toString());
        expect(response.body.payload.pet).to.equal(newPet._id.toString());
        expect(response.body.payload.status).to.equal("pending");
    });

    //============ Caso: Usuario inexistente ============
    it("Debe devolver 404 cuando el usuario no existe", async function () {
        const pet = await createPet();
        const fakeUserId = new mongoose.Types.ObjectId();
        const response = await requester.post("/api/adoptions")
            .send({
                owner: fakeUserId,
                pet: pet._id
            });
        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
        expect(response.body.message).to.equal("Usuario no encontrado");
    });

    //============ Caso: Mascota inexistente ============
    it("Debe devolver 404 cuando la mascota no existe", async function () {
        const user = await createUser();
        const fakePetId = new mongoose.Types.ObjectId();
        const response = await requester.post("/api/adoptions")
            .send({
                owner: user._id,
                pet: fakePetId
            });
        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
        expect(response.body.message).to.equal("Mascota no encontrada");
    });

    //============= Caso: Mascota ya adoptada =============
        it("Debe devolver 400 cuando la mascota ya fue adoptada", async function () {
        const user = await createUser();
        const pet = await createPet();
        pet.adopted = true;
        await pet.save();
        const response = await requester.post("/api/adoptions").send({
                owner: user._id,
                pet: pet._id
            });
        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
        expect(response.body.message).to.equal("La mascota ya fue adoptada");
    });

    //============ Caso: Aprovar una adopción ==============
    it("Debe aprobar una adopción correctamente", async function () {
        const user = await createUser();
        const pet = await createPet();
        const adoption = await createAdoption(user, pet);
        const response = await requester.put(`/api/adoptions/${adoption._id}/approve`);
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload.status).to.equal("approved");
        const updatedPet = await PetModel.findById(pet._id);
        expect(updatedPet.adopted).to.equal(true);
    });

    //======== Caso: Rechazar otras solicitudes al aprobar una adopción =====
    it("Debe rechazar las demás solicitudes pendientes de la misma mascota", async function () {
        const user1 = await createUser();
        const user2 = await createUser();
        const pet = await createPet();
        const adoption1 = await createAdoption(user1, pet);
        const adoption2 = await createAdoption(user2, pet);
        const response = await requester.put(`/api/adoptions/${adoption1._id}/approve`);
        expect(response.status).to.equal(200);
        const updatedAdoption1 = await AdoptionModel.findById(adoption1._id);
        const updatedAdoption2 = await AdoptionModel.findById(adoption2._id);
        expect(updatedAdoption1.status).to.equal("approved");
        expect(updatedAdoption2.status).to.equal("rejected");
    });
});


//======================================
// DOCKER
// 
//======================================












