import { Router } from "express";
import {
    getAllPets,
    createPet,
    getPetById,
    updatePet,
    deletePet
} from "../controllers/pet.controller.js";

const router = Router();

router.get("/", getAllPets);
router.get("/:id", getPetById);
router.post("/", createPet);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

export default router;