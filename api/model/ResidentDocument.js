const mongoose = require("mongoose");

const residentDocumentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResidentDocument", residentDocumentSchema);
