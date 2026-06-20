import mongoose, { Schema, model, models } from "mongoose";

const registrationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);


// prevent duplicate registrations
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Registration =
  models.Registration || model("Registration", registrationSchema);

export default Registration;