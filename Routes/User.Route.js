const express = require("express");
const userRoute = express();
const userController = require("../Controllers/User.Controller");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const auth = require("../Middleware/Auth");

userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }));
userRoute.use(express.static("Public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../Public/UserImages"),
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

userRoute.post(
  "/register",
  upload.single("image"),
  userController.registerUser
);

userRoute.post("/login", userController.userLogin);

userRoute.get("/test", auth.verifyToken, function (req, res) {
  res.status(200).send({
    success: true,
    msg: "Auttenticated",
  });
});

userRoute.post(
  "/update-password",
  auth.verifyToken, 
  userController.updatePassword
);

userRoute.post("/forget-password", userController.forgetPassword);

userRoute.get("/reset-password", userController.resetPassword);

module.exports = userRoute;
