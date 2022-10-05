// before
// const { initializeApp } = require("firebase/app");
// const { getStorage } = require("firebase/storage");

// const firebaseConfig = {
//   apiKey: "AIzaSyAD0aQQJv07HsEjZE4Hk-bfPHQEe09izEs",
//   authDomain: "micro-1056f.firebaseapp.com",
//   projectId: "micro-1056f",
//   storageBucket: "micro-1056f.appspot.com",
//   messagingSenderId: "1028560240443",
//   appId: "1:1028560240443:web:2df931649d7f924038011e",
//   measurementId: "G-BTH30YZNXV",
// };

// const firebaseApp = initializeApp(firebaseConfig);

// module.exports = getStorage(firebaseApp);
// after
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBK8_82Hq6XkcJZ5ZucAQILE32YeyMMZUY",
  authDomain: "micro-main.firebaseapp.com",
  projectId: "micro-main",
  storageBucket: "micro-main.appspot.com",
  messagingSenderId: "553656906791",
  appId: "1:553656906791:web:a575ee23ff4cc8698d8a02",
  measurementId: "G-8GV5W6HVDD",
};

const db = initializeApp(firebaseConfig);

module.exports = db;
