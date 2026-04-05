const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Assessment = require("../model/Assessment");
const { verifyToken, allowRoles } = require("../middleware/auth");

// ==========================================
// ✅ CREATE ASSESSMENT
// ==========================================
router.post("/", verifyToken, allowRoles("Admin", "Staff"), async (req, res) => {
  try {
    const newAssessment = new Assessment(req.body);
    const saved = await newAssessment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// ✅ GET ALL ASSESSMENTS FOR A CLIENT
// ==========================================
router.get("/client/:clientId", verifyToken, allowRoles("Admin", "Staff", "Client", "Family", "External"), async (req, res) => {
  try {
    const assessments = await Assessment.find({ client: req.params.clientId })
      .populate("staff", "fullName position")
      .sort({ createdAt: -1 });
    res.status(200).json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ✅ GET ALL ASSESSMENTS FOR A STAFF (linked through their clients)
// ==========================================
router.get("/staff/:staffId", verifyToken, allowRoles("Admin", "Staff"), async (req, res) => {
  try {
    const assessments = await Assessment.find({ staff: req.params.staffId })
      .populate("client", "fullName roomNumber profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ✅ GET SINGLE ASSESSMENT BY ID
// ==========================================
router.get("/:id", verifyToken, allowRoles("Admin", "Staff", "Client", "Family", "External"), async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate("client", "fullName roomNumber")
      .populate("staff", "fullName position");
    if (!assessment) return res.status(404).json({ msg: "Assessment not found" });
    res.status(200).json(assessment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ✅ UPDATE ASSESSMENT
// ==========================================
router.put("/:id", verifyToken, allowRoles("Admin", "Staff"), async (req, res) => {
  try {
    const updated = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: "Assessment not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// ✅ DELETE ASSESSMENT
// ==========================================
router.delete("/:id", verifyToken, allowRoles("Admin"), async (req, res) => {
  try {
    const deleted = await Assessment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Assessment not found" });
    res.status(200).json({ msg: "Assessment deleted", data: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
