const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ar_title: {
      type: String,
      required: true,
    },
    description:{
        type:String,
        required: true,
    },
    ar_description:{
        type:String,
        required: true,
    },
    state:{
        type:String,
        default:"Not Started Yet"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
