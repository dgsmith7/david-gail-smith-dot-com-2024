import "./ejs.js";
import { projectCode } from "./project.js";

("use strict");

//dark mode
setDarkMode();
document.querySelector("#dark-mode-switch").addEventListener("click", () => {
  toggleDarkMode();
});

let projectList = JSON.parse(document.querySelector("#projects").innerHTML);
let isConnected = false;
let projectIds = [];
let connect = document.querySelector("#login-button");

// wallet connection (also see below)
await connectWallet();
// connect.addEventListener("click", async () => {
//   logIn();
//   //  await connectWallet();
// });
if (isConnected) {
}
buildProjectButtons();

// search box
let searchBox = document.querySelector("#search-term");
searchBox.addEventListener("keyup", (event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  updateProjects("");
});

// set initial page view
setProjectView();

// contact form buttons
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

function setProjectView() {
  let proj = sessionStorage.getItem("selected");
  if (proj == null || proj == "" || proj === "NaN") {
    proj = 1;
    sessionStorage.setItem("selected", proj.toString());
  }
  doProject(parseInt(proj));
}

// build project buttons
function buildProjectButtons() {
  for (let i = 0; i < projectList.length; i++) {
    let id = "#b-" + projectList[i].id;
    document.querySelector(id).addEventListener("click", () => {
      doProject(i);
      setDarkMode();
    });
  }
}

document.querySelector("#all-filter").addEventListener("click", () => {
  updateProjects("all");
});
document.querySelector("#painting-filter").addEventListener("click", () => {
  updateProjects("painting");
});
document.querySelector("#printmaking-filter").addEventListener("click", () => {
  updateProjects("printmaking");
});
document.querySelector("#generative-filter").addEventListener("click", () => {
  updateProjects("generative");
});
document.querySelector("#fabrication-filter").addEventListener("click", () => {
  updateProjects("fabrication");
});
document.querySelector("#illustration-filter").addEventListener("click", () => {
  updateProjects("illustration");
});
document.querySelector("#photography-filter").addEventListener("click", () => {
  updateProjects("photography");
});

// wallet connection (also see above)
async function connectWallet() {
  // if (typeof window.ethereum !== "undefined") {
  //   try {
  //     let chain = await ethereum.request({ method: "eth_chainId" });
  //     if (chain == "0x66eee" || chain == "0xa4b1" || chain == "0x13881") {
  //       await ethereum.request({ method: "eth_requestAccounts" });
  //       connect.innerHTML = "Connected";
  //       provider = new ethers.providers.Web3Provider(window.ethereum);
  //       signer = provider.getSigner();
  //       const accounts = await ethereum.request({ method: "eth_accounts" });
  //       userAddress = "" + accounts[0];
  //       let walletString =
  //         userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
  //       isConnected = true;
  //     }
  //   } catch (error) {
  //     connect.innerHTML = "Check Metamask/Network";
  //     isConnected = false;
  //   }
  // } else {
  //   connect.innerHTML = "Please connect MetaMask";
  //   isConnected = false;
  // }
  console.log("set up auth!");
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
      document.querySelector("#dark-mode-switch").checked;
      goDark();
      sessionStorage.setItem("dm", "dark");
      document.querySelector("#dark-mode-switch").checked = true;
      document.querySelector("#dark-mode-switch").checked;
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
  let e = document.body;
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");
  e = document.querySelector("#header");
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");
  e = document.querySelector("#footer");
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");
  e = document.querySelector("#contact-form");
  e.classList.add("contact-form-dark");
  e.classList.remove("contact-form-light");
  e = document.querySelector("#search-term");
  e.classList.add("buttons-dark");
  e.classList.remove("buttons-light");
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

export function goLight() {
  let e = document.body;
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  e = document.querySelector("#header");
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  e = document.querySelector("#footer");
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  e = document.querySelector("#contact-form");
  e.classList.remove("contact-form-dark");
  e.classList.add("contact-form-light");
  e = document.querySelector("#search-term");
  e.classList.remove("buttons-dark");
  e.classList.add("buttons-light");
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

// mail functionality
function validate() {
  let formValid = true;
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
    } from NFT mint contact form!`,
    txt: `${document.querySelector("#contact-first").value} ${
      document.querySelector("#contact-last").value
    } sent you a message from the contact form on the NFT mint that reads as so: \n${
      document.querySelector("#contact-message").value
    }\nThey're email address is ${
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
  document.querySelector("#project-message").classList.remove("d-inline");
  document.querySelector("#project-message").classList.add("d-none");
  document.querySelector("#single-project").classList.remove("d-none");
  document.querySelector("#single-project").classList.add("d-inline");
  let data = {
    project: projectList[id],
  };
  document.querySelector("#single-project").innerHTML = ejs.render(
    projectCode,
    data
  );
  if (projectList[id].price == "Not for sale") {
    document.querySelector("#add-button").classList.add("disabled");
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

function updateProjects(category) {
  // init variables
  projectIds = [];
  let count = 0;
  let filter = document.getElementById("search-term").value.toUpperCase();
  // clean up the message under the search box
  let messageHolder = document.querySelector("#search-message");
  messageHolder.classList.add("d-none");
  messageHolder.classList.remove("d-inline");
  // if there are no selectors - clear everything in search box
  if (category == "all" && document.getElementById("search-term").value != "") {
    document.getElementById("search-term").value = "";
    filter = "";
  }
  const buttons = document.querySelectorAll(".filter-button");
  // adjust filter button visibility based on selected filter
  //  if (category == "") category = "all";
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
    projectIds.push(proj.id);
    let pString = "#project-holder-" + projectList[idx].id; //(idx + 1);
    let pDisplay = document.querySelector(pString);
    // console.log(
    //   proj.project_name.toUpperCase() +
    //     " should include " +
    //     filter +
    //     " and " +
    //     proj.category.toUpperCase() +
    //     " should = " +
    //     category
    // );
    if (
      proj.category.toUpperCase() == category.toUpperCase() ||
      category == "all" ||
      proj.project_name.toUpperCase().includes(filter) ||
      proj.project_description.toUpperCase().includes(filter)
      //
      // proj.category.toUpperCase() == category.toUpperCase() ||
      // category == "all"
      //
      // proj.project_name.toUpperCase().includes(filter) ||
      // proj.project_description.toUpperCase().includes(filter)
      //
      // (proj.project_name.toUpperCase().includes(filter) ||
      //   proj.project_description.toUpperCase().includes(filter)) &&
      // (proj.category.toUpperCase() == category.toUpperCase() ||
      //   category == "all")
    ) {
      pDisplay.classList.add("d-inline");
      pDisplay.classList.remove("d-none");
      count++;
    } else {
      pDisplay.classList.add("d-none");
      pDisplay.classList.remove("d-inline");
    }
  });
  if (count == 0) {
    messageHolder.classList.add("d-inline");
    messageHolder.classList.remove("d-none");
  } else {
    messageHolder.classList.add("d-none");
    messageHolder.classList.remove("d-inline");
  }
}

// function logIn() {
//   fetch("/login", {
//     method: "GET",
//     headers: {
//       "Content-type": "application/json",
//     },
//   })
//     // .then((r) => r.json())
//     // .then((response) => {
//     //   console.log(response);
//     // })
//     .catch((err) => {
//       console.log("We were unable to log in due to an error - ", err);
//     });
// }
