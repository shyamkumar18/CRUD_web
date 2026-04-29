const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/Auth");
const postRoutes = require("./routes/posts");

const app = express();
const port = process.env.PORT || 3000;
const secret = process.env.JWT_SECRET || "ace1812";

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb+srv://shyam18:shyam1812@cluster0.9tzmpza.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
