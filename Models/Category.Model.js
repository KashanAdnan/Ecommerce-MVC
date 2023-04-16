const mongoose = require("mongoose");

const category = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Category", category);
