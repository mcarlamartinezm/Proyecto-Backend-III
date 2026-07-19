import Pet from "../models/pet.model.js";

export const getAllPets = async (req, res) => { //Obtener todas las mascotas
    try {

        const pets = await Pet.find(); //para encontrar una mascota

        res.status(200).json({
            status: "success",
            payload: pets
        });

    } catch (error) { //En caso de que no se encuentren mascotas

        res.status(500).json({
            status: "error",
            message: error.message
        });

    }
};

export const createPet = async (req, res) => { //crear una mascota
    try {

        const { name, species, age } = req.body;

        if (!name || !species) { //para que se rellenen todos los campos
            return res.status(400).json({
                status: "error",
                message: "Nombre y especie son obligatorios"
            });
        }

        const pet = await Pet.create({ //crea la mascota
            name,
            species,
            age
        });

        res.status(201).json({ //Respuesta de creación exitosa
            status: "success",
            payload: pet
        });

    } catch (error) {

        res.status(500).json({ //respuesta en caso de error en el proceso
            status: "error",
            message: error.message
        });

    }
};