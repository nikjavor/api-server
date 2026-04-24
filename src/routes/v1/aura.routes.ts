import { Router } from "express";
import { getAura } from "@/controllers/aura.controller";

const router = Router();

router.get("/", getAura);

export default router;
