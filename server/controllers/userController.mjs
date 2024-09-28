import jwt from "jsonwebtoken";

const createToken = (_id) =>
  jwt.sign({ _id }, process.env.REACT_APP_SECRET, { expiresIn: "3d" });

const loginUser = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const user = await User.login(username, email, password);

    const token = createToken(user._id);
    res
      .status(200)
      .json({ username, email, token, favorites: user?.favorites });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.signup(email, password, username);

    const token = createToken(user._id);
    res.status(200).json({ username, token, email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUserEmail = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.updateEmail(username, email);
    const token = createToken(user._id);

    res.status(200).json({ username, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFavorites = async (req, res) => {
  const username = req.params.username;
  try {
    const { favorites } = await User.findOne({
      username: username.toLowerCase(),
    })
      .select({ favorites: 1, _id: 0 })
      .sort({
        createdAd: -1,
      });
    const response = await Movie.find({
      _id: { $in: favorites },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateFavorites = async (req, res) => {
  const { username, favorite } = req.body;

  const response = await User.findOneAndUpdate(
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
    { returnOriginal: false, returnDocument: true }
  );
  // const exists = await User.find({
  //   username: username.toLowerCase(),
  //   favorites: { $in: favorite },
  // }).count()

  // const param = exists
  //   ? {
  //       $pull: {
  //         favorites: favorite,
  //       },
  //     }
  //   : {
  //       $addToSet: {
  //         favorites: favorite,
  //       },
  //     }

  // const response = await User.updateOne(
  //   { username: username.toLowerCase() },
  //   param
  // ).sort({ createdAd: -1 })

  res.status(200).json(response);
};

export default {
  loginUser,
  signupUser,
  updateUserEmail,
  getFavorites,
  updateFavorites,
};
