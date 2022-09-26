const taskBuilder = require("../controllers/userController.js");

module.exports = (app) => {
  app.route("/user").post(taskBuilder.sign_in);
  app.route("/user/profile/:id").get(taskBuilder.get_profile);
  app.route("/user/favourite/:id").get(taskBuilder.get_favourite);
};
