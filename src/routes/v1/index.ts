import { Router } from "express";

import auraRoutes from "@/routes/v1/aura.routes";

const router = Router();

router.use("/aura", auraRoutes);

export default router;
