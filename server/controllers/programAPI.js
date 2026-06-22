import express from "express";
import Program from "../models/programsModel.js";
import Company from "../models/companyModel.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

// GET /Programs
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all Programs that belong to the current user in this company
    const company = await Company.find({
      _id: user.companyID,
    }).select("_id");

    const companyIds = company.map((c) => c._id);
    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    let dateCondition = [];
    dayjs.extend(utc);

    if (!isNaN(Date.parse(search))) {
      const start = dayjs(search, "YYYY-MM-DD").startOf("day").toDate(); // 00:00:00;
      const end = dayjs(search, "YYYY-MM-DD").endOf("day").toDate();
      end.setDate(end.getDate() + 1);

      dateCondition.push({
        date: {
          $gte: start,
          $lt: end,
        },
      });
    }

    const filter = search
      ? {
          $or: [
            { queue: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },

            // date handled correctly
            ...dateCondition,

            // numeric fields
            ...(isNaN(search)
              ? []
              : [{ seat: Number(search) }, { tarrif: Number(search) }]),
          ],
        }
      : {};

    // Condition to hide past programs for passengers
    let roleCondition = {};
    if (user.roles === "passenger") {
      const today = dayjs().startOf("day").toDate();
      roleCondition = {
        date: { $gte: today },
      };
    }

    const cmp = await Program.find({
      companyId: { $in: companyIds },
      // userId: user.id || user._id,
      ...filter,
      ...roleCondition,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "routId", select: "departure arrival" })
      .populate({ path: "carId", select: "type level NoofSeats plateNumber" })
      .populate({ path: "companyId", select: "companyName companyLogo" });

    res.json(cmp);
  } catch (error) {
    // console.log(error);
    console.log(error);
    res.status(500).json({ message: "Error getting Program List" });
  }
};

const getOne = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: "Error getting program." });
  }
};
// POST /Programs
const create = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    if (!user || !user.companyID) {
      return res
        .status(400)
        .json({ message: "Authenticated user missing companyId" });
    }
    // const programDate = new Date(req.body.date); // Ensure date is in correct format
    // // normalize time
    // programDate.setUTCHours(0, 0, 0, 0);
    const convDate = dayjs(req.body.date).format("YYYY-MM-DD");
    const payload = {
      ...req.body,
      date: convDate,
      companyId: user.companyID,
      userId: user.id || user._id,
    };
    const trf = await Program.create(payload);
    res.json(trf);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating Program" });
  }
};

// PUT /Programs/:id
const update = async (req, res) => {
  try {
    const updated = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating Program" });
  }
};

// DELETE /Programs/:id
const remove = async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.json({ message: "Program deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Program" });
  }
};

// GET /Programs/by-route/:routId
export const getprogramByRoute = async (req, res) => {
  try {
    const { routId } = req.params;
    const search = req.query.search || "";

    const filter = search
      ? {
          $or: [
            { tarrif: { $regex: Number(search), $options: "i" } },
            { queue: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } },
            { level: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const program = await Program.find({ routId, status: "active", ...filter })
      .populate("routId", "departure arrival")
      .populate("carId", "type level");
    res.json(program);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tarrifs" });
  }
};

const programAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};

export default programAPI;
