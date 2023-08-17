import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import videoRoutes from "./routes/videos.mjs";
import searchRoutes from "./routes/search.mjs";
import userRoutes from "./routes/user.mjs";
import path from "path";
const __dirname = path.resolve();

const app = express();

app.use(express.static(__dirname)); //here is important thing - no static directory, because all static :)

app.use(express.static("./assets/collection"));

app.use(express.static("static"));

app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "http://localhost:3000",
      "http://localhost:80",
      "https://kinky-collection.onrender.com",
      "https://www.kinkycollection.net",
      "https://kinkycollection.net",
    ],
  })
);
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/search", searchRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")))
// }

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "static/index.html"));
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"))
// })

const PORT = 1337;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
// app.listen(4000, function () {
//   console.log("Listening on port 4000!")
// })
