// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import { generateToken } from "../middleware/authMidlleware.js";

const bcrypt = require("bcryptjs");
const User = require("../models/user.models.js");
const {generateToken} = require("../middlewares/auth.middlewares.js");





const registerUser = async (req, res) => {


  const { email, password, fullName, userName } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User with EmailID already exists" });
    }

    let user1 = await User.findOne ({ userName });
    if (user1) {
      return res.status(400).json({ message: "User with UserName already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
      fullName,
      userName

    });
    await user.save();

    // const token = await new Token({
    //   userId: user._id,
    //   token: crypto.randomBytes(32).toString("hex"),
    // }).save();
    // console.log(`token while registering is : ${token}`);
    // const url = `${process.env.BASE_URL}/users/${user.id}/verify/${token.token}`;
    // await sendEmail(user.email, "Verify Email", url);

    res.status(201).json({
      userId: user._id,
      mssg: "Registered Successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    

    const token = generateToken({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      fullName: user.fullName,


    });
    console.log(`email is : ${email}`);
  console.log(`password is : ${password}`);

    return res.json({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserDetails = async (req, res) => {

  try {
    const user = await User.findById(req.body._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  }
  catch (error) {
    console.error("Error getting user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};






module.exports = { registerUser, loginUser, getUserDetails };