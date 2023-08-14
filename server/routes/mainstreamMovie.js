const express = require("express")
const router = express.Router()
const MovieModel = require("../models/movieModel")
const thumbsupply = require("thumbsupply")
const fs = require("fs")
const { sortBy } = require("lodash")

router.get("/", async (req, res) => {
  const movies = await MovieModel.find({})
    .sort({
      createdAd: -1,
    })
    .lean()

  const minYear = await MovieModel.aggregate([
    { $group: { _id: {}, lowestYear: { $min: "$year" } } },
  ])

  const tags = await MovieModel.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$_id", data: { $addToSet: "$tags" } } },
  ])

  const allTags = tags
    .map((tag) => tag.data)
    .flat()
    .filter((tag) => tag !== "mainstream" && tag !== "ballbusting")

  const tagOccurences = allTags.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  }, {})

  const tagObjArray = Object.keys(tagOccurences).map((key) => ({
    key,
    count: tagOccurences[key],
  }))

  const sortedTags = sortBy(tagObjArray, ["count", "key"]).reverse()

  const { lowestYear } = minYear[0]

  const years = await MovieModel.aggregate([
    { $unwind: "$year" },
    { $group: { _id: "$_id", data: { $addToSet: "$year" } } },
  ])

  const allYears = years.map((tag) => tag.data).flat()

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

  // TODO: Simplify
  // const noDuplicateTags = [
  //   ...new Set(
  //     tags
  //       .map((tag) => tag.data)
  //       .filter((tag) => tag)
  //       .flat()
  //   ),
  // ].filter((tag) => tag !== "mainstream" && tag !== "ballbusting")

  res.status(200).json({
    lowestYear,
    tags: sortedTags,
    decades: availableDecades,
  })
})

router.get("/:id", async function (req, res) {
  const movieObject = await MovieModel.findOne({ _id: req.params.id })

  //const movieObject = mainstreambbData[req.params.id]
  const name = movieObject.name
  const path = `${movieObject.folder}${name}.mp4`

  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    //console.log("we have range", range)
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    //console.log(parts)
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
   // console.log("no range", range)
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

router.get("/:id/poster", async (req, res) => {
  const movieObject = await MovieModel.findOne({
    _id: req.params.id,
  })
  const name = movieObject.name
  const path = `${movieObject.folder}${name}.mp4`
  thumbsupply
    .generateThumbnail(path)
    .then((thumb) => res.sendFile(thumb))
    .catch((err) => console.log(err))
})

router.post("/", async (req, res) => {
  const { name, folder } = req.body

  try {
    const movie = await MovieModel.create({ name, folder })
    res.status(200).json(movie)
  } catch (error) {
    console.error(error)
  }
  res.json({ msg: "Post movie" })
})

router.get("/:id/data", async (req, res) => {
  const movieObject = await MovieModel.findOne({
    _id: req.params.id,
  })
  const name = movieObject.name
  res.status(200).json({ name })
})

module.exports = router
