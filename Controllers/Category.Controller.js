const Category = require("../Models/Category.Model");

const addCategory = async (req, res) => {
  try {
    const categor_data = await Category.find();
    if (categor_data.length > 0) {
      let checking = false;
      for (let i = 0; i < categor_data.length; i++) {
        if (
          categor_data[i]["category"].toLowerCase() ===
          req.body.category.toLowerCase()
        ) {
          checking = true;
          break;
        }
      }
      if (checking == false) {
        const category = new Category({
          category: req.body.category,
        });
        const cat_data = await category.save();
        res.status(200).send({
          success: true,
          msg: cat_data,
        });
      } else {
        res.status(200).send({
          success: true,
          msg: "This category Already Exits",
        });
      }
    }

    //////////////////
    else {
      const category = new Category({
        category: req.body.category,
      });
      const cat_data = await category.save();
      res.status(200).send({
        success: true,
        msg: cat_data,
      });
    }
  } catch (error) {
    res.status(400).send({
      succes: false,
      msg: error.message,
    });
  }
};

module.exports = {
  addCategory,
};
