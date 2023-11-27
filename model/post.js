const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    // imageUrl: {
    //     type: String,
    //     required: true
    // },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", postsSchema);
