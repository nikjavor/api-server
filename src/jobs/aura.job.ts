import { calculateAura } from "@/services/aura.service";

let latestAura: any = null;

export function startAuraJob() {
  async function run() {
    try {
      const data = await calculateAura("#dea249");
      latestAura = data;

      console.log(`Aura updated`, new Date().toISOString());
    } catch (err) {
      console.error("Aura job failed:", err);
    }
  }

  // run immediately
  run();

  // then every x seconds
  const SECONDS = 30;
  setInterval(run, SECONDS * 1000);
}

export function getCachedAura() {
  return latestAura;
}
