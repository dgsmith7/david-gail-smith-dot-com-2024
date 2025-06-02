import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import express from "express";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy static assets (CSS, JS, images)
const staticAssets = ["public", "assets", "images", "js", "css"];
staticAssets.forEach((dir) => {
  if (fs.existsSync(path.join(__dirname, dir))) {
    fs.cpSync(path.join(__dirname, dir), path.join(distDir, dir), {
      recursive: true,
      force: true,
    });
  }
});

// Copy environment file
try {
  fs.copyFileSync(path.join(__dirname, "dist.env"), path.join(distDir, ".env"));
} catch (err) {
  console.error("Error copying environment file:", err);
}

// Load data files
const loadData = () => {
  const dataDir = path.join(__dirname, "data");
  const data = {};

  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir);
    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const name = file.replace(".json", "");
        const content = fs.readFileSync(path.join(dataDir, file), "utf8");
        data[name] = JSON.parse(content);
      }
    });
  }

  return data;
};

const data = loadData();

// Find the directory where template files are stored
let viewsDir = path.join(__dirname, "views");
if (!fs.existsSync(viewsDir)) {
  // Try alternative locations
  const alternatives = ["templates", "src/views", "src/templates"];
  for (const alt of alternatives) {
    const altPath = path.join(__dirname, alt);
    if (fs.existsSync(altPath)) {
      viewsDir = altPath;
      console.log(`Found templates in ${altPath}`);
      break;
    }
  }
}

// Define templates to process (only main pages, not partials)
// Match templates that should be top-level pages
const mainTemplates = ["index-modern", "sign-in", "owl"];

// Verify templates exist and build routes based on available templates
const availableTemplates = [];
if (fs.existsSync(viewsDir)) {
  const files = fs.readdirSync(viewsDir);
  files.forEach((file) => {
    if (
      file.endsWith(".ejs") &&
      (mainTemplates.includes(file.replace(".ejs", "")) ||
        (!file.startsWith("_") &&
          !file.includes("header") &&
          !file.includes("footer") &&
          !file.includes("error") &&
          !file.includes("projectCard")))
    ) {
      const templateName = file.replace(".ejs", "");
      availableTemplates.push({
        path: templateName === "index" ? "/" : `/${templateName}`,
        template: templateName,
        output: `${templateName}.html`,
      });
    }
  });
}

console.log(
  "Processing templates:",
  availableTemplates.map((t) => t.template).join(", ")
);

// Provide default values for common EJS template variables
const defaultVariables = {
  // Error page variables
  msg: "An error occurred",
  error: { status: 404, stack: "" },
  // Index page variables
  contracts: JSON.stringify([]),
  projects: [],
  // Project card variables
  image: "/images/placeholder.jpg",
  name: "Project",
  description: "Project description",
  tech: "Technology",
  date: "2022",
  url: "#",
  repo: "#",
  // General variables
  title: "David Gail Smith",
  path: "/",
};

// Render each page
availableTemplates.forEach((route) => {
  try {
    const templatePath = path.join(viewsDir, `${route.template}.ejs`);
    console.log(`Processing template: ${templatePath}`);

    const template = fs.readFileSync(templatePath, "utf8");

    const html = ejs.render(template, {
      ...defaultVariables,
      ...data,
      path: route.path,
      filename: templatePath, // This is critical for EJS includes to work!
      root: viewsDir, // Adding root directory for includes
    });

    fs.writeFileSync(path.join(distDir, route.output), html);
    console.log(`Built: ${route.output}`);
  } catch (err) {
    console.error(`Error building ${route.output}:`, err);
  }
});

console.log("Build completed!");
