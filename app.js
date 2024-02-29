import express from "express";
import * as utils from "./utils/utils.js";
import * as db from "./utils/database.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

let projects = [];
let contracts = [];

const app = express();
app.use(cors({ methods: ["GET", "POST"] }));
const port = 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

app.get("/", async (req, res, next) => {
  await db
    .connect()
    .then(async () => {
      // query the databse for project records
      projects = await db.getAllProjects();
      contracts = [];
      projects.forEach((item) => {
        let pString = "";
        let p = item.price;
        if (p == -1) {
          pString += "Not for sale";
        } else if (p == 0) {
          pString = "Contact me for price please.";
        } else {
          pString += "$" + item.price + " + tax and shipping";
        }
        item.price = pString;
        //        console.log(item.price);
        // image
        // item.img_url = "./images" + item.img_url;
        //        console.log(item.img_url);
      });
      res.render("index.ejs", {
        contracts: contracts,
        projects: projects,
      });
    })
    .catch(next);
});

app.get("/owl", (req, res) => {
  res.render("owl.ejs");
});

app.post("/mail", async (req, res) => {
  if (req.body.ftb == true) {
    await utils
      .sendMessage(req.body.sub, req.body.txt)
      .then(() => {
        res.send({ result: "Success" });
      })
      .catch(() => {
        res.send({ result: "Failure" });
      });
  } else {
    res.send({ result: "No mail bots allowed" });
  }
});

app.use(async (err, req, res, next) => {
  console.log(err);
  let msg;
  msg = err.message;
  if (msg != "No project with that ID") {
    msg =
      "There was an internal error. Apologies. We are working on cleaning up the mess.  Please try again later.";
  }
  res.render("error.ejs", { msg: msg });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
