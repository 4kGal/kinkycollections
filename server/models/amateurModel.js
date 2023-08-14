const mongoose = require("mongoose")

const AmateurSchema = new mongoose.Schema(
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
    underage: {
      type: Boolean,
      require: false,
    },
    customName: {
      type: String,
      required: false,
    },
  },
  { collection: "amateurbb" }
)

AmateurSchema.set("timestamps", true)
const AmateurModel = mongoose.model("amateur", AmateurSchema)
module.exports = AmateurModel
