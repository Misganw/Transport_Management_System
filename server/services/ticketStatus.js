import cron from "node-cron";
import Ticket from "../models/ticketsModel.js";
import Program from "../models/programsModel.js";
import CancelledTicket from "../models/cancelledTicketModel.js";
import Report from "../models/reportsModel.js";

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Step 1: Update reserved -> pending (optional, keep your original logic)
    await Ticket.updateMany(
      {
        paymentStatus: "reserved",
        createdAt: { $lt: new Date(now - 30 * 60 * 1000) }, // 30 minutes ago
      },
      { paymentStatus: "pending" },
    );

    // Step 2: Find tickets to cancel
    const ticketsToCancel = await Ticket.find({
      paymentStatus: "pending",
      createdAt: { $lt: new Date(now - 60 * 60 * 1000) }, // 1 hour ago
    });

    if (ticketsToCancel.length > 0) {
      // Step 3: Group by programId and count
      const programCountMap = {};
      ticketsToCancel.forEach((ticket) => {
        const programId = ticket.programId.toString(); // ensure string key
        programCountMap[programId] = (programCountMap[programId] || 0) + 1;
      });

      // Step 4: Reduce paidSeatCount in each program
      for (const [programId, count] of Object.entries(programCountMap)) {
        await Program.findByIdAndUpdate(programId, {
          $inc: { paidSeatCount: -count },
          $set: {
            status: count >= Program.totalSeat ? "full" : "active",
          },
        });
      }

      // Step 5: move tickets to cancelled collection
      const cancelledDocs = ticketsToCancel.map((ticket) => {
        const obj = ticket.toObject();
        delete obj._id; // IMPORTANT
        return {
          ...obj,
          paymentStatus: "canceled",
          reason: "timeout",
          canceledAt: now,
        };
      });

      await CancelledTicket.insertMany(cancelledDocs);
      // Step 6: delete from Ticket collection
      await Ticket.deleteMany({
        _id: { $in: ticketsToCancel.map((t) => t._id) },
      });
    }

    // console.log(
    //   `Cron job ran at ${now}. Canceled ${ticketsToCancel.length} tickets.`,
    // );
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
