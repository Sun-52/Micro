const taskBuilder = require("../controllers/userController.js");

module.exports = (app) => {
  app.route("/user").post(taskBuilder.sign_in); //finished
  app
    .route("/user/profile/:user_id")
    .get(taskBuilder.get_profile) //finished
    .patch(taskBuilder.change_profile);
  app.route("/user/favourite/:user_id").get(taskBuilder.get_favourite);
  app.route("/user/:user_id/:post_id").post(taskBuilder.add_favourite);
};
