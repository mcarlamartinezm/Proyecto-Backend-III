import { Router } from "express";
import {
    getAllAdoptions,
    getAdoptionById,
    createAdoption
} from "../controllers/adoption.controller.js";

const router = Router();

router.get("/", getAllAdoptions);
router.get("/:id", getAdoptionById);
router.post("/", createAdoption);

export default router;