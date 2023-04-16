const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./Routes/User.Route");
const storeRoute = require("./Routes/Store.Route");
const categoryRoute = require("./Routes/Category.Route");

mongoose.connect("mongodb://localhost:27017/ECOMMVC");

//User Route

app.use("/api", userRoute);

//Store Route

app.use("/api", storeRoute);

//Category Route
app.use("/api", categoryRoute);

app.listen(3000, () => {
  console.log("Server is ready");
});
