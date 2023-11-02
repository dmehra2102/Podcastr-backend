import cron from "node-cron";

export async function cronJobs() {
  cron.schedule("*/30 * * * *", async function () {
    console.log("running every 30 minute");
  });
}
