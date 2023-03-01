const mongoose = require("mongoose");
const user = mongoose.model("user");
const post = mongoose.model("post");
const bcrypt = require("bcrypt");
const date = require("date-and-time");
const multer = require("multer");
const memory = multer.memoryStorage();
const upload = multer({ memory });
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const firebaseConfig = {
  apiKey: "AIzaSyAD0aQQJv07HsEjZE4Hk-bfPHQEe09izEs",
  authDomain: "micro-1056f.firebaseapp.com",
  projectId: "micro-1056f",
  storageBucket: "micro-1056f.appspot.com",
  messagingSenderId: "1028560240443",
  appId: "1:1028560240443:web:2df931649d7f924038011e",
  measurementId: "G-BTH30YZNXV",
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = (app) => {
  app.post("/user/sign_up", upload.single("file"), async (req, res) => {
    const file = await req.file;
    const imageRef = ref(storage, file.originalname);
    const metatype = { contentType: file.mimetype, name: file.originalname };
    const exist = await user.exists({ email: req.body.email });
    if (exist == null) {
      await uploadBytes(imageRef, file.buffer, metatype).then((snapshot) => {});
      getDownloadURL(imageRef).then(async (url) => {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);
          const newUser = new user({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            profile_image: url,
          });
          newUser.save((err, user) => {
            if (err) console.log(err);
            res.json(user);
          });
        } catch (e) {
          res.send(e);
        }
      });
    } else {
      user.findOne({ email: req.body.email }, (err, user) => {
        if (err) res.send(err);
        res.json(user);
      });
    }
  });

  app.post("/post", upload.single("file"), async (req, res) => {
    const newPost = new post(req.body);
    var file = await req.file;
    var imageRef = ref(storage, file.originalname);
    var metatype = { contentType: file.mimetype, name: file.originalname };
    await uploadBytes(imageRef, file.buffer, metatype).then((snapshot) => {});
    await getDownloadURL(imageRef).then((url) => {
      newPost.image = url;
    });
    newPost.category = req.body.category.split(",");
    newPost.date = date.format(new Date(), "YYYY/MM/DD");
    newPost.save((err, post) => {
      if (err) res.send(err);
      user.findByIdAndUpdate(
        newPost.user,
        {
          $addToSet: {
            posts: newPost._id,
          },
        },
        { new: true },
        (err, user) => {
          if (err) console.log(err);
        }
      );
      user.findByIdAndUpdate(
        newPost.user,
        { $inc: { posts_count: 1 } },
        (err, user) => {
          if (err) res.send(err);
        }
      );
      res.json(post);
    });
  });
};
