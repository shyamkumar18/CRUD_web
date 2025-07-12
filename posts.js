const express = require("express");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

const router = express.Router();

async function Authorize (req,res,next){
    const verification = req.header("Authorization")
    if(!verification){
        return res.status(400).json({
            error:"Invalid Token"
        })
    }

    const part = verification.split(' ');
    if (part.length !== 2 || part[0] !== "Bearer") {
      return res.status(400).json({
        error: "Token error"
        });
    }

    const token = part[1];

    try{
        const verified = jwt.verify(token, secret);
        req.userId = verified.userId;
        next();
    }catch (error) {
        res.status(400).json({ 
            error: "Invalid token"
        });
    }
};

router.post('/', Authorize, async function (req, res) {
    try {
      const { title,content } = req.body;
  
      const post = new Post({ title, content, author: req.userId });
  
      await post.save();
      res.status(200).json(post);
    }catch (error) {
      res.status(400).json({ 
        error: "Error in creating post"
        });
    }
});

router.get('/', Authorize , async function (req, res) {
    try {
      const posts = await Post.find({ author: req.userId });
      res.json(posts);
    } catch (error) {
      res.status(400).json({ 
        error: "Error in getting the posts"
    });
    }
});

router.put('/:id', Authorize, async function (req, res){
    try {
      const { title, content } = req.body;
      const post = await Post.findOneAndUpdate({ _id: req.params.id, author: req.userId },{ title, content },{new:true});
      if (!post) return res.status(400).json({ 
        error: "No Post available"
    });
      res.json(post);
    } catch (error) {
      res.status(400).json({ 
        error: error 
    })
    }
});

router.delete('/:id', Authorize, async function (req, res){
    try {
      const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.userId });
      if (!post) {
        return res.status(400).json({ 
            error: 'Post not found'
        });
      }
      res.json({ 
        message: 'Post deleted successfully' 
    });
    } catch (error) {
      res.status(400).json({ 
        error: error
    });
    }
  });
  
  module.exports = router;