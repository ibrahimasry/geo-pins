const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    pin: { type: Schema.Types.ObjectId, ref: "Pin" }
  },

  { timestamps: true }
);

function autoPopulate(next) {
  this.populate("author");
  next();
}

commentSchema.pre("find", autoPopulate);
commentSchema.pre("findOne", autoPopulate);
commentSchema.pre("save", autoPopulate);

module.exports = mongoose.model("Comment", commentSchema);
