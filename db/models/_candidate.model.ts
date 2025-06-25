import mongoose, { model, models } from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  github: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  resume: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Candidate = models?.Candidate || model("Candidate", candidateSchema);

export default Candidate;
