import fs from "fs";
import path from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Build script to generate static HTML files from EJS templates
 * This creates a 'dist' directory with all static files for deployment
 */

async function buildStaticSite() {
  console.log("🚀 Starting static site generation...");

  // Create dist directory
  const distDir = path.join(__dirname, "dist");
  if (fs.existsSync(distDir)) {
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

    // Ensure price formatting
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

    try {
      categories = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "categories.json"), "utf8")
      );
    } catch (err) {
      categories = [...new Set(projects.map((project) => project.category))];
    }
  } catch (err) {
    console.error("❌ Error loading data files:", err.message);
    process.exit(1);
  }

  // Render the main page
  console.log("📄 Rendering index.html...");
  try {
    const indexTemplate = fs.readFileSync(
      path.join(__dirname, "views", "index.ejs"),
      "utf8"
    );

    const headerTemplate = fs.readFileSync(
      path.join(__dirname, "views", "header.ejs"),
      "utf8"
    );

    const footerTemplate = fs.readFileSync(
      path.join(__dirname, "views", "footer.ejs"),
      "utf8"
    );

    const projectCardTemplate = fs.readFileSync(
      path.join(__dirname, "views", "projectCard.ejs"),
      "utf8"
    );

    // First, manually replace includes in the main template
    let templateWithIncludes = indexTemplate;
    templateWithIncludes = templateWithIncludes.replace(
      /<%- include\(['"`]header['"`]\); %>/g,
      headerTemplate
    );
    templateWithIncludes = templateWithIncludes.replace(
      /<%- include\(['"`]footer['"`]\); %>/g,
      footerTemplate
    );

    // Handle projectCard includes by replacing them with the template content
    // This is a simplified approach - in a real build system you'd want more sophisticated template processing
    const projectCardRegex = /<%- include\('projectCard',\s*{[^}]*}\) %>/g;
    templateWithIncludes = templateWithIncludes.replace(
      projectCardRegex,
      (match) => {
        // Extract parameters from the match and inject them into the projectCard template
        const paramMatch = match.match(/{([^}]*)}/);
        if (paramMatch) {
          const params = paramMatch[1];
          return `<% 
          const ${params.replace(/:/g, " = ").replace(/,/g, "; const ")};
        %>
        ${projectCardTemplate}`;
        }
        return projectCardTemplate;
      }
    );

    const html = ejs.render(
      templateWithIncludes,
      {
        projects: projects,
        categories: categories,
      },
      {
        filename: path.join(__dirname, "views", "index.ejs"),
      }
    );

    fs.writeFileSync(path.join(distDir, "index.html"), html);
    console.log("✅ index.html created successfully");
  } catch (err) {
    console.error("❌ Error rendering index.html:", err.message);
    process.exit(1);
  }

  // Copy static assets
  console.log("📂 Copying static assets...");

  const publicDir = path.join(__dirname, "public");
  if (fs.existsSync(publicDir)) {
    copyDirectory(publicDir, distDir);
    console.log("✅ Static assets copied successfully");
  }

  // Create a simple 404 page
  const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Page Not Found | David Gail Smith</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="d-flex flex-column min-vh-100">
  <div class="container d-flex flex-column justify-content-center align-items-center flex-grow-1">
    <h1 class="display-1">404</h1>
    <h2>Page Not Found</h2>
    <p class="lead">The page you're looking for doesn't exist.</p>
    <a href="/" class="btn btn-primary">Back to Home</a>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(distDir, "404.html"), notFoundHtml);
  console.log("✅ 404.html created");

  console.log("🎉 Static site generation completed successfully!");
  console.log(`📁 Files generated in: ${distDir}`);
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Run the build
buildStaticSite().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
