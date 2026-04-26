import app from "@/app";
import { startAuraJob } from "@/jobs/aura.job";

startAuraJob();

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`
=================================
🚀 Server running
🌐 http://localhost:${PORT}
=================================
  `);
});
