import mongoose, { Schema, model, models } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    registeredCount: {
      type: Number,
      default: 0,
    },

    coverImage: {
      type: String,
    },

    organizerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "published",
    },
  },
  { timestamps: true }
);

const Event = models.Event || model("Event", eventSchema);

export default Event;