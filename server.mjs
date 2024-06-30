// const express = require("express");
import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import multer from "multer";

// set app and express settings
const app = express();
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

// set paths
const __dirname = path.resolve();
const staticPath = path.join(__dirname, "/public");

// set middleware
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/"); // Specify the directory where files should be stored
  },
  filename: function (req, file, cb) {
    // Generate the file name with its original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// set views
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

// set routes
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

// handle contact form
app.post("/contact/send-message", upload.single("image"), (req, res) => {
  try {
    const { author, sender, title, message } = req.body;

    let file = null;
    let filename = null;
    let storedfile = null;
    if (req.file) {
      file = req.file;
      filename = file.originalname;
      storedfile = file.filename;
    }

    let isSent = false;
    let isError = !(author && sender && title && message && file);

    const params = {
      author,
      sender,
      title,
      message,
      isSent,
      isError,
      filename,
      storedfile,
    };

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
  } catch (error) {
    res.sendStatus(400);
    throw error;
  }
});

app.use("*", (req, res) => {
  res.status(404).render("error404");
});

app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});
