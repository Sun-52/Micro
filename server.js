const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Joi = require("joi");
global.user = require("./api/models/userModel");
global.post = require("./api/models/postModel");
global.comment = require("./api/models/commentModel");
const userRoutes = require("./api/routes/userRoutes");
const postRoutes = require("./api/routes/postRoutes");
const uploadRoutes = require("./api/routes/uploadRoutes");

mongoose.connect(
  "mongodb+srv://Sun_Seree:Su214221@micro.zynfiw9.mongodb.net/Micro_main",
  { useNewUrlParser: true }
);

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

userRoutes(app);
postRoutes(app);
uploadRoutes(app);

app.listen(port);

app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

console.log(`Server started on port ${port}`);
