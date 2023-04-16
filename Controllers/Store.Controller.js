const Store = require("../Models/Store.Model");
const User = require("../Models/User.Model");

const createStore = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.body.vendor_id });
    if (userData) {
      if (!req.body.latitude || !req.body.longitude) {
        res.status(200).send({ success: true, msg: "Location is Important" });
      } else {
        const storeData = await Store.findOne({ vendor_id: req.body.vendor_id });

        if (storeData) {
          res.status(200).send({
            success: true,
            msg: "This Vendor is Already Creted a Store",
          });
        } else {
          const store = new Store({
            vendor_id: req.body.vendor_id,
            logo: req.file.filename,
            bussiness_email: req.body.bussiness_email,
            adress: req.body.adress,
            pin: req.body.pin,
            location: {
              type: "Point",
              coordinates: [
                parseFloat(req.body.longitude),
                parseFloat(req.body.latitude),
              ],
            },
          });
          const storeSavedData = await store.save();
          res.status(200).send({ success: true, data: storeSavedData });
        }
      } 
    } else {
      res.status(200).send({ success: true, msg: "Vendor ID doesn't Exits" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  createStore,
};
