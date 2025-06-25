import mongoose, { model, models } from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    hrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bookmark = models?.Bookmark || model("Bookmark", bookmarkSchema);

export default Bookmark;
