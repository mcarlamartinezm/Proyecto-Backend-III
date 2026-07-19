import Adoption from "../models/adoption.model.js";
import Pet from "../models/pet.model.js";
import User from "../models/user.model.js";

export const getAllAdoptions = async (req, res) => { //para obtener todas las adopciones
    try {

        const adoptions = await Adoption.find() //obtención de datos
            .populate("owner", "first_name last_name email")
            .populate("pet");

        res.status(200).json({ //mensaje de obtención exitosa
            status: "success",
            payload: adoptions
        });

    } catch (error) {

        res.status(500).json({ //mensaje en caso de fallo
            status: "error",
            message: error.message
        });

    }
};

export const getAdoptionById = async (req, res) => { //obtener adopciones por id
    try {

        const { id } = req.params;

        const adoption = await Adoption.findById(id) //obtención de datos
            .populate("owner", "first_name last_name email")
            .populate("pet");

        if (!adoption) {
            return res.status(404).json({ //respues en caso de no encontrar id
                status: "error",
                message: "Adopción no encontrada"
            });
        }

        res.status(200).json({ //Mensaje de obtención exitosa
            status: "success",
            payload: adoption
        });

    } catch (error) {

        res.status(500).json({ //mensaje en caso de fallo
            status: "error",
            message: error.message
        });

    }
};

export const createAdoption = async (req, res) => { //nueva adopción
    try {

        const { owner, pet } = req.body;

        const userExists = await User.findById(owner); //verifica que el usuario exista

        if (!userExists) { //si no existe, arroja error.
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        const petExists = await Pet.findById(pet); //verifica que la mascota exista

        if (!petExists) { //si no existe, arroja error.
            return res.status(404).json({
                status: "error",
                message: "Mascota no encontrada"
            });
        }

        if (petExists.adopted) { //verifica que la mascota no haya sido adoptada.
            return res.status(400).json({ //arroja error si ya fue adoptada
                status: "error",
                message: "La mascota ya fue adoptada"
            });
        }

        const adoption = await Adoption.create({ //creación de la adopción
            owner,
            pet
        });

        petExists.adopted = true;
        await petExists.save();

        res.status(201).json({ //respuesta de adopción exitosa
            status: "success",
            payload: adoption
        });

    } catch (error) { //respuesta en caso de error

        res.status(500).json({
            status: "error",
            message: error.message
        });

    }
};