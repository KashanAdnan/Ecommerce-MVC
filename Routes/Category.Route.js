const express = require("express");
const categoryRoute = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const auth = require("../Middleware/Auth");
const categoryController = require("../Controllers/Category.Controller");

categoryRoute.use(bodyParser.json());
categoryRoute.use(bodyParser.urlencoded({ extended: true }));
categoryRoute.use(express.static("Public"));

categoryRoute.post(
  "/add-category",
  auth.verifyToken,
  categoryController.addCategory
);

module.exports = categoryRoute;
