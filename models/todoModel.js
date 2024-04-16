import mongoose from "mongoose";

//create schema
const todoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      trim: true,
      default: 'incomplete',
    },

    trash: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//export user schema

export default mongoose.model("Todo", todoSchema);
