import { AdoptionModel } from "../models/adoption.model.js";
import { PetModel } from "../models/pet.model.js";
import { UserModel } from "../models/user.model.js";

export const getAllAdoptions = async (req, res) => { //para obtener todas las adopciones
    try {

        const adoptions = await AdoptionModel.find() //obtención de datos
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

        const adoption = await AdoptionModel.findById(id) //obtención de datos
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

        const userExists = await UserModel.findById(owner); //verifica que el usuario exista

        if (!userExists) { //si no existe, arroja error.
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        const petExists = await PetModel.findById(pet); //verifica que la mascota exista

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

        const adoption = await AdoptionModel.create({ //creación de la adopción, dejandola pendiente de aprobación
            owner,
            pet,
            status: "pending",
        });


        res.status(201).json({
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

export const approveAdoption = async (req, res) => { //Aprobar una adopcion
    try {

        const { id } = req.params;

        const adoption = await AdoptionModel.findById(id);

        if (!adoption) {
            return res.status(404).json({ //mensaje si no se encontro el id de la solicitud
                status: "error",
                message: "Solicitud de adopción no encontrada"
            });
        }
     
        if (adoption.status !== "pending") { //mensaje en caso de que la solicitud ya solicitó anteriormente
            return res.status(400).json({
                status: "error",
                message: "Esta solicitud ya fue procesada."
            });
        }
         

        const pet = await PetModel.findById(adoption.pet);   //verificar que la mascota asociada existe

        if (!pet) {
            return res.status(404).json({ //en caso de que la mascota no se exista
                status: "error",
                message: "Mascota no encontrada."
            });
        }
        pet.adopted = true; 
        await pet.save();

        adoption.status = "approved";
        await adoption.save();

        await AdoptionModel.updateMany( //modificar el resto de las peticiones de adopcion y rechazar
            {
                pet: pet._id, //busca todas las adopciones que tiene el id de la mascota
                _id: { $ne: adoption._id }, //que no sea la adopciones que acabamos de aprobar
                status: "pending" //cuyo status sea pendiente
            },
            {
                $set: { //y los cambia a rechazado
                    status: "rejected"
                }
            }
        );

        const updatedAdoption = await AdoptionModel.findById(adoption._id)
            .populate("owner", "first_name last_name email")
            .populate("pet");

            return res.status(200).json({
            status: "success",
            payload: updatedAdoption
        });

      
    } catch (error) { //mensaje de error en el proceso
        return res.status(500).json({
            status: "error",
            message: error.message
        });

    }

};