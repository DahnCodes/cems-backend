import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "organizer", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;