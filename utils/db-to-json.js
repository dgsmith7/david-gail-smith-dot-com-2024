import fs from "fs";
import path from "path";
import * as db from "./database.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * Script to export MySQL database content to JSON files
 * Run this script once to create the JSON data files
 */

async function exportDatabaseToJson() {
  try {
    console.log("Connecting to database...");
    await db.connect();

    console.log("Fetching all art objects...");
    const projects = await db.getAllProjects();

    // Process price formatting as done in app.js
    projects.forEach((item) => {
      let p = item.price;
      if (p == -1) {
        item.price_formatted = "Not for sale";
      } else if (p == 0) {
        item.price_formatted = "Contact me for price please.";
      } else {
        item.price_formatted = "$" + item.price + " + tax and shipping";
      }
    });

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Write the projects to a JSON file
    const projectsFilePath = path.join(dataDir, "projects.json");
    fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2));

    console.log(
      `Successfully exported ${projects.length} projects to ${projectsFilePath}`
    );

    // Create a categories JSON for filtering
    const categories = [
      ...new Set(projects.map((project) => project.category)),
    ];
    const categoriesFilePath = path.join(dataDir, "categories.json");
    fs.writeFileSync(categoriesFilePath, JSON.stringify(categories, null, 2));

    console.log(
      `Successfully exported ${categories.length} categories to ${categoriesFilePath}`
    );

    return { projects, categories };
  } catch (error) {
    console.error("Error exporting database to JSON:", error);
    throw error;
  }
}

// Run the export function
exportDatabaseToJson().catch(console.error);
