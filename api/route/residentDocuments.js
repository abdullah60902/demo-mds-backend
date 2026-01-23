const express = require("express");
const router = express.Router();
const multer = require("multer");
const { cloudinary, storage } = require("../utils/cloudinary");
const upload = multer({ storage });

const ResidentDocument = require("../model/ResidentDocument");
const { verifyToken, allowRoles } = require("../middleware/auth");
const extractPublicIdFromUrl = require("../utils/extractPublicId");

// ==================
// CREATE Resident Document
// ==================
router.post(
  "/",
  verifyToken,
  allowRoles("Admin", "Staff"),
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("Upload Request Body:", req.body);
      console.log("Upload Request File:", req.file);

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const residentDoc = new ResidentDocument({
        client: req.body.client, // This will be the clientId
        category: req.body.category,
        expiryDate: req.body.expiryDate,
        notes: req.body.notes,
        fileUrl: req.file.path,
      });

      await residentDoc.save();
      res.status(201).json({ message: "Resident document added", data: residentDoc });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// ==================
// GET all documents for a specific resident
// ==================
router.get("/client/:clientId", verifyToken, async (req, res) => {
  try {
    const documents = await ResidentDocument.find({ client: req.params.clientId })
      .populate("client", "fullName roomNumber");

    res.json(documents);
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

// ==================
// GET all documents (Admin/Staff view)
// ==================
router.get("/", verifyToken, allowRoles("Admin", "Staff"), async (req, res) => {
  try {
    const documents = await ResidentDocument.find()
      .populate("client", "fullName roomNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================
// UPDATE Resident Document
// ==================
router.patch("/:id", verifyToken, allowRoles("Admin", "Staff"), async (req, res) => {
  try {
    const { category, expiryDate, notes } = req.body;
    const updated = await ResidentDocument.findByIdAndUpdate(
      req.params.id,
      { category, expiryDate, notes },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Resident document updated", data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==================
// DELETE Resident Document
// ==================
router.delete("/:id", verifyToken, allowRoles("Admin"), async (req, res) => {
  try {
    const deleted = await ResidentDocument.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });

    const publicId = extractPublicIdFromUrl(deleted.fileUrl);
    if (publicId) await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ message: "Resident document deleted", data: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
