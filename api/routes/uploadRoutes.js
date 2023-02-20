const mongoose = require("mongoose");
const user = mongoose.model("user");
const post = mongoose.model("post");
const bcrypt = require("bcrypt");
const date = require("date-and-time");
//multer
const multer = require("multer");
const memory = multer.memoryStorage();
const upload = multer({ memory });
//firebase
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  connectStorageEmulator,
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
const storageRef = ref(storage, "some-child");

module.exports = (app) => {
  // app.post("/upload", upload.single("file"), async (req, res) => {
  //   const newUser = new user(req.body);
  //   var file = await req.file;
  //   console.log(file);
  //   var filename = file.originalname;
  //   var imageRef = ref(storage, filename);
  //   var metatype = { contentType: file.mimetype, name: file.originalname };
  //   await uploadBytes(imageRef, file.buffer, metatype).then((snapshot) => {
  //     console.log("image uploaded");
  //   });
  //   await getDownloadURL(ref(storage, filename)).then((url) => {
  //     // user.findOneAndUpdate(
  //     //   { _id: req.params.user_id },
  //     //   { profile_image: url },
  //     //   (err, user) => {
  //     //     if (err) res.send(err);
  //     //     res.json(user);
  //     //   }
  //     // );
  //     newUser.profile_image = url;
  //   });
  //   newUser.save((err, user) => {
  //     if (err) res.send(err);
  //     res.json(user);
  //   });
  // });
  app.post("/user/sign_up", upload.single("file"), async (req, res) => {
    var file = await req.file;
    console.log(file, "tet requet file");
    var filename = file.originalname;
    var imageRef = ref(storage, filename);
    var metatype = { contentType: file.mimetype, name: file.originalname };
    const exist = await user.exists({ email: req.body.email });
    if (exist == null) {
      console.log("user dont exist");
      await uploadBytes(imageRef, file.buffer, metatype).then((snapshot) => {
        console.log("image uploaded");
      });
      getDownloadURL(ref(storage, filename)).then(async (url) => {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);
          console.log("salt:", salt, "password:", hashedPassword);
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
          console.log(e, "catch error");
          res.send(e);
        }
      });
    } else {
      console.log("user exist");
      user.findOne({ email: req.body.email }, (err, user) => {
        if (err) res.send(err);
        res.json(user);
      });
    }
  });
  app.post("/post", upload.single("file"), async (req, res) => {
    const newPost = new post(req.body);
    newPost.category = req.body.category.split(",");
    newPost.category = [req.body.category];
    newPost.date = date.format(new Date(), "YYYY/MM/DD");
    var file = await req.file;
    console.log(file);
    var filename = file.originalname;
    var imageRef = ref(storage, filename);
    var metatype = { contentType: file.mimetype, name: file.originalname };
    await uploadBytes(imageRef, file.buffer, metatype).then((snapshot) => {
      console.log("image uploaded");
    });
    await getDownloadURL(ref(storage, filename)).then((url) => {
      console.log(url);
      console.log(newPost);
      newPost.image = url;
    });
    newPost.save(async (err, post) => {
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
          console.log("Post added to user");
        }
      );
      user.findByIdAndUpdate(
        newPost.user,
        { $inc: { posts_count: 1 } },
        (err, user) => {
          if (err) res.send(err);
          console.log("Post count updated");
        }
      );
      res.json(post);
    });
  });
};
