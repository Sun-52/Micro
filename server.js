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

const port = process.env.PORT || 3200;
// const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

userRoutes(app);
postRoutes(app);
uploadRoutes(app);

app.listen(port);

// app.use((req, res) => {
//   res.status(404).send({ url: `${req.originalUrl} not found` });
// });

https
  .createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(port, () => {
    console.log("serever is runing at port 4000");
  });

console.log(`Server started on port ${port}`);
