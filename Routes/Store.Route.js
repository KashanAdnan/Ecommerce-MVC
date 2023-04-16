const express = require("express");
const storeRoute = express();
const storeController = require("../Controllers/Store.Controller.js");

const bodyParser = require("body-parser");
storeRoute.use(bodyParser.urlencoded({ extended: true }));
storeRoute.use(bodyParser.json());

const multer = require("multer");
const path = require("path");
storeRoute.use(express.static("Public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../Public/storeImages"),
      function (err, succes) {
        if (err) throw err;
      }
    );
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name, (err, succes) => {
      if (err) throw err;
    });
  },
});

const upload = multer({ storage: storage });
const auth = require("../Middleware/Auth.js");

storeRoute.post(
  "/create-store",
  upload.single("logo"),
  auth.verifyToken,
  storeController.createStore
);

module.exports = storeRoute;
