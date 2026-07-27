import { PetModel } from "../models/pet.model.js";

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

export const getPetById = async (req, res) => { //obtener mascota por id
    try {

        const { id } = req.params;

        const pet = await Pet.findById(id);

        if (!pet) { //Si no se encuentra el id responder, no encontrada
            return res.status(404).json({
                status: "error",
                message: "Mascota no encontrada"
            });
        }

        return res.status(200).json({ //si se encuentra, responde finalizado
            status: "success",
            payload: pet
        });

    } catch (error) { //respuesta en caso de error

        return res.status(500).json({
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

export const updatePet = async (req, res) => { //modificar mascota
    try {

        const { id } = req.params; //buscar mascota por id
        const updatedData = req.body;

        const pet = await Pet.findById(id); 

        if (!pet) {  //mensaje en caso de error
            return res.status(404).json({
                status: "error",
                message: "Mascota no encontrada"
            });
        }

        const updatedPet = await Pet.findByIdAndUpdate( //actualizar mascota
            id,
            updatedData,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({ //modificación exitosa
            status: "success",
            payload: updatedPet
        });

    } catch (error) { //Mensaje en caso de error

        return res.status(500).json({
            status: "error",
            message: error.message
        });

    }
};

export const deletePet = async (req, res) => { //eliminar mascota
    try {

        const { id } = req.params;

        const pet = await Pet.findById(id); //Encontrar mascota por id

        if (!pet) {
            return res.status(404).json({ //Mensaje de error en caso de no encontrarlo
                status: "error",
                message: "Mascota no encontrada"
            });
        }

        await Pet.findByIdAndDelete(id); //eliminar

        return res.status(200).json({  //mensaje de éxito
            status: "success",
            message: "Mascota eliminada correctamente"
        });

    } catch (error) { //mensaje en caso de error al eliminar

        return res.status(500).json({
            status: "error",
            message: error.message
        });

    }
};