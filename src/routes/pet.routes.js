import { Router } from "express";
import { Router } from "express";
import {
    getAllPets,
    createPet
} from "../controllers/pet.controller.js";

const router = Router();

router.get("/", getAllPets);
router.post("/", createPet);

export default router;