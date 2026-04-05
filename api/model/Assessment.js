const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  // Link to client (resident)
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  // Link to staff who created/is assigned
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Hr" },

  // Which assessment template type
  assessmentType: {
    type: String,
    enum: [
      "Client Assessment",
      "Care Plan",
      "Risk Assessment",
      "Daily Notes",
      "MAR Chart",
      "Incident Report",
      "Staff File",
      "Client Consent Form",
      "Support Worker Visit Log",
      "Home Environment Checklist",
      "Incident Reporting Form",
      "Lessons Learned",
      "Monthly Audit Summary",
      "Care Plan v2",
      "Risk Assessment v2",
      "Medication Error Log",
      "Initial Assessment",
      "Training Matrix",
      "CARE PROVIDER"
    ],
    required: true
  },

  // ========== 1. CLIENT ASSESSMENT ==========
  clientAssessment: {
    fullName: String,
    dateOfBirth: String,
    address: String,
    contactNumber: String,
    nextOfKin: String,
    gpDoctor: String,
    // Initial Assessment Areas
    personalCare: { notes: String, levelOfNeed: String },
    mobility: { notes: String, levelOfNeed: String },
    medication: { notes: String, levelOfNeed: String },
    nutrition: { notes: String, levelOfNeed: String },
    communication: { notes: String, levelOfNeed: String },
    mentalHealth: { notes: String, levelOfNeed: String },
    behaviour: { notes: String, levelOfNeed: String },
    environment: { notes: String, levelOfNeed: String },
    assessorName: String,
    signature: String,
    date: String
  },

  // ========== 2. CARE PLAN ==========
  carePlanTemplate: {
    preferredName: String,
    culturalReligiousNeeds: String,
    communicationStyle: String,
    likesDislikes: String,
    diagnoses: String,
    allergies: String,
    medication: String,
    mobilityNeeds: String,
    // Daily Support
    personalCare: String,
    mealsHydration: String,
    mobility: String,
    socialActivities: String,
    emotionalSupport: String,
    // Goals
    goals: [{ goal: String, timeframe: String, progress: String }],
    // Emergency
    emergencyContacts: String,
    medicalAlerts: String,
    hospitalPreference: String,
    clientSignature: String,
    familySignature: String,
    managerSignature: String
  },

  // ========== 3. RISK ASSESSMENT ==========
  riskAssessmentTemplate: {
    clientName: String,
    assessmentDate: String,
    // Risk Matrix
    risks: [{
      risk: String,
      likelihood: Number,
      impact: Number,
      score: Number,
      controls: String
    }],
    staffInstructions: String,
    equipmentRequired: String,
    monitoringFrequency: String,
    reviewSchedule: String,
    assessorSignature: String,
    managerSignature: String,
    clientSignature: String
  },

  // ========== 4. DAILY NOTES ==========
  dailyNotesTemplate: {
    clientName: String,
    date: String,
    staffName: String,
    activitiesCompleted: [String],
    medications: [{ medication: String, time: String, dose: String, staffInitials: String }],
    mood: String,
    behaviour: String,
    appetite: String,
    mobility: String,
    concerns: String,
    staffSignature: String
  },

  // ========== 5. MAR CHART ==========
  marTemplate: {
    clientName: String,
    month: String,
    medications: [{
      medication: String,
      dose: String,
      time: String,
      mon: String, tue: String, wed: String, thu: String, fri: String, sat: String, sun: String,
      notes: String
    }],
    staffInitialsKey: [String]
  },

  // ========== 6. INCIDENT REPORT ==========
  incidentReportTemplate: {
    date: String,
    time: String,
    location: String,
    staffInvolved: String,
    clientInvolved: String,
    description: String,
    immediateAction: String,
    injuries: [{ person: String, injury: String, treatment: String }],
    managerName: String,
    managerTimeNotified: String,
    managerActionTaken: String,
    followUpRequired: String,
    staffSignature: String,
    managerSignature: String
  },

  // ========== 8. CLIENT CONSENT FORM ==========
  consentFormTemplate: {
    clientName: String,
    consents: [{
      area: String,
      answer: String,
      notes: String
    }],
    clientSignature: String,
    familySignature: String,
    managerSignature: String
  },

  // ========== 9. SUPPORT WORKER VISIT LOG ==========
  visitLogTemplate: {
    clientName: String,
    weekStarting: String,
    visits: [{
      date: String,
      timeIn: String,
      timeOut: String,
      tasksCompleted: String,
      staffInitials: String
    }]
  },

  // ========== 10. HOME ENVIRONMENT CHECKLIST ==========
  homeChecklistTemplate: {
    areas: [{
      area: String,
      safe: String,
      unsafe: String,
      notes: String
    }],
    assessorSignature: String,
    date: String
  },

  // ========== INCIDENT REPORTING FORM (v2) ==========
  incidentReportingForm: {
    incidentDateTime: String,
    location: String,
    personsInvolved: String,
    typeOfIncident: String,
    description: String,
    immediateActions: String,
    medicalAttentionRequired: String,
    safeguardingConsidered: String,
    managerNotified: String,
    followUpActions: String,
    signature: String,
    date: String
  },

  // ========== LESSONS LEARNED ==========
  lessonsLearned: {
    incidentReference: String,
    date: String,
    whatHappened: String,
    rootCause: String,
    whatWentWell: String,
    whatDidntGoWell: String,
    learningPoints: String,
    actionsRequired: String
  },

  // ========== MONTHLY AUDIT SUMMARY ==========
  monthlyAuditSummary: {
    month: String,
    auditor: String,
    areaAudited: String,
    findings: String,
    score: String,
    actionsRequired: String,
    deadline: String
  },

  // ========== CARE PLAN v2 ==========
  carePlanV2: {
    serviceUserName: String,
    dateOfBirth: String,
    nhsNumber: String,
    aboutMe: String,
    needsPreferences: String,
    dailySupport: String,
    healthNeeds: String,
    risksSafety: String,
    communicationNeeds: String,
    goalsOutcomes: String,
    reviewDate: String
  },

  // ========== RISK ASSESSMENT v2 ==========
  riskAssessmentV2: {
    riskTitle: String,
    personAtRisk: String,
    assessor: String,
    date: String,
    hazard: String,
    likelihood: String,
    impact: String,
    riskLevel: String,
    controls: String,
    additionalControls: String
  },

  // ========== MEDICATION ERROR LOG ==========
  medicationErrorLog: {
    date: String,
    serviceUser: String,
    errorType: String,
    staffInvolved: String,
    actionTaken: String,
    outcome: String,
    managerReview: String
  },

  // ========== INITIAL ASSESSMENT ==========
  initialAssessment: {
    referralSource: String,
    assessmentDate: String,
    personalDetails: String,
    healthNeeds: String,
    socialNeeds: String,
    risks: String,
    capacityConsent: String,
    desiredOutcomes: String
  },

  // ========== TRAINING MATRIX ==========
  trainingMatrix: {
    staffName: String,
    trainingCourse: String,
    dateCompleted: String,
    expiryDate: String,
    status: String,
    notes: String
  },

  // General
  status: { type: String, default: "Draft", enum: ["Draft", "Completed", "Reviewed"] },
  notes: String,

}, { timestamps: true });

module.exports = mongoose.model("Assessment", assessmentSchema);
