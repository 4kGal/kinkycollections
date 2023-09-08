import express from "express";
import db from "../db/conn.mjs";
import pkg from "lodash";
const { sortBy, get, split, isArray } = pkg;

const router = express.Router();
router.get("/", async (req, res) => {
  const { collection } = req.query;
  let { searchTerm } = req.query;
  const underage = req.query.hideUnderage === "false" ? true : false;

  searchTerm = searchTerm.toLowerCase();

  let gallery = [];
  try {
    if (collection) {
      gallery = await db
        .collection(collection)
        .find(!underage ? { underage } : {})
        .toArray();
    } else {
      const listOfCollInfos = await db.listCollections().toArray();

      const allCollections = listOfCollInfos
        .map((coll) => coll.name)
        .filter((coll) => coll !== "users");

      const tempArary = [];
      for (var i in allCollections) {
        const result = await db
          .collection(allCollections[i])
          .find(!underage ? { underage } : {})
          .toArray();

        tempArary.push(
          result?.map((video) => ({ ...video, collection: allCollections[i] }))
        );
      }
      gallery = tempArary.flat();
    }

    const results = gallery.filter((video) => {
      const actresses = get(video, "actresses", []);
      const customName = get(video, "customName", "");
      const name = get(video, "name", "");
      const title = get(video, "title", "");

      if (
        isArray(actresses) &&
        actresses?.find((actress) => actress.includes(searchTerm))
      ) {
        return video;
      }
      if (
        typeof customName === "string" &&
        customName?.toLowerCase().includes(searchTerm)
      )
        return video;
      if (typeof name === "string" && name?.toLowerCase().includes(searchTerm))
        return video;
      if (
        typeof title === "string" &&
        title?.toLowerCase().includes(searchTerm)
      )
        return video;
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// router.get("/", async (req, res, next) => {
//   const { text, collection } = req.query;

//   let movies = [];
//   try {
//     if (collection) {
//       movies = await db
//         .collection(collection)
//         .find({ $text: new RegExp(text, "gi") })
//         .toArray();
//     } else {
//       const listOfCollInfos = await db.listCollections().toArray();

//       const allCollections = listOfCollInfos
//         .map((coll) => coll.name)
//         .filter((coll) => coll !== "users");

//       const tempArary = [];
//       for (var i in allCollections) {
//         const result = await db
//           .collection(allCollections[i])
//           .find({ $text: { $search: new RegExp(text, "gi") } })
//           .toArray();

//         tempArary.push(
//           result?.map((movie) => ({ ...movie, collection: allCollections[i] }))
//         );
//       }
//       movies = tempArary.flat();
//     }
//     res.status(200).json(movies);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

router.get("/filter/:collection", async (req, res) => {
  const collection = await db.collection(req.params.collection);

  const sort = get(req.query, "sort", "recent");
  const typeOfBusts = get(req.query, "tags", []);
  const decadesParam = get(req.query, "decades", []);
  const eitherOr = get(req.query, "eitherOr", "or");
  const underage = req.query.hideUnderage === "false" ? true : false;
  const actresses = get(req.query, "actresses", []);
  const multipleActresses = get(req.query, "multipleActresses", "false");

  let movies = [];
  let tags = [];

  // recent
  let sortParam = { _id: -1 };
  if (sort === "oldest") {
    sortParam = { _id: 1 };
    // } else if (sort === "ascending") {
    //   sortParam = {}
    // } else if (sort === "descending") {
    //   sortParam = {}
  } else if (sort === "yearAsc") {
    sortParam = { year: -1 };
  } else if (sort === "yearDesc") {
    sortParam = { year: 1 };
  } else if (sort === "views") {
    sortParam = { views: -1 };
  }
  // No Filtering, Return all movies
  if (
    typeOfBusts.length === 0 &&
    decadesParam.length === 0 &&
    actresses.length === 0 &&
    multipleActresses === "false"
  ) {
    movies = await collection
      .find(!underage ? { underage } : {})
      //.find({})
      .sort(sortParam)
      .toArray();

    tags = movies.map(({ tags }) => tags);
  } else {
    const decadesArray = split(decadesParam, ",");

    const decades = decadesArray.map((yr) => ({
      year: { $gte: parseInt(yr), $lt: parseInt(yr) + 9 },
    }));

    const tagsFilter = split(typeOfBusts, ",").map((tag) => {
      return { tags: tag };
    });

    const tagQuery =
      eitherOr === "and"
        ? {
            $expr: {
              $setIsSubset: [tagsFilter.map(({ tags }) => tags), "$tags"],
            },
          }
        : { $or: tagsFilter };

    const actressesArray = split(actresses, ",");
    const actressesFilter = actressesArray.map((actress) => {
      return { actresses: actress };
    });

    const actressQuery =
      eitherOr === "and"
        ? {
            $expr: {
              $setIsSubset: [
                actressesFilter.map(({ actresses }) => actresses),
                "$actresses",
              ],
            },
          }
        : { $or: actressesFilter };

    const multiple = { "actresses.1": { $exists: true } };

    // db.mainstreambb.find({
    //   $and: [
    //     {
    //       $or: [
    //         { year: { $gte: 1990, $lte: 1999 } },
    //         { year: { $gte: 2020, $lte: 2029 } },
    //       ],
    //       //  $or: [{ tags: "knee" }, { tags: "kick" }],
    //       //  $expr: { $setIsSubset: [ [ "kick"], "$tags"  ] },

    //       // $and: [{ actresses: "Alice Lucy" }],
    //       // actresses: "Alice Lucy",
    //       //  $expr: { $setIsSubset: [ ["hit", "kick"], "$tags"  ] }
    //       //
    //     },
    //     { $or: [{ tags: "knee" }, { tags: "kick" }] },
    //     // { $expr: { $setIsSubset: [["kick", "knee"], "$tags"] } },
    //     {
    //       "actresses.1": { $exists: true },
    //       // $or: [{ actresses: "Alice Lucy" }, { actresses: "Alba Planas" }],
    //       // $expr: { $setIsSubset: [["Alice Lucy"], "$actresses"] },
    //       //
    //     },
    //   ],
    // })

    const query = {
      $and: [
        ...(decadesParam.length > 0 ? [{ $or: decades }] : []),
        ...(typeOfBusts.length > 0 ? [tagQuery] : []),
        ...(actresses.length > 0 ? [actressQuery] : []),
        ...(multipleActresses === "true" ? [multiple] : []),
        ...(!underage ? [] : [{ underage }]),
      ],
    };

    movies = await collection.find(query).sort(sortParam).toArray();

    const q = [
      { $unwind: "$tags" },
      ...(decadesParam.length > 0
        ? [
            {
              $match: {
                $or: decadesArray.map((year) => ({
                  year: { $lte: parseInt(year) + 9, $gte: parseInt(year) },
                })),
              },
            },
          ]
        : []),
      ...(actresses.length > 0
        ? [
            {
              $match: {
                $or: actressesArray.map((actress) => ({
                  actresses: actress,
                })),
              },
            },
          ]
        : []),
      {
        $group: {
          _id: "$_id",
          data: { $addToSet: "$tags" },
        },
      },
    ];

    const allTags = await collection.aggregate(q).toArray();
    tags = allTags.map((movie) => {
      return movie.data;
    });
  }

  const tagOccurences = tags
    .flat()
    .filter(
      (tag) =>
        tag !== "amateur" && tag !== "mainstream" && tag !== "ballbusting"
    )
    .reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});

  const tagObjArray = Object.keys(tagOccurences).map((key) => ({
    key,
    count: tagOccurences[key],
  }));

  const sortedTags = sortBy(tagObjArray, ["count", "key"]).reverse();

  const ranking = await db
    .collection("users")
    .find({}, { _id: 0, favorites: 1 })
    .toArray();

  const counts = {};
  const rankArray = ranking.map((rank) => rank.favorites).flat();
  rankArray.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });

  const keys = Object.keys(counts);

  const moviesWithCreationAndLikes = movies.map((movie) => {
    if (keys.includes(movie._id.toString())) {
      return {
        ...movie,
        addedDate: movie._id.getTimestamp(),
        likes: counts[movie._id],
      };
    } else {
      return { ...movie, addedDate: movie._id.getTimestamp(), likes: 0 };
    }
  });

  // moviesWithCreationAndLikes.sort(function (a, b) {
  //   const x = b.addedDate
  //   const y = a.addedDate
  //   return x < y ? -1 : x < y ? 1 : 0
  // })

  if (sort === "likes") {
    moviesWithCreationAndLikes.sort(function (a, b) {
      const x = b.likes;
      const y = a.likes;
      return x < y ? -1 : x < y ? 1 : 0;
    });
  }

  return res.status(200).json({
    gallery: moviesWithCreationAndLikes,
    tags: sortedTags,
  });
});
export default router;
