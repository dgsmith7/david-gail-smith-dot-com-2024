import express from "express";
import * as utils from "./utils/utils.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";

dotenv.config();

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load projects and categories from JSON files
let projects = [];
let categories = [];

try {
  const projectsData = fs.readFileSync(
    path.join(__dirname, "data", "projects.json"),
    "utf8"
  );
  projects = JSON.parse(projectsData);

  // Ensure price formatting is consistent
  projects.forEach((item) => {
    if (!item.price_formatted) {
      let p = parseFloat(item.price);
      if (p === -1) {
        item.price_formatted = "Not for sale";
      } else if (p === 0) {
        item.price_formatted = "Contact me for price please.";
      } else {
        item.price_formatted = `$${item.price} + tax and shipping`;
      }
    }
    item.price = item.price_formatted;
  });

  // Load categories
  try {
    const categoriesData = fs.readFileSync(
      path.join(__dirname, "data", "categories.json"),
      "utf8"
    );
    categories = JSON.parse(categoriesData);
  } catch (err) {
    console.log("No categories file found, deriving from projects");
    categories = [...new Set(projects.map((project) => project.category))];
  }
} catch (err) {
  console.error("Error loading project data:", err.message);
  projects = [];
  categories = [];
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ methods: ["GET", "POST"] }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.get("/", async (req, res, next) => {
  try {
    res.render("index.ejs", {
      projects: projects,
      categories: categories,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/mail", async (req, res) => {
  // Simple honeypot spam protection
  if (req.body.ftb === true) {
    try {
      await utils.sendMessage(req.body.sub, req.body.txt);
      res.json({ result: "Success" });
    } catch (error) {
      console.error("Error sending mail:", error);
      res.json({ result: "Failure" });
    }
  } else {
    res.json({ result: "No mail bots allowed" });
  }
});

// Error handling middleware
app.use(async (err, req, res, next) => {
  console.error("Application error:", err);
  const msg =
    err.message === "No project with that ID"
      ? err.message
      : "There was an internal error. Apologies. We are working on cleaning up the mess. Please try again later.";
  res.render("error.ejs", { msg: msg });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`David Gail Smith website listening on port ${port}`);
});
