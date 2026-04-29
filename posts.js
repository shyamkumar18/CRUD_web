const express = require("express");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

const router = express.Router();
const secret = process.env.JWT_SECRET || "fallback_secret";

async function Authorize(req, res, next) {
    const verification = req.header("Authorization");

    if (!verification) {
        return res.status(401).json({
            error: "Token required"
        });
    }

    const part = verification.split(" ");
    if (part.length !== 2 || part[0] !== "Bearer") {
        return res.status(401).json({
            error: "Invalid token format"
        });
    }

    const token = part[1];

    try {
        const verified = jwt.verify(token, secret);
        req.userId = verified.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid token"
        });
    }
}

router.post("/", Authorize, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                error: "Title and content required"
            });
        }

        const post = new Post({
            title,
            content,
            author: req.userId
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({
            error: "Error creating post"
        });
    }
});

router.get("/", Authorize, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.userId });
        res.json(posts);
    } catch (error) {
        res.status(500).json({
            error: "Error fetching posts"
        });
    }
});

router.put("/:id", Authorize, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                error: "Title and content required"
            });
        }

        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, author: req.userId },
            { title, content },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({
            error: "Error updating post"
        });
    }
});

router.delete("/:id", Authorize, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({
            _id: req.params.id,
            author: req.userId
        });

        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        res.json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Error deleting post"
        });
    }
});

module.exports = router;
