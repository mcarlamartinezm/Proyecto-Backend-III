import { describe, it, before, after } from "mocha"; //organiza el test
import { expect } from "chai"; //importacion de chai para las comprobaciones
import request from "supertest"; //peticiones HTTP
import mongoose from "mongoose"; //Conecta a data base
import { MongoMemoryServer } from "mongodb-memory-server"; //Memoria temporal
import app from "../src/app.js"; //importación a app.js
import { PetModel } from "../src/models/pet.model.js"; //importación a pet.model.js
import { AdoptionModel } from "../src/models/adoption.model.js";//importación a adoption.model.js
import { createUser, createAdmin, createPet, createAdoption } from "./helpers/test.factory.js"; //importación de mi fabrica de test

const requester = request(app); //cliente simulado para mi app
//Declaración de variables no estáticas
let mongoServer;
let testUser;
let adminUser;
let testPet;
let testAdoption;

//Bloque de conexión db temporal mocha
before(async function () { //Antes
    mongoServer = await MongoMemoryServer.create(); //crea la instancia para ser guardada en memoria temporal
    const uri = mongoServer.getUri(); //(uniform resource identifier) variable con un identificador del recurso creado.
    await mongoose.connect(uri); //conexión asincrónica del uri a mongo
    testUser = await createUser(); //crea un usuario desde factory
    adminUser = await createAdmin(); //crea un administrador desde factory
    testPet = await createPet(); //crea una mascota desde factory
    testAdoption = await createAdoption(testUser, testPet); //crea una adopción desde factory
});
after(async function () { //al finalizar
    await mongoose.connection.close(); //detiene mongoose
    await mongoServer.stop(); //detiene mongoServer
});

//======================================
// SESSION.ROUTES TEST
// VALIDACIÓN DE USUARIOS 
//======================================

describe("Session Router", function () {

    //=============== Caso: Autenticación de usuario ===========
    it("Debe autenticar correctamente un usuario mediante Passport Local Strategy", async function () {
        const response = await requester.post("/api/session/login-passport").send({ //Envía una solicitud de inicio de sesión al endpoint de Passport
                email: testUser.email, //Credenciales del usuario creados para la prueba (before -> testUser -> test.factory.js)
                password: "123456" 
            });
        expect(response.status).to.equal(200); //Espero que la autenticación sea exitosa
        expect(response.body.message).to.equal("Login con Passport exitoso");  //Espero devuelva el mensaje "login con passport exitoso"
        expect(response.headers["set-cookie"]).to.exist; //Espero que envíe una cookie con el JWT
        const tokenCookie = response.headers["set-cookie"].find(cookie =>
            cookie.startsWith("token=") //Espero que busque el token de autenticación
        );
        expect(tokenCookie).to.exist; //Espero que la cookie del token fue creada correctamente.
    });
});

//======================================
// PET.ROUTES TEST
// ADMINISTRADOR DE MASCOTAS
//======================================

describe("Pet Router", function () {

    //====== caso: Crear mascota ======
    it("Debe permitir que un administrador registre una mascota", async function () {
        const response = await requester.post("/api/pets").send({ //Petición HTTP (POST) para registrar una nueva mascota
                name: "Rocky", //Credenciales de mascota creados para la prueba. (no se usa factory)
                species: "Perro",
                age: 4
            });
        expect(response.status).to.equal(201); //Espero que la mascota se creara correctamente
        expect(response.body.status).to.equal("success"); //Espero que la respuesta indique una operación exitosa
        expect(response.body.payload).to.be.an("object"); //Espero que se devuelva el objeto de la mascota creada
        expect(response.body.payload).to.have.property("_id"); //Espero que la mascota posea un id único
        expect(response.body.payload.name).to.equal("Rocky"); //Espero que el nombre sea almacenado correctamente
        expect(response.body.payload.species).to.equal("Perro"); //Espero que la especie corresponda a la enviada
        expect(response.body.payload.age).to.equal(4); //Espero que la edad sea registrada correctamente
        // Verificar que realmente quedó registrada en la BD
        const pet = await PetModel.findById(response.body.payload._id);
        expect(pet).to.exist; //espero que la mascota exista en la base de datos
        expect(pet.name).to.equal("Rocky"); //Espero que los datos almacenados coincidan con los enviados
    });

    
    //====== Caso: Eliminar mascota ======
    it("Debe permitir que un administrador elimine una mascota", async function () {
        const pet = await createPet(); //Crear una mascota de prueba (test.factory)
        const response = await requester.delete(`/api/pets/${pet._id}`); //Petición HTTP (DELETE) para eliminar la mascota mediante su ID
        expect(response.status).to.equal(200); //Espero que la eliminación sea realizada correctamente
        expect(response.body.status).to.equal("success"); //Espero que la respuesta indicada sea una operación exitosa
        expect(response.body.message).to.equal("Mascota eliminada correctamente"); //Espero el mensaje de confirmación, de la eliminación
        //Verificar que ya no exista en la BD
        const deletedPet = await PetModel.findById(pet._id);
        expect(deletedPet).to.equal(null); //Espero que la mascota fuera eliminada de la base de datos
    });
});


//======================================
// ADOPTION.ROUTES TEST
// ADMINISTRACIÓN DE LAS ADOPCIONES
//======================================
describe("Adoption Router", function () {

    //=============== Caso: Todas las adopciones===========
    it("Debe obtener todas las adopciones", async function () {
        const response = await requester.get("/api/adoptions"); //Petición HTTP (GET) para obtener todas las adopciones registradas
        expect(response.status).to.equal(200); //Espero que la consulta sea realizada correctamente
        expect(response.body.payload).to.be.an("array"); //Espero que el payload corresponda a un array
        expect(response.body.status).to.equal("success"); //Espero que la respuesta indicada sea una operación exitosa
        expect(response.body.payload.length).to.be.greaterThan(0); //Espero que exista al menos una adopción registrada
        //Busca la adopción creada previamente en la base de datos temporal
        const adoption = response.body.payload.find(adoption => adoption._id === testAdoption._id.toString()); 
        expect(adoption).to.exist; //Espero que la adopción creada se encuentre dentro del listado obtenido
    }); 

    //============= Caso: Adopciones por id ==============
    it("Debe obtener una adopción por su ID", async function () {
        const response = await requester.get(`/api/adoptions/${testAdoption._id}`); //Petición HTTP (GET) para obtener una adopción mediante su ID
        expect(response.status).to.equal(200); //Espero que la consulta sea realizada correctamente
        expect(response.body.status).to.equal("success"); //Espero que la respuesta indica sea una operación exitosa
        expect(response.body.payload).to.be.an("object"); //Espero que el payload corresponda a una adopción
        expect(response.body.payload._id).to.equal(testAdoption._id.toString() ); //Espero que el ID obtenido corresponda a la adopción creada previamente
    }); 

    //============= Caso: 404 adopción inexistente ========
    it("Debe devolver 404 si la adopción no existe", async function () { 
        const fakeId = new mongoose.Types.ObjectId(); //Genera un ID válido que no existe en la base de datos
        const response = await requester.get(`/api/adoptions/${fakeId}`); //Petición HTTP (GET) utilizando un ID inexistente
        expect(response.status).to.equal(404); //Espero que el servidor responda con "No encontrado"
        expect(response.body.status).to.equal("error"); //Espero que la respuesta indicada sea una operación fallida
    });

    //=========== Caso: 400 formato de adopción inválido =========
    it("Debe devolver un error cuando el ID tiene un formato inválido", async function () {
        const response = await requester.get("/api/adoptions/abc123"); //Petición HTTP (GET) utilizando un ID con formato inválido
        expect(response.status).to.equal(400); //Espero que el servidor responda con "Solicitud incorrecta"
        expect(response.body.status).to.equal("error"); //Espero que la respuesta indicada sea una operación fallida
    });

    //=========== Caso: Crear adopción exitosa============
    it("Debe crear una nueva adopción", async function () {
        const newUser = await createUser(); //Crea un usuario de prueba mediante test.factory
        const newPet = await createPet(); //Crea una mascota de prueba mediante test.factory
        const response = await requester.post("/api/adoptions").send({ //Petición HTTP (POST) para registrar una nueva adopción
                owner: newUser._id, //Asigna como propietario al usuario creado para la prueba
                pet: newPet._id //Asocia la mascota creada para la prueba
            });
        expect(response.status).to.equal(201); //Espero que la adopción sea creada correctamente
        expect(response.body.status).to.equal("success"); //Espero que la respuesta indicada sea una operación exitosa
        expect(response.body.payload).to.be.an("object"); //Espero que se devuelve un objeto de la adopción creada
        expect(response.body.payload).to.have.property("_id"); //Espero que la adopción posea un id único
        expect(response.body.payload.owner).to.equal(newUser._id.toString()); //Espero que el propietario corresponda al usuario creado para la prueba
        expect(response.body.payload.pet).to.equal(newPet._id.toString()); //Espero que la mascota asociada corresponda a la creada para la prueba
        expect(response.body.payload.status).to.equal("pending"); //Espero que la adopción se creada con estado "pendiente"
    });

    //============ Caso: Usuario inexistente ============
    it("Debe devolver 404 cuando el usuario no existe", async function () {
        const pet = await createPet(); //Crea una mascota de prueba mediante test.factory
        const fakeUserId = new mongoose.Types.ObjectId(); //Generar un ID de usuario válido que no existe en la base de datos
        const response = await requester.post("/api/adoptions").send({ //Petición HTTP (POST) para crear una adopción
                owner: fakeUserId, //Asigna un usuario inexistente
                pet: pet._id //Asocia la mascota creada para la prueba
            });
        expect(response.status).to.equal(404); //Espero que el usuario no fuera encontrado
        expect(response.body.status).to.equal("error"); //Espero que la respuesta indicada sea una operación fallida
        expect(response.body.message).to.equal("Usuario no encontrado"); //Espero el mensaje de error sea usuario no encontrado
    });

    //============ Caso: Mascota inexistente ============
    it("Debe devolver 404 cuando la mascota no existe", async function () {
        const user = await createUser(); //Crea un usuario de prueba mediante test.factory
        const fakePetId = new mongoose.Types.ObjectId(); //Generar un ID de mascota válido que no existe en la base de datos
        const response = await requester.post("/api/adoptions").send({ //Petición HTTP (POST) para crear una adopción
                owner: user._id, //Asigna el usuario creado para la prueba
                pet: fakePetId //Asocia un ID de mascota inexistente
            });
        expect(response.status).to.equal(404); //Espero que la mascota no sea encontrada
        expect(response.body.status).to.equal("error"); //Espero que la respuesta indica sea una operación fallida
        expect(response.body.message).to.equal("Mascota no encontrada"); //Espero el mensaje de error sea mascota no encontrada
    });

    //============= Caso: Mascota ya adoptada =============
        it("Debe devolver 400 cuando la mascota ya fue adoptada", async function () {
        const user = await createUser(); //Crea un usuario de prueba mediante test.factory
        const pet = await createPet(); //Crea una mascota de prueba mediante test.factory
        pet.adopted = true; //Modifica el estado de la mascota para simular una adopción previa
        await pet.save(); //Guarda el cambio en la base de datos temporal
        const response = await requester.post("/api/adoptions").send({ //Petición HTTP (POST) para registrar una adopción
                owner: user._id, //Asigna el usuario creado para la prueba
                pet: pet._id //Asocia una mascota marcada como adoptada
            });
        expect(response.status).to.equal(400); //Espero que la solicitud no pueda procesarse
        expect(response.body.status).to.equal("error"); //Espero que la respuesta indicada sea una operación fallida
        expect(response.body.message).to.equal("La mascota ya fue adoptada"); //Espero el mensaje de error sea mascota ya fue adoptada
    });

    //============ Caso: Aprovar una adopción ==============
    it("Debe aprobar una adopción correctamente", async function () {
        const user = await createUser(); //Crea un usuario de prueba mediante test.factory
        const pet = await createPet(); //Crea una mascota de prueba mediante test.factory
        const adoption = await createAdoption(user, pet); //Crear una adopción de prueba mediante test.factory
        const response = await requester.put(`/api/adoptions/${adoption._id}/approve`); //Petición HTTP (PUT) para aprobar la adopción
        expect(response.status).to.equal(200); //Espero que la aprobación sea realizada correctamente
        expect(response.body.status).to.equal("success"); //Espero que la respuesta indicada sea una operación exitosa
        expect(response.body.payload.status).to.equal("approved"); //Espero que la adopción cambie al estado "approved"
        const updatedPet = await PetModel.findById(pet._id); //Espero la mascota actualizada desde la base de datos
        expect(updatedPet.adopted).to.equal(true); //Espero que la mascota quede marcada como adoptada
    });

    //======== Caso: Rechazar otras solicitudes al aprobar una adopción =====
    it("Debe rechazar las demás solicitudes pendientes de la misma mascota", async function () {
        const user1 = await createUser(); //Crea un usuario de prueba mediante test.factory
        const user2 = await createUser(); //Crea un segundo usuario de prueba mediante test.factory
        const pet = await createPet(); // Crea una mascota de prueba mediante test.factory
        const adoption1 = await createAdoption(user1, pet); //Crear la primera solicitud de adopción para la mascota
        const adoption2 = await createAdoption(user2, pet); //Crear la segunda solicitud de adopción para la misma mascota
        const response = await requester.put(`/api/adoptions/${adoption1._id}/approve`); //Petición HTTP (PUT) para aprobar la primera solicitud
        expect(response.status).to.equal(200); //Espero que la aprobación sea realizada correctamente
        const updatedAdoption1 = await AdoptionModel.findById(adoption1._id); //Espero la primera adopción actualizada desde la base de datos
        const updatedAdoption2 = await AdoptionModel.findById(adoption2._id); //Espero la segunda adopción actualizada desde la base de datos
        expect(updatedAdoption1.status).to.equal("approved"); //Espero que la primera solicitud quede aprobada
        expect(updatedAdoption2.status).to.equal("rejected"); //Espero que la segunda solicitud quede rechazada automáticamente
    });
});














