const express = require("express");

const app = express();

const path = require("path");

files = {
  index: "index.html",
  about: "about.html",
  contact: "contact.html",
  info: "info.html",
  history: "history.html",
};

app.use((req, res, next) => {
  res.showFile = (name) => {
    res.sendFile(path.join(__dirname, `/views/${name}`));
  };
  next();
});

for (let key in files) {
  app.get("/" + String(key), (req, res) => {
    res.showFile(files[key]);
  });
}

app.use((req, res) => {
  res.status(404).send("404 not found...");
});

app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});
