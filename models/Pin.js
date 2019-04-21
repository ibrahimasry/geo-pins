const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pinSchema = new Schema(
  {
    title: String,
    content: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    image: String,
    lat: Number,
    lng: Number
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

pinSchema.virtual("comments", {
  ref: "Comment", // what model to link?
  localField: "_id", // which field on the pin?
  foreignField: "pin" // which field on the comment?
});

function autoPopulate(next) {
  this.populate("author");
  next();
}

pinSchema.pre("find", autoPopulate);
pinSchema.pre("findOne", autoPopulate);

module.exports = mongoose.model("Pin", pinSchema);
