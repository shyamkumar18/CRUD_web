const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

router.post("/register", async function (req,res) {
  try{
    const { username ,password } = req.body

      if(!username || !password){
        return res.status(400).json({
          error:"Email And Password Required"
        });
      };

    const isExist = await User.findOne({ username })
      if(isExist){
          return res.status(400).json({
              error:"User Already Exists So Please Login"
          })
      };

    const hashedPassword = await bcrypt.hash(password,10);

    // const user = new User({ username, password: hashedPassword });

    let usercreate = await User.create({ username, password: hashedPassword })
    if(!usercreate){
        return res.status(400).json({
            error: "Error in creating the user"
        })
    }
    res.status(200).json({ 
      message: "User registered successfully"
    });
  }catch (error) {
    res.status(400).json({ 
      error
    });
  }
});


router.post("/login",async function (req,res){
  try {
    const { username,password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ 
        error: "User not found"
      });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ 
        error: "Invalid password"
      });
    }
    
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1d' });
    res.json({ token });
  }catch (error) {
    res.status(400).json({
      error: "Error logging in" 
    });
  }
});
    
module.exports = router;