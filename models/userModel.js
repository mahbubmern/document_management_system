import mongoose from "mongoose";

//create schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    index: {
      type: String,
      trim: true,
    },
    division: {
      type: String,
      trim: true,
      default: null,
    },
    department: {
      type: String,
      trim: true,
      default: null,
    },
    designation: {
      type: String,
      trim: true,
      default: null,
    },

    email: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },
    notification: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Incoming",
    },

    password: {
      type: String,
      required: true,
    },
    task: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Incoming",
    },
    todos: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Todo",
    },

    photo: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "superAdmin"],
    },

    accessToken: {
      type: String,
      trim: true,
      default: null,
    },
    isActivate: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    status: {
      type: Boolean,
      default: true,
    },

    trash: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//export user schema

export default mongoose.model("User", userSchema);
