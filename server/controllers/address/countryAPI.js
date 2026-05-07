import express from "express";
import mongoose from "mongoose";
import Company from "../../models/companyModel.js";
import Country from "../../models/addressModel/countryModel.js";
import State from "../../models/addressModel/stateModel.js";
import Zone from "../../models/addressModel/zoneModel.js";
import Wereda from "../../models/addressModel/weredaModel.js";
import City from "../../models/addressModel/cityModel.js";
import Employee from "../../models/employeeModel.js";
import RecycleBin from "../../models/recycleBinModel.js";

// GET /cars
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all owners that belong to the current user in this company
    const company = await Company.find({
      _id: user.companyID,
    }).select("_id");
    // console.log(company);

    const companyIds = company.map((c) => c._id);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [
            { _id: { $regex: search, $options: "i" } },
            { cName: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const cmp = await Country.find({
      companyId: { $in: companyIds },
      ...filter,
    }).populate("companyId", "companyName");
    res.json(cmp);
  } catch (error) {
    res.status(500).json({ message: "Error getting Country List" });
  }
};

// get record by ID
const getOne = async (req, res) => {
  try {
    const cont = await Country.findById(req.params.id).populate(
      "companyId",
      "companyName"
    ); // fetch only companyName
    res.json(cont);
  } catch (error) {
    res.status(500).json({ message: "Error geting Country" });
  }
};
// POST /Country
const create = async (req, res) => {
  try {
    const user = req.user; // from auth middleware

    if (!user || !user.companyID) {
      return res
        .status(400)
        .json({ message: "Authenticated user missing companyId" });
    }

    const payload = {
      ...req.body,
      companyId: user.companyID,
      userId: user.id || user._id,
    };
    const country = await Country.create(payload);
    res.json(country);
  } catch (error) {
    res.status(500).json({ message: "Error creating Country" });
  }
};

// PUT /Country/:id
const update = async (req, res) => {
  try {
    const updated = await Country.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Country" });
  }
};

// DELETE /Country/:id
// const remove = async (req, res) => {
//   const { companyID, id: userId } = req.user;
//   try {
//     await Country.findByIdAndDelete(req.params.id);
//     res.json({ message: "Country deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting Country" });
//   }
// };

const removeMany = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  try {
    const { id } = req.body;
    const user = req.user; // from auth middleware

    if (!Array.isArray(id) || id.length === 0) {
      return res.status(400).json({ message: "No countries selected" });
    }

    // Find country
    // const country = await Country.findOne({
    //   _id: id,
    //   companyId: user.companyID,
    //   userId: user.id,
    // });
    const countryDocs = await Country.find({
      _id: { $in: Array.isArray(id) ? id : [id] },
      companyId: user.companyID,
      userId: user.id,
    });

    if (!countryDocs.length) {
      return res.status(404).json({ message: "Country not found" });
    }
    const countryIds = countryDocs.map((c) => c._id);

    // 1️⃣ Find states of this country
    const states = await State.find({
      countryId: { $in: countryIds },
      companyId: user.companyID,
      userId: user.id,
    });
    const stateIds = states.map((s) => s._id);

    // 2️⃣ Find zones
    const zones = await Zone.find({
      stateId: { $in: stateIds },
      companyId: user.companyID,
      userId: user.id,
    });
    const zoneIds = zones.map((z) => z._id);

    // 3️⃣ Find weredas
    const weredas = await Wereda.find({
      zoneId: { $in: zoneIds },
      companyId: user.companyID,
      userId: user.id,
    });
    const weredaIds = weredas.map((w) => w._id);

    // Find cities
    const cities = await City.find({
      weredaId: { $in: weredaIds },
      companyId: user.companyID,
      userId: user.id,
    });
    // const cityIds = cities.map((c) => c._id);

    const stateIdsString = states.length
      ? states.map((s) => s._id.toString())
      : [];
    const zoneIdsString = zones.length
      ? zones.map((z) => z._id.toString())
      : [];
    const weredaIdsString = weredas.length
      ? weredas.map((w) => w._id.toString())
      : [];
    const cityIdsString = cities.length
      ? cities.map((c) => c._id.toString())
      : [];

    // Save all documents to RecycleBin
    // const allToRecycle = [
    //   ...countryDocs.map((c) => ({
    //     collectionName: "Country",
    //     originalId: c._id,
    //     data: c.toObject({ depopulate: true }), // convert to plain JS object
    //     deletedBy: user.id,
    //     companyId: user.companyID,
    //     userId: user.id,
    //   })),
    //   ...states.map((s) => ({
    //     collectionName: "State",
    //     originalId: s._id,
    //     data: s.toObject({ depopulate: true }),
    //     deletedBy: user.id,
    //     companyId: user.companyID,
    //     userId: user.id,
    //   })),

    //   ...zones.map((z) => ({
    //     collectionName: "Zone",
    //     originalId: z._id,
    //     data: z.toObject({ depopulate: true }),
    //     deletedBy: user.id,
    //     companyId: user.companyID,
    //     userId: user.id,
    //   })),

    //   ...weredas.map((w) => ({
    //     collectionName: "Wereda",
    //     originalId: w._id,
    //     data: w.toObject({ depopulate: true }),
    //     deletedBy: user.id,
    //     companyId: user.companyID,
    //     userId: user.id,
    //   })),

    //   ...cities.map((c) => ({
    //     collectionName: "City",
    //     originalId: c._id,
    //     data: c.toObject({ depopulate: true }),
    //     deletedBy: user.id,
    //     companyId: user.companyID,
    //     userId: user.id,
    //   })),
    // ];

    const allToRecycle = [];

    for (const country of countryDocs) {
      const rootId = country._id;

      // Country
      allToRecycle.push({
        collectionName: "Country",
        originalId: country._id,
        rootId,
        data: country.toObject({ depopulate: true }),
        deletedBy: user.id,
        companyId: user.companyID,
        userId: user.id,
      });

      // States under this country
      states
        .filter((s) => s.countryId.equals(country._id))
        .forEach((s) => {
          allToRecycle.push({
            collectionName: "State",
            originalId: s._id,
            rootId,
            data: s.toObject({ depopulate: true }),
            deletedBy: user.id,
            companyId: user.companyID,
            userId: user.id,
          });
        });
    }

    // Zones
    for (const state of states) {
      const rootId = state.countryId;

      zones
        .filter((z) => z.stateId.equals(state._id))
        .forEach((z) => {
          allToRecycle.push({
            collectionName: "Zone",
            originalId: z._id,
            rootId,
            data: z.toObject({ depopulate: true }),
            deletedBy: user.id,
            companyId: user.companyID,
            userId: user.id,
          });
        });
    }

    // Weredas
    for (const zone of zones) {
      const rootId = states.find((s) => s._id.equals(zone.stateId))?.countryId;

      weredas
        .filter((w) => w.zoneId.equals(zone._id))
        .forEach((w) => {
          allToRecycle.push({
            collectionName: "Wereda",
            originalId: w._id,
            rootId,
            data: w.toObject({ depopulate: true }),
            deletedBy: user.id,
            companyId: user.companyID,
            userId: user.id,
          });
        });
    }

    // Cities
    for (const wereda of weredas) {
      const rootId = states.find((s) =>
        zones.find((z) => z._id.equals(wereda.zoneId))?.stateId.equals(s._id)
      )?.countryId;

      cities
        .filter((c) => c.weredaId.equals(wereda._id))
        .forEach((c) => {
          allToRecycle.push({
            collectionName: "City",
            originalId: c._id,
            rootId,
            data: c.toObject({ depopulate: true }),
            deletedBy: user.id,
            companyId: user.companyID,
            userId: user.id,
          });
        });
    }

    await RecycleBin.insertMany(allToRecycle);

    // Delete from original collections

    // Delete employees
    await Employee.deleteMany({
      companyId: user.companyID,
      userId: user.id,
      $or: [
        { country: id },
        { state: { $in: stateIdsString } },
        { zone: { $in: zoneIdsString } },
        { wereda: { $in: weredaIdsString } },
        { city: { $in: cityIdsString } },
      ],
    });

    // Delete cities
    await City.deleteMany({
      weredaId: { $in: weredaIds },
      companyId: user.companyID,
      userId: user.id,
    });

    // 5Delete weredas
    await Wereda.deleteMany({
      _id: { $in: weredaIds },
      companyId: user.companyID,
      userId: user.id,
    });

    // 6Delete zones
    await Zone.deleteMany({
      _id: { $in: zoneIds },
      companyId: user.companyID,
      userId: user.id,
    });

    // Delete states
    await State.deleteMany({
      _id: { $in: stateIds },
      companyId: user.companyID,
      userId: user.id,
    });

    // Delete many countries
    await Country.deleteMany({
      _id: { $in: countryIds },
      companyId: user.companyID,
      userId: user.id,
    });

    // await session.commitTransaction();
    // session.endSession();

    res.json({
      message: "Country and all related records deleted successfully",
    });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting country and related records" });
  }
};

const remove = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  try {
    const { id } = req.params;
    const user = req.user; // from auth middleware

    // Find country
    const country = await Country.findOne({
      _id: id,
      companyId: user.companyID,
      userId: user.id,
    });

    const rootId = country._id;

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    // 1️⃣ Find states of this country
    const states = await State.find({
      countryId: id,
      companyId: user.companyID,
      userId: user.id,
    });
    const stateIds = states.map((s) => s._id);

    // 2️⃣ Find zones
    const zones = await Zone.find({
      stateId: { $in: stateIds },
      companyId: user.companyID,
      userId: user.id,
    });
    const zoneIds = zones.map((z) => z._id);

    // 3️⃣ Find weredas
    const weredas = await Wereda.find({
      zoneId: { $in: zoneIds },
      companyId: user.companyID,
      userId: user.id,
    });
    const weredaIds = weredas.map((w) => w._id);

    // Find cities
    const cities = await City.find({
      weredaId: { $in: weredaIds },
      companyId: user.companyID,
      userId: user.id,
    });
    // const cityIds = cities.map((c) => c._id);

    const stateIdsString = states.length
      ? states.map((s) => s._id.toString())
      : [];
    const zoneIdsString = zones.length
      ? zones.map((z) => z._id.toString())
      : [];
    const weredaIdsString = weredas.length
      ? weredas.map((w) => w._id.toString())
      : [];
    const cityIdsString = cities.length
      ? cities.map((c) => c._id.toString())
      : [];

    // Save all documents to RecycleBin
    const allToRecycle = [
      {
        collectionName: "Country",
        originalId: country._id,
        rootId: rootId,
        data: country.toObject({ depopulate: true }), // convert to plain JS object
        deletedBy: user.id,
        companyId: user.companyID,
        userId: user.id,
      },
      ...states.map((s) => ({
        collectionName: "State",
        originalId: s._id,
        rootId: rootId,
        data: s.toObject({ depopulate: true }),
        deletedBy: user.id,
        companyId: user.companyID,
        userId: user.id,
      })),

      ...zones.map((z) => ({
        collectionName: "Zone",
        originalId: z._id,
        rootId: rootId,
        data: z.toObject({ depopulate: true }),
        deletedBy: user.id,
        companyId: user.companyID,
        userId: user.id,
      })),

      ...weredas.map((w) => ({
        collectionName: "Wereda",
        originalId: w._id,
        rootId: rootId,
        data: w.toObject({ depopulate: true }),
        deletedBy: user.id,
        companyId: user.companyID,
        userId: user.id,
      })),

      ...cities.map((c) => ({
        collectionName: "City",
        originalId: c._id,
        rootId: rootId,
        data: c.toObject({ depopulate: true }),
        deletedBy: user.id,
        companyId: user.companyID,
        userId: user.id,
      })),
    ];

    await RecycleBin.insertMany(allToRecycle);

    // Delete from original collections

    // Delete employees
    await Employee.deleteMany({
      companyId: user.companyID,
      userId: user.id,
      $or: [
        { country: id },
        { state: { $in: stateIdsString } },
        { zone: { $in: zoneIdsString } },
        { wereda: { $in: weredaIdsString } },
        { city: { $in: cityIdsString } },
      ],
    });

    // Delete cities
    await City.deleteMany({
      weredaId: { $in: weredaIds },
      companyId: user.companyID,
      userId: user.id,
    });

    // 5Delete weredas
    await Wereda.deleteMany({
      _id: { $in: weredaIds },
      companyId: user.companyID,
      userId: user.id,
    });

    // 6Delete zones
    await Zone.deleteMany({
      _id: { $in: zoneIds },
      companyId: user.companyID,
      userId: user.id,
    });

    // Delete states
    await State.deleteMany({
      _id: { $in: stateIds },
      companyId: user.companyID,
      userId: user.id,
    });

    // Delete country
    await Country.deleteOne({
      _id: id,
      companyId: user.companyID,
      userId: user.id,
    });

    // await session.commitTransaction();
    // session.endSession();

    res.json({
      message: "Country and all related records deleted successfully",
    });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting country and related records" });
  }
};
// Step 2: Create a default export object
const countryAPI = {
  list,
  getOne,
  create,
  update,
  remove,
  removeMany,
};

export default countryAPI;
