const express = require("express");

const app = express();

const path = require("path");

const staticPath = path.join(__dirname, "/public");
const viewsPath = path.join(__dirname, "/views");
const defaultViewPath = path.join(__dirname, "/views/home.html");
const error404Path = path.join(__dirname, "/views/error404.html");

app.use(express.static(staticPath));

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

app.use((req, res, next) => {
  res.showFile = (name) => {
    res.sendFile(path.join(viewsPath, name));
  };
  next();
});

app.get("/", (req, res) => {
  res.sendFile(defaultViewPath);
});

for (let key in viewFiles) {
  app.get("/" + String(key), (req, res) => {
    res.showFile(viewFiles[key]);
  });
}

app.use("*", (req, res) => {
  res.status(404).sendFile(error404Path);
});

app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});
