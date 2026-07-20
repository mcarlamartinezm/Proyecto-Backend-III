import { Router } from "express";
import {
    getAllAdoptions,
    getAdoptionById,
    createAdoption,
    approveAdoption
} from "../controllers/adoption.controller.js";

const router = Router();

router.get("/", getAllAdoptions);
router.get("/:id", getAdoptionById);
router.post("/", createAdoption);
router.put("/:id/approve", approveAdoption);

export default router;