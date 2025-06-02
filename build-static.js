import fs from "fs";
import path from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Build script to generate static HTML files from EJS templates
 * This will create a 'dist' directory with all static files
 */

async function buildStaticSite() {
  console.log("Starting static site generation...");

  // Create dist directory
  const distDir = path.join(__dirname, "dist");
  if (fs.existsSync(distDir)) {
    // Clear existing dist directory
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir);

  // Load data
  let projects = [];
  let categories = [];
  try {
    projects = JSON.parse(
      fs.readFileSync(path.join(__dirname, "data", "projects.json"), "utf8")
    );
    categories = JSON.parse(
      fs.readFileSync(path.join(__dirname, "data", "categories.json"), "utf8")
    );
  } catch (err) {
    console.error("Error loading data files:", err.message);
    process.exit(1);
  }

  const contracts = [];

  // Render the index page
  console.log("Rendering index.html...");
  const indexTemplate = fs.readFileSync(
    path.join(__dirname, "views", "index-modern.ejs"),
    "utf8"
  );
  const headerTemplate = fs.readFileSync(
    path.join(__dirname, "views", "header-modern.ejs"),
    "utf8"
  );
  const footerTemplate = fs.readFileSync(
    path.join(__dirname, "views", "footer-modern.ejs"),
    "utf8"
  );
  const projectCardTemplate = fs.readFileSync(
    path.join(__dirname, "views", "projectCard.ejs"),
    "utf8"
  );
  const owlTemplate = fs.readFileSync(
    path.join(__dirname, "views", "owl.ejs"),
    "utf8"
  );

  // Register partials/includes
  ejs.fileLoader = (filePath) => {
    let template;
    if (filePath.includes("header-modern")) {
      template = headerTemplate;
    } else if (filePath.includes("header")) {
      // Also handle regular header includes and map to the modern header
      template = headerTemplate;
    } else if (filePath.includes("footer-modern")) {
      template = footerTemplate;
    } else if (filePath.includes("footer")) {
      // Also handle regular footer includes and map to the modern footer
      template = footerTemplate;
    } else if (filePath.includes("projectCard")) {
      template = projectCardTemplate;
    } else if (filePath.includes("owl")) {
      template = owlTemplate;
    }
    return template;
  };

  const renderedHtml = ejs.render(indexTemplate, {
    contracts,
    projects,
    categories,
    filename: path.join(__dirname, "views", "index-modern.ejs"),
  });

  fs.writeFileSync(path.join(distDir, "index.html"), renderedHtml);

  // Copy static files
  console.log("Copying static files...");
  copyRecursiveSync(path.join(__dirname, "public"), distDir);

  // Create .env file for production with only mail settings
  console.log("Creating simplified .env file...");
  const envContent = `
MAIL_HOST=${process.env.MAIL_HOST || "smtp.dreamhost.com"}
MAIL_PORT=${process.env.MAIL_PORT || "465"}
MAIL_SECURE=${process.env.MAIL_SECURE || "true"}
MAIL_AUTH_TYPE=${process.env.MAIL_AUTH_TYPE || "SSL/TLS"}
MAIL_USERNAME=${process.env.MAIL_USERNAME || "david@davidgailsmith.com"}
MAIL_PASSWORD=${process.env.MAIL_PASSWORD || ""}
MAIL_TLS=${process.env.MAIL_TLS || "true"}
MESSAGE_FROM=${process.env.MESSAGE_FROM || "david@davidgailsmith.com"}
MESSAGE_TO=${process.env.MESSAGE_TO || "david@davidgailsmith.com"}
RECAPTCHA_SECRET_KEY=${process.env.RECAPTCHA_SECRET_KEY || ""}
`.trim();

  fs.writeFileSync(path.join(__dirname, "dist.env"), envContent);

  // Create error.html using modern template
  console.log("Creating error.html...");
  const errorTemplate = fs.readFileSync(
    path.join(__dirname, "views", "error-modern.ejs"),
    "utf8"
  );
  const renderedErrorHtml = ejs.render(errorTemplate, {
    msg: "Page not found",
    filename: path.join(__dirname, "views", "error-modern.ejs"),
  });
  fs.writeFileSync(path.join(distDir, "error.html"), renderedErrorHtml);

  // Update package.json for static serving
  console.log("Updating package.json for static serving...");
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf8")
  );
  packageJson.scripts.serve = "node static-server.js";
  fs.writeFileSync(
    path.join(distDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  console.log('Static site successfully generated in the "dist" folder!');
}

/**
 * Recursively copy a directory
 */
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Run the build function
buildStaticSite().catch(console.error);
