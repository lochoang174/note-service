var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["0", "1", "2"],
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Note", NoteSchema);
