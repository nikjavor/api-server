import { calculateAura } from "@/services/aura.service";
import { coloredString } from "@/utils/helpers";

let latestAura: object | null = null;

export function startAuraJob() {
  async function run() {
    try {
      const data = await calculateAura();
      latestAura = data;

      console.log("Aura updated", new Date().toISOString());
      console.log("");
    } catch (err) {
      console.error("Aura job failed:", err);
    }
  }

  // run immediately
  run();

  // then every x seconds
  const SECONDS = 15 * 60;

  setInterval(run, SECONDS * 1000);
}

export function getCachedAura() {
  return latestAura;
}

export function startDemoAuraJob() {
  let temperature = -20;
  async function run() {
    try {
      const { r, g, b } = await calculateAura(temperature);

      console.log(coloredString(`....${temperature}....`, r, g, b));

      temperature++;
      if (temperature > 40) temperature = -20;
    } catch (err) {
      console.error("Demo aura job failed:", err);
    }
  }

  // run immediately
  run();

  setInterval(run, 150); // 150ms
}
