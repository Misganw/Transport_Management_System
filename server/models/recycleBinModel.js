import mongoose from "mongoose";

const RecycleBinSchema = new mongoose.Schema({
  // 1️⃣ Which collection this document originally belonged to
  collectionName: {
    type: String,
    required: true, // e.g., "Country", "State", "Zone", "Wereda", "City", "Employee"
  },

  // 2️⃣ Original document ID
  originalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  rootId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  // 3️⃣ The full document data
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

  // 4️⃣ Optional info about who deleted it
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "useres", // references your User model
  },

  // 5️⃣ When the document was deleted
  deletedAt: {
    type: Date,
    default: Date.now,
  },

  // 6️⃣ Optional: company or user context, useful if multi-tenant
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("RecycleBin", RecycleBinSchema);
