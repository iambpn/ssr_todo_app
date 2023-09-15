import express, { NextFunction, Request, Response } from "express";
import nunjucks from "nunjucks";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = express();

//  setting up view path and extension
app.set("views", path.join(__dirname, "../", "views"));
app.set("view engine", "njk");

// Serving static files
app.use(
  "/public",
  express.static(path.join(__dirname, "../", "public"), {
    index: false,
    lastModified: false,
  })
);

// setting up template engine
nunjucks.configure("views", {
  autoescape: true,
  express: app,
  dev: process.env.NODE_ENV === "development",
  watch: process.env.NODE_ENV === "development",
});

app.get("/", (req: Request, res: Response) => {
  res.render("body/index", {});
});

app.get("/add", (req: Request, res: Response) => {
  res.render("body/addTodo", {});
});

// path not found
app.use("*", (req: Request, res: Response) => {
  res.render("error/errorPage", { error: "404", message: "Page not found" });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.render("error/errorPage", { error: "Internal Server Error", message: error.message });
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
