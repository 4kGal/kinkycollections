const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: false,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    favorites: {
      type: [String],
      required: false,
    },
  },
  { collection: "users" }
)

userSchema.statics.signup = async function (email, password, username) {
  const emailExists = await this.findOne({ email })
  const usernameExists = await this.findOne({ username })

  if ((!email || !username) && !password) {
    throw Error("Please enter required fields")
  }

  if (email && emailExists) {
    throw Error("Email already in use")
  }
  if (username && usernameExists) {
    throw Error("Username already in use")
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({
    email: email?.toLowerCase(),
    password: hash,
    username: username.toLowerCase(),
  })

  return user
}

userSchema.statics.login = async function (username, email, password) {
  if (!password || (!username && !email)) {
    throw Error("Please enter required fields")
  }

  const user = username
    ? await this.findOne({ username: username.toLowerCase() })
    : await this.findOne({ email: email?.toLowerCase() })

  if (!user) {
    throw Error(`Incorrect ${username ? "username" : "email"}`)
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error("Incorrect password")
  }

  return user
}

userSchema.statics.updateEmail = async function (username, email) {
  if (!username || !email) {
    throw Error("Please enter required fields")
  }
  const user = await this.updateOne(
    { username: username.toLowerCase() },
    {
      $set: {
        email,
      },
    }
  )

  return user
}

module.exports = mongoose.model("User", userSchema)
