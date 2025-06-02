import express from "express";
import * as utils from "./utils/utils.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { fileURLToPath } from "url";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load projects from JSON file
let projects = [];
let categories = [];

try {
  const projectsData = fs.readFileSync(
    path.join(__dirname, "data", "projects.json"),
    "utf8"
  );
  projects = JSON.parse(projectsData);

  // Add formatted price strings if they don't exist
  projects.forEach((item) => {
    if (!item.price_formatted) {
      let p = item.price;
      if (p == -1) {
        item.price_formatted = "Not for sale";
      } else if (p == 0) {
        item.price_formatted = "Contact me for price please.";
      } else {
        item.price_formatted = "$" + item.price + " + tax and shipping";
      }
    }
    item.price = item.price_formatted;
  });

  // Load categories if available
  try {
    const categoriesData = fs.readFileSync(
      path.join(__dirname, "data", "categories.json"),
      "utf8"
    );
    categories = JSON.parse(categoriesData);
  } catch (err) {
    console.log("No categories file found, will derive from projects");
    categories = [...new Set(projects.map((project) => project.category))];
  }
} catch (err) {
  console.error("Error loading project data:", err.message);
  projects = [];
  categories = [];
}

const contracts = [];

const app = express();
app.use(cors({ methods: ["GET", "POST"] }));
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

app.get("/", async (req, res, next) => {
  try {
    res.render("index.ejs", {
      contracts: contracts,
      projects: projects,
      categories: categories,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/mail", async (req, res) => {
  if (req.body.ftb == true) {
    await utils
      .sendMessage(req.body.sub, req.body.txt)
      .then(() => {
        res.send({ result: "Success" });
      })
      .catch((error) => {
        console.error("Error sending mail:", error);
        res.send({ result: "Failure" });
      });
  } else {
    res.send({ result: "No mail bots allowed" });
  }
});

app.use(async (err, req, res, next) => {
  console.error("Application error:", err);
  let msg = err.message;
  if (msg != "No project with that ID") {
    msg =
      "There was an internal error. Apologies. We are working on cleaning up the mess. Please try again later.";
  }
  res.render("error.ejs", { msg: msg });
});

app.listen(port, () => {
  console.log(`David Gail Smith website listening on port ${port}`);
});
