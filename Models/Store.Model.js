const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  vendor_id: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  bussiness_email: {
    type: String,
    required: true,
  },
  adress: {
    type: String,
  },
  pin: {
    type: String,
    required: true,
  },
  location: {
    type: { type: String, required: true },
    coordinates: [],
  },
});

storeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Store", storeSchema);
