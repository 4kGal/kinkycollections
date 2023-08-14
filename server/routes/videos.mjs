//const AmateurModel = require("../models/amateurModel")

import fs from "fs"
import express from "express"
import db from "../db/conn.mjs"
import { ObjectId } from "mongodb"
//import pkg from "lodash"
import Thumbler from 'thumbler'
import path from "path"
const __dirname = path.resolve()
//const { sortBy, groupBy, assign, spread } = pkg

const router = express.Router()

// router.get("/:collection", async (req, res) => {
//   let collection = await db.collection(req.params.collection)
//   let movies = await collection
//     .find({})
//     .sort({
//       _id: -1,
//     })
//     .toArray()

//   const tags = await collection
//     .aggregate([
//       { $unwind: "$tags" },
//       { $group: { _id: "$_id", data: { $addToSet: "$tags" } } },
//     ])
//     .toArray()

//   const allTags = tags
//     .map((tag) => tag.data)
//     .flat()
//     .filter(
//       (tag) =>
//         tag !== "mainstream" && tag !== "amateur" && tag !== "ballbusting"
//     )

//   const tagOccurences = allTags.reduce(function (acc, curr) {
//     return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
//   }, {})

//   const tagObjArray = Object.keys(tagOccurences).map((key) => ({
//     key,
//     count: tagOccurences[key],
//   }))

//   const sortedTags = sortBy(tagObjArray, ["count", "key"]).reverse()

//   const ranking = await db
//     .collection("users")
//     .find({}, { _id: 0, favorites: 1 })
//     .toArray()

//   const counts = {}
//   const rankArray = ranking.map((rank) => rank.favorites).flat()
//   rankArray.forEach(function (x) {
//     counts[x] = (counts[x] || 0) + 1
//   })

//   const keys = Object.keys(counts)

//   const moviesWithCreationAndLikes = movies.map((movie) => {
//     if (keys.includes(movie._id.toString())) {
//       return {
//         ...movie,
//         addedDate: movie._id.getTimestamp(),
//         likes: counts[movie._id],
//       }
//     } else {
//       return { ...movie, addedDate: movie._id.getTimestamp(), likes: 0 }
//     }
//   })

//   moviesWithCreationAndLikes.sort(function (a, b) {
//     const x = b.addedDate
//     const y = a.addedDate
//     return x < y ? -1 : x < y ? 1 : 0
//   })

//   // console.log(videos)
//   // console.log(sortedTags)
//   res.status(200).json({
//     movies: moviesWithCreationAndLikes,
//     tags: sortedTags,
//   })
//   // res.send(results).status(200)
// })

router.get("/:collection/settings", async (req, res) => {
  const collection = await db.collection(req.params.collection)

  const minYear = await collection
    .aggregate([{ $group: { _id: {}, lowestYear: { $min: "$year" } } }])
    .toArray()

  const data = await collection
    .aggregate([
      { $unwind: "$actresses" },
      { $unwind: "$tags" },
      { $unwind: "$year" },
      {
        $group: {
          _id: "$_id",
          actresses: { $addToSet: "$actresses" },
          tags: { $addToSet: "$tags" },
          years: { $addToSet: "$year" },
        },
      },
    ])
    .toArray()

  const allActresses = data
    .map((prop) =>
      prop.actresses
        .flat()
        .map((actress) => {
          return {
            actress,
            tags: prop.tags.filter(
              (tag) =>
                tag !== "mainstream" &&
                tag !== "ballbusting" &&
                tag !== "amateur"
            ),
          }
        })
        .flat()
    )
    .flat()
    .sort((a, b) => {
      let fa = a.actress.toLowerCase(),
        fb = b.actress.toLowerCase()

      if (fa < fb) {
        return -1
      }
      if (fa > fb) {
        return 1
      }
      return 0
    })

  const combinedActressTags = {}

  allActresses.forEach((obj) => {
    if (combinedActressTags[obj.actress]) {
      combinedActressTags[obj.actress] = [
        ...combinedActressTags[obj.actress],
        ...obj.tags,
      ]
    } else {
      combinedActressTags[obj.actress] = obj.tags
    }
  })
  const availableActresses = Object.keys(combinedActressTags).map((year) => ({
    actress: year,
    tags: combinedActressTags[year],
  }))

  const allYears = data.map((tag) => tag.years).flat()

  const yearOccurances = allYears.reduce(function (acc, curr) {
    return (
      acc[Math.floor(curr / 10) * 10]
        ? ++acc[Math.floor(curr / 10) * 10]
        : (acc[Math.floor(curr / 10) * 10] = 1),
      acc
    )
  }, {})

  const availableDecades = Object.keys(yearOccurances).map((year) => {
    return { [year]: yearOccurances[year] }
  })

  const obj = {
    lowestYear: minYear[0]?.lowestYear || "",
    decades: availableDecades,
    listOfActresses: availableActresses,
  }
  // console.log(minYear)
  res.send(obj).status(200)
})
router.get("/:collection/:id", async function (req, res) {
  const collection = await db.collection(req.params.collection)
  const movieObject = await collection.findOne({
    _id: new ObjectId(req.params.id),
  })

  const name = movieObject.name
  const path = `./assets/collection/${req.params.collection}/${name}.mp4`

  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  try {
    if (range) {
     console.log("we have range", range)
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
     console.log(parts)
      const chunksize = end - start + 1
      const file = fs.createReadStream(path, { start, end })
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      }
      res.writeHead(206, head)
      file.pipe(res)
    } else {
     console.log("no range", range)
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  } catch(e) {
    console.log('error')
  }
  
})

router.get("/:collection/:id/poster", async (req, res) => {
  const collection = await db.collection(req.params.collection)
  const movieObject = await collection.findOne({
    _id: new ObjectId(req.params.id),
  })

  const name = movieObject.name
  const outputFolder = `${__dirname}/assets/collection/${req.params.collection}/screenshots/${name}.jpeg`
  const videoSrc = `./assets/collection/${req.params.collection}/${name}.mp4`
  
  //if thumbnail exists:
  if (fs.existsSync(outputFolder)) {
    res.sendFile(outputFolder)
  } else {
    Thumbler({
      type: 'video', 
      input: videoSrc,
      output: outputFolder, 
      size: '400x200', // this optional if null will use the desimention of the video
  
  }, function(err, path){
      if (err) {
        res.sendFile('./assets/collection/thumbnail_not_available.png', {root: __dirname})
        console.log('Error retrieving screenshot', name, err)
        return err;
      }
      res.sendFile(outputFolder)
      return path;
  });
  }
})
router.get("/:collection/:id/data", async (req, res) => {
  const collection = await db.collection(req.params.collection)
  const movieObject = await collection.findOne({
    _id: new ObjectId(req.params.id),
  })
  const name = movieObject.name
  res.status(200).json({ name })
})

// module.exports = router
export default router
