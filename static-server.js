import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import * as utils from "./utils/utils.js";
import cors from "cors";
import fs from "fs";

// Load environment variables from dist.env in production or .env in development
const envPath = process.env.NODE_ENV === "production" ? "./dist.env" : "./.env";
dotenv.config({ path: envPath });

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ methods: ["GET", "POST"] }));
const port = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json());

// Handle email sending
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

// Define routes for your main pages
const validRoutes = [
  "/",
  "/index.html",
  "/about",
  "/portfolio",
  "/contact",
  // Add other valid routes as needed
];

// Custom 404 handler - any route not explicitly handled and not a static file
app.use((req, res, next) => {
  // Check if the requested path exists as a file in the dist directory
  const requestedPath = req.path === "/" ? "/index.html" : req.path;
  const filePath = path.join(__dirname, "dist", requestedPath);

  // If it's a valid route or file exists, serve the appropriate content
  if (validRoutes.includes(req.path) || fs.existsSync(filePath)) {
    // For valid routes that don't end with .html, serve index.html (for SPA routing)
    if (!requestedPath.endsWith(".html") && !requestedPath.includes(".")) {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    } else {
      next(); // Let static middleware handle it
    }
  } else {
    // For non-existent routes, serve the error page
    res.status(404).sendFile(path.join(__dirname, "dist", "error.html"));
  }
});

// Start the server
const server = app
  .listen(port)
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      const newPort = parseInt(port) + 1;
      console.log(`Port ${port} in use, trying port ${newPort} instead`);
      app.listen(newPort, () => {
        console.log(
          `David Gail Smith website static server listening on port ${newPort}`
        );
        console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
        console.log(`Serving files from: ${path.join(__dirname, "dist")}`);
      });
    } else {
      console.error("Server error:", err);
    }
  })
  .on("listening", () => {
    console.log(
      `David Gail Smith website static server listening on port ${port}`
    );
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Serving files from: ${path.join(__dirname, "dist")}`);
  });
