import { Request, Response } from "express";
import { getCachedAura } from "@/jobs/aura.job";

export const getAura = async (req: Request, res: Response) => {
  try {
    const aura = await getCachedAura();

    if (!aura) return res.status(503).json({ error: "Aura not ready yet" });

    res.json(aura);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get aura" });
  }
};
