import express from "express";
import jwt from "jsonwebtoken";
import db from "../db/conn.mjs";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import pkg from "lodash";
const { isEmpty } = pkg;

const router = express.Router();

const createToken = (_id) =>
  jwt.sign({ _id }, process.env.REACT_APP_SECRET, { expiresIn: "3d" });

router.post("/login", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    if (!password || (!username && !email)) {
      throw Error("Please enter required fields");
    }

    const user = username
      ? await db
          .collection("users")
          .findOne({ username: username.toLowerCase() })
      : await db.collection("users").findOne({ email: email?.toLowerCase() });

    if (isEmpty(user)) {
      throw Error(`Incorrect ${username ? "username" : "email"}`);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw Error("Incorrect password");
    }

    const token = createToken(user._id);

    res.status(200).json({
      ...user,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const emailExists = await db.collection("users").findOne({ email });
    const usernameExists = await db.collection("users").findOne({ username });

    if ((!email || !username) && !password) {
      throw Error("Please enter required fields");
    }

    if (email && emailExists) {
      throw Error("Email already in use");
    }
    if (username && usernameExists) {
      throw Error("Username already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await db.collection("users").insertOne({
      email: email?.toLowerCase(),
      password: hash,
      username: username.toLowerCase(),
      favorites: [],
      comments: [],
      likes: [],
      hideUnderage: true,
      userRoles: "",
    });

    const token = createToken(user._id);

    res.status(200).json({
      username,
      token,
      favorites: [],
      comments: [],
      likes: [],
      hideUnderage: true,
      email: email?.toLowerCase(),
      userRoles: "",
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error: error.message });
  }
});

router.put("/updateEmail", async (req, res) => {
  const { username, email } = req.body;
  try {
    if (!username || !email) {
      throw Error("Please enter required fields");
    }

    const { value } = await db.collection("users").findOneAndUpdate(
      {
        username: username.toLowerCase(),
      },
      [
        {
          $set: {
            email,
          },
        },
      ],
      { returnOriginal: false, returnDocument: "after" }
    );

    res.status(200).json(value);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/favorites/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const { favorites } = await db.collection("users").findOne({
      username: username.toLowerCase(),
    });

    const favoriteIds = favorites?.map((favorite) => new ObjectId(favorite));

    const listOfCollInfos = await db.listCollections().toArray();

    const allCollections = listOfCollInfos.map((coll) => coll.name);

    const favoriteMovies = [];
    for (var i in allCollections) {
      const movies = await db
        .collection(allCollections[i])
        .find({
          _id: { $in: favoriteIds },
        })
        .toArray();
      favoriteMovies.push(
        movies?.map((movie) => ({ ...movie, collection: allCollections[i] }))
      );
    }

    const response = favoriteMovies.flat();

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  const { username, hideUnderage } = req.body;

  const { value } = await db.collection("users").findOneAndUpdate(
    {
      username: username.toLowerCase(),
    },
    [
      {
        $set: {
          hideUnderage,
        },
      },
    ],
    { returnOriginal: false, returnDocument: "after" }
  );

  res.status(200).json(value);
});

router.put("/favorites", async (req, res) => {
  const { username, favorite, userRoles } = req.body;
  // const usr = jwt.decode(userRoles);
  try {
    // if (usr.Role !== "Admin") {
    //   throw Error("Only admins can edit");
    // }
    const { value } = await db.collection("users").findOneAndUpdate(
      {
        username: username.toLowerCase(),
      },
      [
        {
          $set: {
            favorites: {
              $cond: [
                {
                  $in: [favorite, "$favorites"],
                },
                {
                  $filter: {
                    input: "$favorites",
                    cond: {
                      $ne: ["$$this", favorite],
                    },
                  },
                },
                {
                  $concatArrays: ["$favorites", [favorite]],
                },
              ],
            },
          },
        },
      ],
      { returnOriginal: false, returnDocument: "after" }
    );

    res.status(200).json(value);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
