import express from "express"
import cors from "cors"
import "./loadEnvironment.mjs"
import videoRoutes from "./routes/videos.mjs"
import searchRoutes from "./routes/search.mjs"
import userRoutes from "./routes/user.mjs"
import path from "path"
const __dirname = path.resolve()

const app = express()

let folderRoot = ""

// if (process.argv[2] && process.argv[2] === "local") {
//   console.log("Flag is present.")
//   folderRoot = "./assets/folders/local/"
// } else if (process.argv[2] && process.argv[2] === "image") {
//   console.log("Flag is present.")
//   folderRoot = "./assets/folders/image/"
//   app.use(express.static("Volumes/image/movie/bb/done/prevyoutube"))
// } else {
//   console.log("Flag is not present. Using remote")
//   folderRoot = "./assets/folders/remote/"
//   app.use(
//     express.static("Users/tucker/Downloads/mount/kinkycollection/mainstreambb/")
//   )
// }

app.use(express.static(__dirname)) //here is important thing - no static directory, because all static :)

app.use(express.static("./assets/collection"))

app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "http://localhost:3000",
      "http://localhost:80",
      "https://kinky-collection.onrender.com",
      "https://www.kinkycollection.com",
      "https://kinkycollection.com",
    ],
  })
)
app.use(express.json())

app.use("/api/user", userRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/search", searchRoutes)

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")))
// }

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "static/index.html"))
})

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"))
// })

const PORT = 1337
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
// app.listen(4000, function () {
//   console.log("Listening on port 4000!")
// })
