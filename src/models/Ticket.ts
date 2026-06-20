import { Schema, model, models } from "mongoose";

const ticketSchema = new Schema(
  {
    ticketCode: {
      type: String,
      required: true,
      unique: true,
    },

    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    registrationId: {
      type: Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },

    checkedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.Ticket || model("Ticket", ticketSchema);