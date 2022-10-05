//before
const taskBuilder = require("../controllers/uploadController.js");
// const multer = require("Multer");
// const memoStorage = multer.memoryStorage();
// const upload = multer({ memoStorage });
// const { ref, uploadBytes, listAll, deleteObject } = require("firebase/storage");
// const storage = require("./firebase");
//after
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");
module.exports = (app) => {
  app.route("/upload", upload).post(taskBuilder.add_profile_image);
  // before
  // app.post("/upload", upload.single("file"), async (req, res) => {
  //   const file = req.file;
  //   console.log(req.file);
  //   const imageRef = ref(storage, file.originalname);
  //   const metatype = { contentType: file.mimetype, name: file.originalname };
  //   await uploadBytes(imageRef, file.buffer, metatype)
  //     .then(async (snapshot) => {
  //       const url = await snapshot.ref.getDownloadURL();
  //       console.log(url);
  //     })
  //     .catch((error) => console.log(error));
  // });
};
