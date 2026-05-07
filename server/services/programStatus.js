import cron from "node-cron";
import Program from "../models/programsModel.js";
import dayjs from "dayjs";

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const convNow = dayjs(now).format("YYYY-MM-DD");

    const result = await Program.updateMany(
      {
        date: { $lt: convNow }, // program date already passed
        status: { $ne: "Date Passed" }, // avoid updating again
      },
      {
        $set: { status: "Date Passed" },
      },
    );

    if (result.modifiedCount > 0) {
      console.log(`${result.modifiedCount} programs marked as Date Passed`);
    }
  } catch (error) {
    console.error("Program status cron error:", error);
  }
});
