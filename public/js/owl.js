("use strict");

//dark mode
setDarkMode();
document.querySelector("#dark-mode-switch").addEventListener("click", () => {
  toggleDarkMode();
});

document.querySelector("#rotate").addEventListener("click", () => {
  document.querySelector("#view").classList.toggle("rotate");
});

// dark mode functionality
function setDarkMode() {
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
      document.querySelector("#dark-mode-switch").checked;
      goDark();
      sessionStorage.setItem("dm", "dark");
      document.querySelector("#dark-mode-switch").checked = true;
      document.querySelector("#dark-mode-switch").checked;
      break;
    }
  }
}

function toggleDarkMode() {
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

function goDark() {
  let e = document.body;
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");
  e = document.querySelector("#header");
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");
  e = document.querySelector("#footer");
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");

  let l1 = document.getElementsByTagName("a");
  for (let e of l1) {
    e.classList.add("n-list-dark");
    e.classList.remove("n-list-light");
  }
  let l2 = document.getElementsByTagName("strong");
  for (let e of l2) {
    e.classList.add("n-list-dark");
    e.classList.remove("n-list-light");
  }
  let l3 = document.getElementsByTagName("label");
  for (let e of l3) {
    e.classList.add("n-list-dark");
    e.classList.remove("n-list-light");
  }
  let l4 = document.getElementsByTagName("button");
  for (let e of l4) {
    e.classList.add("buttons-dark");
    e.classList.remove("buttons-light");
  }
  let l5 = document.getElementsByTagName("svg");
  for (let e of l5) {
    e.classList.add("logo-dark");
    e.classList.remove("logo-light");
  }
  let l6 = document.getElementsByClassName("card-footer");
  for (let e of l6) {
    e.classList.add("bhf-dark");
    e.classList.remove("bhf-light");
  }
  let l7 = document.getElementsByClassName("title-box");
  for (let e of l7) {
    e.classList.add("bhf-dark");
    e.classList.remove("bhf-light");
  }
  let l8 = document.getElementsByClassName("card");
  for (let e of l8) {
    e.classList.add("buttons-dark");
    e.classList.remove("buttons-light");
  }
}

function goLight() {
  let e = document.body;
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  e = document.querySelector("#header");
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  e = document.querySelector("#footer");
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  let l1 = document.getElementsByTagName("a");
  for (let e of l1) {
    e.classList.add("n-list-light");
    e.classList.remove("n-list-dark");
  }
  let l2 = document.getElementsByTagName("strong");
  for (let e of l2) {
    e.classList.add("n-list-light");
    e.classList.remove("n-list-dark");
  }
  let l3 = document.getElementsByTagName("label");
  for (let e of l3) {
    e.classList.add("n-list-light");
    e.classList.remove("n-list-dark");
  }
  let l4 = document.getElementsByTagName("button");
  for (let e of l4) {
    e.classList.add("buttons-light");
    e.classList.remove("buttons-dark");
  }
  let l5 = document.getElementsByTagName("svg");
  for (let e of l5) {
    e.classList.add("logo-light");
    e.classList.remove("logo-dark");
  }
  let l6 = document.getElementsByClassName("card-footer");
  for (let e of l6) {
    e.classList.add("bhf-light");
    e.classList.remove("bhf-dark");
  }
  let l7 = document.getElementsByClassName("title-box");
  for (let e of l7) {
    e.classList.add("bhf-light");
    e.classList.remove("bhf-dark");
  }
  let l8 = document.getElementsByClassName("card");
  for (let e of l8) {
    e.classList.add("buttons-light");
    e.classList.remove("buttons-dark");
  }
}
