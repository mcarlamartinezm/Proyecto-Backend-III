import { UserModel } from "../../src/models/user.model.js";
import { PetModel } from "../../src/models/pet.model.js";
import { AdoptionModel } from "../../src/models/adoption.model.js";


//=====Creación de usuario para db temporal=====
export async function createUser() {
    return await UserModel.create({
        first_name: "Juana",
        last_name: "Pérez",
        email: `juana${Date.now()}@test.com`,
        age: 30,
        password: "123456",
        role: "user"
    });
}

//==== Creación de administrador para db temporal======
export async function createAdmin() {
    return await UserModel.create({
        first_name: "Administrador",
        last_name: "Sistema",
        email: `admin${Date.now()}@test.com`,
        age: 40,
        password: "123456",
        role: "admin"
    });
}

//===== Creación de Mascota para db temporal========

export async function createPet(owner = null) { //Owner=null Para llamar la función con o sin dueño
    return await PetModel.create({
        name: "Firulais",
        specie: "Perro",
        birthDate: new Date("2023-01-01"),
        adopted: false,
        owner: owner
    });

}

//==========Creación de adopción ficticia=======
export async function createAdoption(user, pet, status = "pending") {
    return await AdoptionModel.create({
        owner: user._id,
        pet: pet._id,
        status
    });
}

