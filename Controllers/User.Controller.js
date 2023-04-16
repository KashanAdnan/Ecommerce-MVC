const User = require("../Models/User.Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../Config/config");
const randomString = require("randomstring");
const nodemailer = require("nodemailer");

const SendResetPasswordEmail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smpt.gmail.com",
      port: 456,
      service: "gmail",
      auth: {
        user: "khanzaidaboy@gmail.com",
        pass: "ryyzkoskmmhxoqdq",
      },
    });
    const mailOptions = {
      from: "khanzaidaboy@gmail.com",
      to: email,
      subject: "For Reset Password",
      html: `<h1> Hii ${name} ! </h1> <br /><p>Please Click The Link to <a href="http://localhost:3000/api/reset-password?token=${token}">Reset Your Password</a></p> `,
    };
    transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error.message);
  }
};

const createToken = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.secret_jwt);
    return token;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const securePassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    return hashPassword;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: spassword,
      mobile: req.body.mobile,
      image: req.file.filename,
      type: req.body.type,
    });
    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      res.status(400).send({
        succes: true,
        message: "This Email Already Exits",
      });
    } else {
      const user_data = await user.save();
      res.status(200).send({
        succes: true,
        data: user_data,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Login Method

const userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        const token = await createToken(userData._id);
        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: email,
          password: userData.password,
          image: userData.image,
          mobile: userData.mobile,
          type: userData.type,
          token: token,
        };
        const response = {
          succes: true,
          msg: "User Details",
          data: userResult,
        };
        res.status(200).send(response);
      } else {
        res.status(200).send({
          succes: false,
          msg: "Login Detail is Invalid",
        });
      }
    } else {
      res.status(200).send({
        succes: false,
        msg: "Login Detail is Invalid",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updatePassword = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const password = req.body.password;
    const userData = await User.findOne({ _id: user_id });
    if (userData) {
      const spassword = await securePassword(password);
      const updatedData = await User.findByIdAndUpdate(
        { _id: user_id },
        {
          $set: {
            password: spassword,
          },
        }
      );
      res.status(200).send({
        succes: true,
        msg: "Your Password Has been Updated",
      });
    } else {
      res.status(200).send({
        succes: false,
        msg: "User Id is Invalid",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const randomstring = randomString.generate();
      const userData = await User.updateOne(
        { email: req.body.email },
        { $set: { token: randomstring } }
      );
      await SendResetPasswordEmail(user.name, user.email, randomstring);
      res.status(200).send({
        succes: true,
        msg: "please Check your Inbox OF your Mail and reset your Password",
      });
    } else {
      res.status(200).send({
        succes: true,
        msg: "email Does'nt Exits",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      const password = req.body.password;
      const newPassword = await securePassword(password);
      const userData = await User.findByIdAndUpdate(
        { _id: tokenData._id },
        {
          $set: {
            password: newPassword,
            token: " ",
          },
        },
        { new: true }
      );
      res.status(200).send({
        succes: true,
        data: userData,
      });
    } else {
      res.status(200).send({
        succes: true,
        msg: "This Link has been expired",
      });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  registerUser,
  userLogin,
  updatePassword,
  forgetPassword,
  resetPassword,
};
