import "./ejs.js";
import { projectCode } from "./project.js";

("use strict");

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  // Set dark mode on load
  setDarkMode();

  // Dark mode toggle
  document.querySelector("#dark-mode-switch").addEventListener("click", () => {
    toggleDarkMode();
  });

  // Load project data
  const projectList = JSON.parse(document.querySelector("#projects").innerHTML);
  window.projectList = projectList; // Make available globally

  buildProjectButtons();
  setProjectView();
  initializeContactForm();
  initializeSearchAndFilters();
}

function initializeContactForm() {
  // Contact form buttons
  let form = document.querySelector("#contact-form");
  document.querySelector("#send-contact").addEventListener("click", (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    validate();
  });

  let formReset = document.querySelector("#contact-button-response");
  formReset.addEventListener("click", (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    resetForm();
  });
}

function initializeSearchAndFilters() {
  // Search box
  let searchBox = document.querySelector("#search-term");
  searchBox.addEventListener("keyup", (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    updateProjects("");
  });

  // Filter buttons
  document.querySelector("#all-filter").addEventListener("click", () => {
    setActiveFilter("#all-filter");
    updateProjects("all");
  });
  document.querySelector("#painting-filter").addEventListener("click", () => {
    setActiveFilter("#painting-filter");
    updateProjects("painting");
  });
  document
    .querySelector("#printmaking-filter")
    .addEventListener("click", () => {
      setActiveFilter("#printmaking-filter");
      updateProjects("printmaking");
    });
  document.querySelector("#generative-filter").addEventListener("click", () => {
    setActiveFilter("#generative-filter");
    updateProjects("generative");
  });
  document
    .querySelector("#fabrication-filter")
    .addEventListener("click", () => {
      setActiveFilter("#fabrication-filter");
      updateProjects("fabrication");
    });
  document
    .querySelector("#illustration-filter")
    .addEventListener("click", () => {
      setActiveFilter("#illustration-filter");
      updateProjects("illustration");
    });
  document
    .querySelector("#photography-filter")
    .addEventListener("click", () => {
      setActiveFilter("#photography-filter");
      updateProjects("photography");
    });
}

function setActiveFilter(activeButtonId) {
  // Remove active class from all filter buttons
  document.querySelectorAll(".filter-button").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Add active class to the clicked button
  document.querySelector(activeButtonId).classList.add("active");
}

// Project view management
function setProjectView() {
  let proj = sessionStorage.getItem("selected");
  if (proj == null || proj == "" || proj === "NaN") {
    proj = 1;
    sessionStorage.setItem("selected", proj.toString());
  }
  doProject(parseInt(proj));
}

function buildProjectButtons() {
  for (let i = 0; i < projectList.length; i++) {
    let id = "#b-" + projectList[i].id;
    document.querySelector(id).addEventListener("click", () => {
      doProject(i);
      setDarkMode();

      // Scroll to selected project section
      document.querySelector("#selected-project-section").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }
}

// dark mode functionality
export function setDarkMode() {
  let dmSetting = sessionStorage.getItem("dm");
  switch (dmSetting) {
    case null: {
      goLight();
      sessionStorage.setItem("dm", "light");
      document.querySelector("#dark-mode-switch").checked = false;
      break;
    }
    case "light": {
      goLight();
      sessionStorage.setItem("dm", "light");
      document.querySelector("#dark-mode-switch").checked = false;
      break;
    }
    case "dark": {
      goDark();
      sessionStorage.setItem("dm", "dark");
      document.querySelector("#dark-mode-switch").checked = true;
      break;
    }
  }
}

export function toggleDarkMode() {
  let dmSetting = sessionStorage.getItem("dm");
  switch (dmSetting) {
    case "light": {
      goDark();
      sessionStorage.setItem("dm", "dark");
      document.querySelector("#dark-mode-switch").checked = true;
      break;
    }
    case "dark": {
      goLight();
      sessionStorage.setItem("dm", "light");
      document.querySelector("#dark-mode-switch").checked = false;
      break;
    }
  }
}

export function goDark() {
  document.body.classList.add("dark-mode");
  document.body.classList.remove("bhf-light");

  // Update dark mode icon
  const icon = document.querySelector("#dark-mode-icon");
  if (icon) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
}

export function goLight() {
  document.body.classList.remove("dark-mode");
  document.body.classList.add("bhf-light");

  // Update dark mode icon
  const icon = document.querySelector("#dark-mode-icon");
  if (icon) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
}

// mail functionality
function validate() {
  let formValid = true;
  let form = document.querySelector("#contact-form");
  if (!form.checkValidity()) {
    formValid = false;
  }
  form.classList.add("was-validated");
  if (formValid) {
    sendTheEmail();
  }
  return false;
}

function resetForm() {
  document.querySelector("#contact-first").value = "";
  document.querySelector("#contact-last").value = "";
  document.querySelector("#contact-message").value = "";
  document.querySelector("#contact-email").value = "";
  document.querySelector("#contact-button-response").innerHTML = "Reset Form";
  document.querySelector("#contact-form").classList.remove("was-validated");
}

function sendTheEmail() {
  let obj = {
    sub: `${document.querySelector("#contact-first").value} ${
      document.querySelector("#contact-last").value
    } from Art site contact form!`,
    txt: `${document.querySelector("#contact-first").value} ${
      document.querySelector("#contact-last").value
    } sent you a message from the contact form on the Art site that reads as so: \n${
      document.querySelector("#contact-message").value
    }\nTheir email address is ${
      document.querySelector("#contact-email").value
    }`,
    ftb: document.querySelector("#ftb").value == "",
  };
  fetch("/mail", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((r) => r.json())
    .then((response) => {
      document.querySelector("#contact-button-response").innerHTML =
        response.result + " - Reset Form";
    })
    .catch((err) => {
      console.log(
        "We were unable to send your message due to an internal error - ",
        err
      );
    });
}

async function doProject(id) {
  sessionStorage.setItem("selected", id.toString());
  document.querySelector("#project-message").classList.remove("d-block");
  document.querySelector("#project-message").classList.add("d-none");
  document.querySelector("#single-project").classList.remove("d-none");
  document.querySelector("#single-project").classList.add("d-block");
  let data = {
    project: projectList[id],
  };
  document.querySelector("#single-project").innerHTML = ejs.render(
    projectCode,
    data
  );
  if (projectList[id].price == "Not for sale") {
    document.querySelector("#add-button").classList.add("disabled");
    document.querySelector("#add-anchor").href = "javascript:void(0)";
    document.querySelector("#add-anchor").style.cursor = "default";
  }
  let noteString = projectList[id].notes;
  let notesArray = noteString.split("*");
  let htmlString = "";
  for (let i = 0; i < notesArray.length; i++) {
    if (notesArray[i].substring(0, 6) == "https:") {
      htmlString += `<a href="${notesArray[i]}" target="blank">${
        notesArray[i + 1]
      }</a><br/>`;
    } else if (notesArray[i].substring(0, 17) == "Related projects:") {
      htmlString += `${notesArray[i]}<br/>`;
    } else if (notesArray[i].substring(0, 5) == "Note:") {
      htmlString += `${notesArray[i].substring(6)}<br/>`;
    }
  }
  document.querySelector("#notes").innerHTML = htmlString;
  setDarkMode();
}

// Replace the code that renders the selected project card:
function renderSelectedProject(project) {
  const singleProject = document.getElementById("single-project");
  if (!project) {
    singleProject.innerHTML = "";
    singleProject.classList.add("d-none");
    document.getElementById("project-message").classList.remove("d-none");
    return;
  }
  singleProject.innerHTML = `
    <div class="card selected-project-card shadow-lg mx-auto">
      <img src="${project.img_url}" class="selected-project-img" alt="${
    project.project_name
  }">
      <div class="selected-project-body">
        <h3>${project.project_name}</h3>
        <p>${project.description ? project.description : ""}</p>
        <p><strong>Category:</strong> ${project.category}</p>
        <p><small class="text-muted">${project.date_created}</small></p>
      </div>
    </div>
  `;
  singleProject.classList.remove("d-none");
  document.getElementById("project-message").classList.add("d-none");
}

function updateProjects(category) {
  // init variables
  let count = 0;
  let filter = document.getElementById("search-term").value.toUpperCase();
  if (filter == "") filter = "none";

  // clean up the message under the search box
  let messageHolder = document.querySelector("#search-message");
  messageHolder.classList.add("d-none");
  messageHolder.classList.remove("d-block");

  // if there are no selectors - clear everything in search box
  if (category == "all" && document.getElementById("search-term").value != "") {
    document.getElementById("search-term").value = "";
    filter = "";
  }

  const buttons = document.querySelectorAll(".filter-button");
  // adjust filter button visibility based on selected filter
  buttons.forEach(function (item) {
    let theID = item.id;
    if (
      theID == "all-filter" ||
      category + "-filter" == theID ||
      category == "all" ||
      category == ""
    ) {
      item.classList.remove("d-none");
    } else {
      item.classList.add("d-none");
    }
  });

  // go through project list and cull based on criteria
  projectList.forEach(function (proj, idx) {
    let pString = "#project-holder-" + projectList[idx].id;
    let pDisplay = document.querySelector(pString);

    if (
      proj.category.toUpperCase() == category.toUpperCase() ||
      category == "all" ||
      proj.project_name.toUpperCase().includes(filter) ||
      proj.project_description.toUpperCase().includes(filter)
    ) {
      pDisplay.classList.remove("d-none");
      pDisplay.classList.add("d-flex");
      count++;
    } else {
      pDisplay.classList.add("d-none");
      pDisplay.classList.remove("d-flex");
    }
  });

  if (count == 0) {
    messageHolder.classList.remove("d-none");
    messageHolder.classList.add("d-block");
  } else {
    messageHolder.classList.add("d-none");
    messageHolder.classList.remove("d-block");
  }
}
