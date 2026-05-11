const express = require("express");
const router = express.Router();
const ConsentRecord = require("../model/ConsentRecord");
const { verifyToken, allowRoles } = require("../middleware/auth");
const { storage, cloudinary } = require("../utils/cloudinary");
const multer = require("multer");
const upload = multer({ storage });

// === CREATE Consent/DoLS Record ===
router.post(
  "/",
  verifyToken,
  allowRoles("Admin", "Staff"),
  upload.array("attachments"),
  async (req, res) => {
    try {
      const {
        clientId,
        dolsInPlace,
        authorizationEndDate,
        conditions,
      } = req.body;

      if (!clientId) {
        return res.status(400).json({ error: "clientId is required" });
      }

      const newRecord = new ConsentRecord({
        client: clientId,
        dolsInPlace,
        authorizationEndDate,
        conditions,
        status: "Active",
        attachments: req.files?.map((file) => file.path) || [],
      });

      const savedRecord = await newRecord.save();
      res.status(201).json(savedRecord);
    } catch (error) {
      console.error("Error creating Consent Record:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// === GET All Consent Records for a Client ===
router.get(
  "/client/:clientId",
  verifyToken,
  allowRoles("Admin", "Staff", "Client", "Family", "External"),
  async (req, res) => {
    try {
      const records = await ConsentRecord.find({ client: req.params.clientId }).sort({
        createdAt: -1,
      });
      res.status(200).json(records);
    } catch (error) {
      console.error("Error fetching Consent Records:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// === GET — Consent Records older than 6 months ===
router.get(
  "/older-than-six-months",
  verifyToken,
  allowRoles("Admin", "Staff", "Client", "External", "Family"),
  async (req, res) => {
    try {
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - 6);

      const records = await ConsentRecord.find({
        $or: [
          { authorizationEndDate: { $lt: cutoff, $ne: null } },
          { authorizationEndDate: null, createdAt: { $lt: cutoff } }
        ]
      })
        .populate("client", "fullName")
        .sort({ createdAt: -1 });

      res.status(200).json({
        count: records.length,
        cutoff: cutoff.toISOString(),
        records,
      });
    } catch (error) {
      console.error("Error fetching older Consent Records:", error);
      res.status(500).json({ error: "Failed to fetch older consent records" });
    }
  }
);

// === UPDATE Consent Record ===
router.put(
  "/:id",
  verifyToken,
  allowRoles("Admin", "Staff"),
  upload.array("attachments"),
  async (req, res) => {
    try {
      const updateBody = { ...req.body };

      // Merge old (kept) attachments with newly uploaded files
      const keptAttachments = req.body.oldAttachments
        ? (Array.isArray(req.body.oldAttachments) ? req.body.oldAttachments : [req.body.oldAttachments])
        : [];
      const newUploadedPaths = req.files?.map((file) => file.path) || [];
      if (keptAttachments.length > 0 || newUploadedPaths.length > 0) {
        updateBody.attachments = [...keptAttachments, ...newUploadedPaths];
      }
      delete updateBody.oldAttachments;

      const updatedRecord = await ConsentRecord.findByIdAndUpdate(
        req.params.id,
        updateBody,
        { new: true }
      );

      if (!updatedRecord) {
        return res.status(404).json({ error: "Consent Record not found" });
      }

      res.status(200).json(updatedRecord);
    } catch (error) {
      console.error("Error updating Consent Record:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// === DELETE Consent Record ===
router.delete(
  "/:id",
  verifyToken,
  allowRoles("Admin"),
  async (req, res) => {
    try {
      const deletedRecord = await ConsentRecord.findByIdAndDelete(req.params.id);
      if (!deletedRecord) {
        return res.status(404).json({ error: "Consent Record not found" });
      }
      res.status(200).json({ message: "Consent Record deleted successfully" });
    } catch (error) {
      console.error("Error deleting Consent Record:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
