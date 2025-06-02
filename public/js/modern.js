/**
 * Modern JavaScript file with optimized functionality
 */

// DOM Elements
const darkModeToggle = document.querySelector("#dark-mode-switch");
const body = document.body;
// Access projects data from the global window.appData object
const projectsData =
  window.appData && window.appData.projects ? window.appData.projects : [];
const contractsData =
  window.appData && window.appData.contracts ? window.appData.contracts : [];
const projectsGrid = document.querySelector("#projects-grid");
const searchInput = document.querySelector("#search-term");
const categoryFilter = document.querySelector("#category-filter");
const contactForm = document.querySelector("#contact-form");
const sendContactButton = document.querySelector("#send-contact");
const contactResponse = document.querySelector("#contact-response");
const resetFormButton = document.querySelector("#contact-button-response");

// Dark Mode Functions
function initDarkMode() {
  // Check for saved user preference from sessionStorage (to match index.js/owl.js)
  const savedDarkMode = sessionStorage.getItem("dm");

  // Set initial state based on saved preference
  if (savedDarkMode === "dark") {
    enableDarkMode();
  } else if (savedDarkMode === null) {
    // If no saved preference, check system preference
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDarkMode) {
      enableDarkMode();
    } else {
      disableDarkMode(); // Explicitly set light mode
    }
  }

  // Set up event listener for dark mode toggle
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode);
  }
}

function enableDarkMode() {
  body.classList.add("bhf-dark");
  body.classList.remove("bhf-light");

  // Apply dark mode to various elements
  document.querySelector("#header")?.classList.add("bhf-dark");
  document.querySelector("#header")?.classList.remove("bhf-light");
  document.querySelector("#footer")?.classList.add("bhf-dark");
  document.querySelector("#footer")?.classList.remove("bhf-light");

  // Apply dark mode to contact form if it exists
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.classList.add("contact-form-dark");
    contactForm.classList.remove("contact-form-light");
  }

  // Apply dark mode to search term field if it exists
  const searchTerm = document.querySelector("#search-term");
  if (searchTerm) {
    searchTerm.classList.add("buttons-dark");
    searchTerm.classList.remove("buttons-light");
  }

  // Make sure the veteran owned business image in the footer is visible
  const vobImg = document.querySelector("#vob");
  if (vobImg) {
    vobImg.style.opacity = "1";
    vobImg.style.filter = "brightness(1.5)";
  }

  // Apply classes to elements
  applyClassesToElements("a", "n-list-dark", "n-list-light");
  applyClassesToElements("strong", "n-list-dark", "n-list-light");
  applyClassesToElements("label", "n-list-dark", "n-list-light");
  applyClassesToElements("button", "buttons-dark", "buttons-light");
  applyClassesToElements("svg", "logo-dark", "logo-light");
  applyClassesToElements(".card-footer", "bhf-dark", "bhf-light");
  applyClassesToElements(".title-box", "bhf-dark", "bhf-light");
  applyClassesToElements(".card", "buttons-dark", "buttons-light");

  // Store preference - use sessionStorage to match other JS files
  sessionStorage.setItem("dm", "dark");

  // Update the toggle switch
  if (darkModeToggle) darkModeToggle.checked = true;
}

function disableDarkMode() {
  body.classList.remove("bhf-dark");
  body.classList.add("bhf-light");

  // Apply light mode to various elements
  document.querySelector("#header")?.classList.remove("bhf-dark");
  document.querySelector("#header")?.classList.add("bhf-light");
  document.querySelector("#footer")?.classList.remove("bhf-dark");
  document.querySelector("#footer")?.classList.add("bhf-light");

  // Apply light mode to contact form if it exists
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.classList.remove("contact-form-dark");
    contactForm.classList.add("contact-form-light");
  }

  // Apply light mode to search term field if it exists
  const searchTerm = document.querySelector("#search-term");
  if (searchTerm) {
    searchTerm.classList.remove("buttons-dark");
    searchTerm.classList.add("buttons-light");
  }

  // Reset the veteran owned business image in the footer
  const vobImg = document.querySelector("#vob");
  if (vobImg) {
    vobImg.style.opacity = "";
    vobImg.style.filter = "";
  }

  // Apply classes to elements
  applyClassesToElements("a", "n-list-light", "n-list-dark");
  applyClassesToElements("strong", "n-list-light", "n-list-dark");
  applyClassesToElements("label", "n-list-light", "n-list-dark");
  applyClassesToElements("button", "buttons-light", "buttons-dark");
  applyClassesToElements("svg", "logo-light", "logo-dark");
  applyClassesToElements(".card-footer", "bhf-light", "bhf-dark");
  applyClassesToElements(".title-box", "bhf-light", "bhf-dark");
  applyClassesToElements(".card", "buttons-light", "buttons-dark");

  // Store preference - use sessionStorage to match other JS files
  sessionStorage.setItem("dm", "light");

  // Update the toggle switch
  if (darkModeToggle) darkModeToggle.checked = false;
}

// Helper function to apply classes to multiple elements
function applyClassesToElements(selector, addClass, removeClass) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.classList.add(addClass);
    element.classList.remove(removeClass);
  });
}

function toggleDarkMode() {
  if (body.classList.contains("bhf-dark")) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

// Project Display Functions
function initProjects() {
  displayProjects(projectsData);

  // Set up search functionality
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }

  // Set up category filter functionality
  if (categoryFilter) {
    categoryFilter.addEventListener("change", handleCategoryFilter);
  }
}

function displayProjects(projects) {
  if (!projectsGrid) return;

  // Clear existing projects
  projectsGrid.innerHTML = "";

  if (projects.length === 0) {
    projectsGrid.innerHTML =
      '<p class="text-center">No projects found matching your criteria.</p>';
    return;
  }

  // Create project cards
  projects.forEach((project) => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });

  // Add event listeners to project cards
  document.querySelectorAll(".project-link").forEach((button) => {
    button.addEventListener("click", handleProjectSelection);
  });
}

function createProjectCard(project) {
  // Create card elements
  const card = document.createElement("div");
  card.className = "card fadein";

  // Create card image
  const img = document.createElement("img");
  img.src = project.img_url;
  img.className = "card-img-top";
  img.alt = `An image of the ${project.project_name} project`;

  // Create card title
  const titleBox = document.createElement("div");
  titleBox.className = "card-title";
  titleBox.innerHTML = `<strong>${project.project_name}</strong>`;

  // Create card footer
  const footer = document.createElement("div");
  footer.className = "card-footer";

  // Create select button
  const button = document.createElement("button");
  button.id = `b-${project.id}`;
  button.className = "btn btn-outline project-link";
  button.textContent = "Select Project";

  // Create link
  const link = document.createElement("a");
  link.href = "#single-project-area";
  link.appendChild(button);

  // Assemble card
  footer.appendChild(link);
  card.appendChild(img);
  card.appendChild(titleBox);
  card.appendChild(footer);

  return card;
}

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  filterProjects(searchTerm);
}

function handleCategoryFilter() {
  const category = categoryFilter.value;
  const searchTerm = searchInput.value.toLowerCase();
  filterProjects(searchTerm, category);
}

function filterProjects(searchTerm = "", category = "all") {
  let filteredProjects = projectsData;

  // Filter by search term
  if (searchTerm) {
    filteredProjects = filteredProjects.filter((project) => {
      return (
        project.project_name.toLowerCase().includes(searchTerm) ||
        project.project_description.toLowerCase().includes(searchTerm) ||
        project.category.toLowerCase().includes(searchTerm) ||
        project.medium.toLowerCase().includes(searchTerm)
      );
    });
  }

  // Filter by category
  if (category !== "all") {
    filteredProjects = filteredProjects.filter((project) => {
      return project.category === category;
    });
  }

  displayProjects(filteredProjects);
}

function handleProjectSelection(event) {
  const projectId = event.target.id.split("-")[1];
  const project = projectsData.find((p) => p.id.toString() === projectId);

  if (project) {
    displaySingleProject(project);

    // Scroll to the project detail section
    document.querySelector("#single-project-area").scrollIntoView({
      behavior: "smooth",
    });
  }
}

function displaySingleProject(project) {
  const projectDetailSection = document.querySelector("#single-project-area");
  if (!projectDetailSection) return;

  // Update project details
  document.querySelector("#project-title").textContent = project.project_name;
  document.querySelector("#project-image").src = project.img_url;
  document.querySelector(
    "#project-image"
  ).alt = `Image of ${project.project_name}`;
  document.querySelector("#project-description").textContent =
    project.project_description;
  document.querySelector(
    "#project-date"
  ).textContent = `Created: ${project.date_created}`;
  document.querySelector(
    "#project-medium"
  ).textContent = `Medium: ${project.medium}`;
  document.querySelector(
    "#project-dimensions"
  ).textContent = `Dimensions: ${project.dimensions}`;
  document.querySelector(
    "#project-price"
  ).textContent = `${project.price_formatted}`;

  // Ensure the project detail section is visible
  projectDetailSection.style.display = "block";
}

// Contact Form Functions
function initContactForm() {
  if (!contactForm) return;

  sendContactButton.addEventListener("click", validateAndSubmitForm);
  resetFormButton.addEventListener("click", resetContactForm);
}

function validateAndSubmitForm(event) {
  event.preventDefault();

  // Simple form validation
  const name = contactForm.querySelector("#name").value.trim();
  const email = contactForm.querySelector("#email").value.trim();
  const subject = contactForm.querySelector("#subject").value.trim();
  const message = contactForm.querySelector("#message").value.trim();

  if (!name || !email || !subject || !message) {
    showContactResponse("error", "Please fill in all fields");
    return;
  }

  if (!validateEmail(email)) {
    showContactResponse("error", "Please enter a valid email address");
    return;
  }

  // Form is valid, submit it
  submitContactForm(name, email, subject, message);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function submitContactForm(name, email, subject, message) {
  // Show loading state
  showContactResponse("loading", "Sending your message...");

  // Prepare data for submission
  const formData = {
    ftb: true,
    sub: `Website Contact: ${subject}`,
    txt: `From: ${name} (${email})\n\nMessage:\n${message}`,
  };

  // Send form data
  fetch("/mail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result === "Success") {
        showContactResponse("success", "Your message has been sent!");
      } else {
        showContactResponse(
          "error",
          "Failed to send message. Please try again later."
        );
      }
    })
    .catch((error) => {
      showContactResponse(
        "error",
        "An error occurred. Please try again later."
      );
      console.error("Error:", error);
    });
}

function showContactResponse(type, message) {
  contactResponse.textContent = message;
  contactResponse.className = `alert alert-${
    type === "error" ? "danger" : type === "success" ? "success" : "info"
  }`;
  contactResponse.style.display = "block";

  if (type === "success") {
    contactForm.reset();
  }
}

function resetContactForm() {
  contactForm.reset();
  contactResponse.style.display = "none";
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initProjects();
  initContactForm();
});
