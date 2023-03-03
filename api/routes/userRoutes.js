const taskBuilder = require("../controllers/userController.js");

module.exports = (app) => {
  app.route("/user/sign_in").post(taskBuilder.signIn);
  app.route("/user/profile/:user_id").get(taskBuilder.getProfile);
  app.route("/user/favourite/:user_id").get(taskBuilder.getFavourite);
  app.route("/user/:user_id/:post_id").patch(taskBuilder.addFavourite);
  app.route("/user/change/name/:user_id").patch(taskBuilder.changeName);
};
