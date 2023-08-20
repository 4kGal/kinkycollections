const { default: mongoose } = require("mongoose");
const userModel = require("./userModel");

const CommentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    // set to current time somehow
    type: Date,
    required: true,
  },
  updatedAt: {
    // every time it's updated
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: false,
  },
  children: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    required: false,
  },
});

CommentSchema.set("timestamps", true);
const CommentModel = mongoose.model("Comment", CommentSchema);
module.exports = CommentModel;
