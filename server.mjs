// const express = require("express");
import express from "express";
import { engine } from "express-handlebars";
import path from "path";
// const path = require("path");

const __dirname = path.resolve();

// set app and express settings
const app = express();
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
// set paths
const staticPath = path.join(__dirname, "/public");
// const viewsPath = path.join(__dirname, "/views");
// const defaultViewPath = path.join(__dirname, "/views/home.hbs");
// const error404Path = path.join(__dirname, "/views/error404.hbs");

// set middleware
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const viewFiles = {
  index: "index.html",
  about: "about.html",
  contact: "contact.html",
  info: "info.html",
  history: "history.html",
  home: "home.html",
  "user/settings": "nologin.html",
  "user/panel": "nologin.html",
};
const views = {
  "": "home",
  index: "index",
  about: "about",
  contact: "contact",
  info: "info",
  history: "history",
  home: "home",
  "user/settings": "nologin.hbs",
  "user/panel": "nologin.hbs",
};

// app.use((req, res, next) => {
//   res.showFile = (name) => {
//     res.sendFile(path.join(viewsPath, name));
//   };
//   next();
// });

// app.get("/", (req, res) => {
//   res.sendFile(defaultViewPath);
// });

for (let key in views) {
  if (key === "about") {
    app.get("/" + String(key), (req, res) => {
      res.render(views[key], { layout: "dark" });
    });
  } else {
    app.get("/" + String(key), (req, res) => {
      res.render(views[key]);
    });
  }
}

app.get("/hello/:name", (req, res) => {
  res.render("hello", { name: String(req.params.name), layout: false });
});

app.post("/contact/send-message", (req, res) => {
  const { author, sender, title, message } = req.body;

  let isSent = false;
  let isError = !(author && sender && title && message);

  const params = { author, sender, title, message, isSent, isError };

  if (isError === false) {
    res.render("contact", {
      ...params,
      isSent: true,
    });
  } else {
    res.render("contact", {
      ...params,
      isSent: false,
      isError: true,
    });
  }

  // res.json(req.body);
});

app.use("*", (req, res) => {
  // res.sendFile(error404Path);
  res.status(404).render("error404");
});

app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});
