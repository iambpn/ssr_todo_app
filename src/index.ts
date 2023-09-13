import express from "express";
import nunjucks from "nunjucks";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = express();

//  setting up view path and extension
app.set("views", path.join(__dirname, "../", "views"));
app.set("view engine", "njk");

// setting up template engine
nunjucks.configure("views", {
  autoescape: true,
  express: app,
  dev: process.env.NODE_ENV === "development",
  watch: process.env.NODE_ENV === "development",
});

app.get("/", (req, res) => {
  res.render("body/index", {});
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
