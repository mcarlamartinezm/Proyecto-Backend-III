import { UserModel } from "../../src/models/user.model.js"; //importación de user.model
import { PetModel } from "../../src/models/pet.model.js"; //importación de pet.model
import { AdoptionModel } from "../../src/models/adoption.model.js"; //importación de adoption.model
import { createHash } from "../../src/utils/hash.js"; //importación de hash


//=====Creación de usuario para db temporal=====
export async function createUser() {
    return await UserModel.create({
        first_name: "Juana", //Nombre del usuario de prueba
        last_name: "Pérez", //Apellido del usuario de prueba
        email: `juana${Date.now()}@test.com`, //Genera un correo único para evitar duplicados
        age: 30, //Edad del usuario de prueba
        password: createHash("123456"), //Encripta la contraseña antes de almacenarla
        role: "user" //Asigna el rol de usuario para las pruebas
    });
}

//==== Creación de administrador para db temporal======
export async function createAdmin() {
    return await UserModel.create({
        first_name: "Administrador", //Nombre del administrador de prueba
        last_name: "Sistema", //Apellido identificador del administrador
        email: `admin${Date.now()}@test.com`, //Genera un correo único para evitar duplicados
        age: 40, //Edad del administrador de prueba
        password: createHash("123456"), //Encripta la contraseña antes de almacenarla
        role: "admin" //Asigna el rol de administrador para las pruebas
    });
}

//===== Creación de Mascota para db temporal========

export async function createPet(owner = null) { //Permite crear una mascota con o sin propietario para distintos escenarios de prueba
    return await PetModel.create({
        name: "Firulais", //Nombre de la mascota de prueba
        specie: "Perro", //Especie de la mascota de prueba
        birthDate: new Date("2023-01-01"), //Fecha de nacimiento utilizada para las pruebas
        adopted: false, //Inicializa la mascota como disponible para adopción
        owner: owner //Asigna un propietario cuando el escenario de prueba lo requiere
    });

}

//==========Creación de adopción ficticia=======
export async function createAdoption(user, pet, status = "pending"){ //Permite crear una adopción con el estado requerido para cada escenario de prueba
    return await AdoptionModel.create({
        owner: user._id, //Asocia la adopción al usuario de prueba
        pet: pet._id, //Asocia la adopción a la mascota de prueba
        status //Establece el estado inicial de la adopción
    });
}

