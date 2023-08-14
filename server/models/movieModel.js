const mongoose = require("mongoose")

const MovieSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    folder: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    actresses: {
      type: [String],
      required: false,
    },
    year: {
      type: Number,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
  },
  { collection: "mainstreambb" }
)

MovieSchema.set("timestamps", true)
const MovieModel = mongoose.model("movie", MovieSchema)
module.exports = MovieModel
