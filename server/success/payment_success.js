import express from "express";
import Ticket from "../models/ticketsModel.js";

// router.put("/confirm-payment/:ticketId", async (req, res) => {
export const payment_success = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Only confirm if still pending
    if (ticket.paymentStatus !== "pending") {
      return res.json({ message: "Payment already handled" });
    }

    ticket.paymentStatus = "paid";
    // ticket.paidAt = new Date();
    await ticket.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Payment confirmation failed" });
  }
};
