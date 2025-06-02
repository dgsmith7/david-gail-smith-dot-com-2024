/**
 * This script ensures dark mode functionality even if main JavaScript fails
 */

document.addEventListener("DOMContentLoaded", function () {
  // Check if dark mode toggle exists
  const darkModeToggle = document.getElementById("dark-mode-switch");
  if (!darkModeToggle) return;

  // Check saved preference
  const savedDarkMode = sessionStorage.getItem("dm");

  // Apply dark mode if needed
  if (savedDarkMode === "dark") {
    document.body.classList.add("bhf-dark");
    document.body.classList.remove("bhf-light");

    // Apply to header and footer
    const header = document.getElementById("header");
    if (header) {
      header.classList.add("bhf-dark");
      header.classList.remove("bhf-light");
    }

    const footer = document.getElementById("footer");
    if (footer) {
      footer.classList.add("bhf-dark");
      footer.classList.remove("bhf-light");
    }

    // Update toggle
    darkModeToggle.checked = true;
  }

  // Add event listener to toggle
  darkModeToggle.addEventListener("click", function () {
    if (document.body.classList.contains("bhf-dark")) {
      // Switch to light mode
      document.body.classList.remove("bhf-dark");
      document.body.classList.add("bhf-light");
      sessionStorage.setItem("dm", "light");

      document.querySelectorAll("#header, #footer").forEach((el) => {
        if (el) {
          el.classList.remove("bhf-dark");
          el.classList.add("bhf-light");
        }
      });
    } else {
      // Switch to dark mode
      document.body.classList.add("bhf-dark");
      document.body.classList.remove("bhf-light");
      sessionStorage.setItem("dm", "dark");

      document.querySelectorAll("#header, #footer").forEach((el) => {
        if (el) {
          el.classList.add("bhf-dark");
          el.classList.remove("bhf-light");
        }
      });
    }
  });
});
