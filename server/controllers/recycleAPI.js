import express from "express";
import mongoose from "mongoose";
import Car from "../models/carsModel.js";
import Owner from "../models/ownersModel.js";
import RecycleBin from "../models/recycleBinModel.js";
import Country from "../models/addressModel/countryModel.js";
import State from "../models/addressModel/stateModel.js";
import Zone from "../models/addressModel/zoneModel.js";
import Wereda from "../models/addressModel/weredaModel.js";
import City from "../models/addressModel/cityModel.js";
import Employee from "../models/employeeModel.js";

// Map collection names to Mongoose models
const collectionModelMap = {
  Country,
  State,
  Zone,
  Wereda,
  City,
  Employee,
};

/**
 * GET /recycle-bin
 * List recycle bin records for current company
 */
const list = async (req, res) => {
  try {
    const user = req.user;
    const search = req.query.search || "";

    const filter = {
      companyId: user.companyID,
      ...(search && {
        $or: [
          { collectionName: { $regex: search, $options: "i" } },
          { "data.cName": { $regex: search, $options: "i" } },
          { "data.name": { $regex: search, $options: "i" } },
        ],
      }),
    };

    const records = await RecycleBin.find(filter).sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    console.error("RecycleBin list error:", error);
    res.status(500).json({ message: "Error loading recycle bin" });
  }
};

/** POST /recycle-bin/restore/:id. Restore ONE record
 */
// const restore = async (req, res) => {
//   try {
//     const user = req.user;
//     const { id } = req.params;

//     // 1️⃣ Find clicked recycle-bin record
//     const record = await RecycleBin.findOne({
//       _id: id,
//       companyId: user.companyID,
//     });

//     if (!record) {
//       return res.status(404).json({ message: "Record not found in recycle bin" });
//     }

//     // 2️⃣ Load ALL records with same rootId
//     const recycleDocs = await RecycleBin.find({
//       rootId: record.rootId,
//       companyId: user.companyID,
//     });

//     // 3️⃣ Restore in correct order (parent → child)
//     const restoreOrder = ["Country", "State", "Zone", "Wereda", "City"];

//     const restoredIds = [];

//     for (const collectionName of restoreOrder) {
//       const Model = collectionModelMap[collectionName];
//       if (!Model) continue;

//       const docs = recycleDocs.filter(
//         (d) => d.collectionName === collectionName
//       );

//       for (const d of docs) {
//         try {
//           await Model.create({
//             ...d.data,
//             _id: d.originalId,
//           });
//           restoredIds.push(d._id);
//         } catch (err) {
//           if (err.code !== 11000) throw err;
//         }
//       }
//     }

//     // 4️⃣ Remove restored recycle-bin records
//     await RecycleBin.deleteMany({
//       _id: { $in: restoredIds },
//     });

//     res.json({
//       message: "Hierarchy restored successfully",
//       restored: restoredIds.length,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error restoring record" });
//   }
// };

const restore = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    // 1️⃣ Find clicked recycle-bin record
    const record = await RecycleBin.findOne({
      _id: id,
      companyId: user.companyID,
    });

    if (!record) {
      return res
        .status(404)
        .json({ message: "Record not found in recycle bin" });
    }

    // 2️⃣ Load ALL records with same rootId
    const recycleDocs = await RecycleBin.find({
      rootId: record.rootId,
      companyId: user.companyID,
    });

    // 3️⃣ Restore in correct order (parent → child)
    const restoreOrder = ["Country", "State", "Zone", "Wereda", "City"];

    const restoredIds = [];

    for (const collectionName of restoreOrder) {
      const Model = collectionModelMap[collectionName];
      if (!Model) continue;

      const docs = recycleDocs.filter(
        (d) => d.collectionName === collectionName
      );

      for (const d of docs) {
        try {
          await Model.create({
            ...d.data,
            _id: d.originalId,
          });
          restoredIds.push(d._id);
        } catch (err) {
          if (err.code !== 11000) throw err;
        }
      }
    }

    // 4️⃣ Remove restored recycle-bin records
    await RecycleBin.deleteMany({
      _id: { $in: restoredIds },
    });

    res.json({
      message: "Hierarchy restored successfully",
      restored: restoredIds.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error restoring record" });
  }
};

/** POST /recycle-bin/restore Restore MANY records
 */
// const restoreMany = async (req, res) => {
//   try {
//     const user = req.user;
//     const { ids } = req.body;

//     if (!Array.isArray(ids) || !ids.length) {
//       return res.status(400).json({ message: "No records selected" });
//     }

//     const recycleDocs = await RecycleBin.find({
//       _id: { $in: ids },
//       companyId: user.companyID,
//     });

//     if (!recycleDocs.length) {
//       return res.status(404).json({ message: "No records found to restore" });
//     }

//     // group by collection
//     const grouped = {};
//     for (const doc of recycleDocs) {
//       grouped[doc.collectionName] ||= [];
//       grouped[doc.collectionName].push(doc);
//     }

//     const skipped = []; // to track duplicates
//     // restore per collection
//     for (const [collectionName, docs] of Object.entries(grouped)) {
//       const Model = collectionModelMap[collectionName];
//       if (!Model) {
//         console.warn(`No model found for collection: ${collectionName}`);
//         continue;
//       }

//       await Model.insertMany(
//         docs.map((d) => ({
//           ...d.data,
//           _id: d.originalId,
//         })),
//         { ordered: false }
//       );
//     }

//     await RecycleBin.deleteMany({ _id: { $in: ids } });

//     res.json({
//       message: `${recycleDocs.length} record(s) restored successfully`,
//     });
//   } catch (error) {
//     console.error("RestoreMany error:", error);
//     res.status(500).json({ message: "Error restoring records" });
//   }
// };

// const restoreMany = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     // Load recycle bin records
//     const recycleDocs = await RecycleBin.find({ _id: { $in: ids } });

//     // Group by collection
//     const grouped = recycleDocs.reduce((acc, doc) => {
//       if (!acc[doc.collectionName]) acc[doc.collectionName] = [];
//       acc[doc.collectionName].push(doc);
//       return acc;
//     }, {});

//     const skipped = [];
//     const restoredRecycleIds = []; //  IMPORTANT
//     const invalidCollections = [];

//     for (const [collectionName, docs] of Object.entries(grouped)) {
//       const Model = collectionModelMap[collectionName];
//       if (!Model) {
//         // Track invalid collection names
//         docs.forEach((d) =>
//           invalidCollections.push({
//             collection: collectionName,
//             _id: d.originalId,
//             reason: "Unknown collection",
//           })
//         );
//         continue;
//       }

//       for (const d of docs) {
//         try {
//           await Model.create({
//             ...d.data,
//             _id: d.originalId,
//           });

//           // restored successfully
//           restoredRecycleIds.push(d._id);
//         } catch (err) {
//           if (err.code === 11000) {
//             //  duplicate
//             skipped.push({
//               collection: collectionName,
//               _id: d.originalId,
//             });
//           } else {
//             throw err;
//           }
//         }
//       }
//     }

//     // Delete ONLY restored recycle bin records
//     if (restoredRecycleIds.length > 0) {
//       await RecycleBin.deleteMany({
//         _id: { $in: restoredRecycleIds },
//       });
//     }

//     res.json({
//       message: "Restore completed",
//       restored: restoredRecycleIds.length,
//       skipped,
//     });
//   } catch (err) {
//     console.error("RestoreMany error:", err);
//     res.status(500).json({ message: "Error restoring records" });
//   }
// };

// Step 2: Create a default export object

const RESTORE_ORDER = ["Country", "State", "Zone", "Wereda", "City"];

const restoreMany = async (req, res) => {
  try {
    const { ids } = req.body;
    const user = req.user;

    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: "No records selected" });
    }

    // 1️⃣ Load selected recycle-bin records
    const selectedDocs = await RecycleBin.find({
      _id: { $in: ids },
      companyId: user.companyID,
    });

    if (!selectedDocs.length) {
      return res.status(404).json({ message: "No records found" });
    }

    // 2️⃣ Collect rootIds (for cascade restore)
    const rootIds = [
      ...new Set(
        selectedDocs.filter((d) => d.rootId).map((d) => d.rootId.toString())
      ),
    ];

    // 3️⃣ Load ALL recycle-bin docs sharing those rootIds
    const recycleDocs = await RecycleBin.find({
      $or: [
        { _id: { $in: ids } }, // directly selected
        { rootId: { $in: rootIds } }, // cascaded children
      ],
      companyId: user.companyID,
    });

    // 4️⃣ Group by collection
    const grouped = recycleDocs.reduce((acc, doc) => {
      acc[doc.collectionName] ||= [];
      acc[doc.collectionName].push(doc);
      return acc;
    }, {});

    const restoredRecycleIds = [];
    const skipped = [];

    // 5️⃣ Restore in strict hierarchy order
    for (const collectionName of RESTORE_ORDER) {
      const docs = grouped[collectionName];
      if (!docs?.length) continue;

      const Model = collectionModelMap[collectionName];
      if (!Model) continue;

      for (const d of docs) {
        try {
          await Model.create({
            ...d.data,
            _id: d.originalId, // preserve original _id
          });

          restoredRecycleIds.push(d._id);
        } catch (err) {
          if (err.code === 11000) {
            skipped.push({
              collection: collectionName,
              _id: d.originalId,
            });
          } else {
            throw err;
          }
        }
      }
    }

    // 6️⃣ Remove restored docs from recycle bin
    if (restoredRecycleIds.length) {
      await RecycleBin.deleteMany({
        _id: { $in: restoredRecycleIds },
      });
    }

    res.json({
      message: "Restore completed",
      restored: restoredRecycleIds.length,
      skipped,
      cascadedRoots: rootIds.length,
    });
  } catch (err) {
    console.error("RestoreMany error:", err);
    res.status(500).json({ message: "Error restoring records" });
  }
};

const recycleAPI = {
  list,
  restore,
  restoreMany,
};

export default recycleAPI;
