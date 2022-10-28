const taskBuilder = require("../controllers/userController.js");

module.exports = (app) => {
  //app.route("/user/:token").post(taskBuilder.sign_in); //finished
  app.route("/user").post(taskBuilder.sign_up);
  app.route("/user/:user_id").get(taskBuilder.sign_in);
  app
    .route("/user/profile/:user_id")
    .get(taskBuilder.get_profile) //finished
    .patch(taskBuilder.change_profile);
  app.route("/user/favourite/:user_id").get(taskBuilder.get_favourite);
  app.route("/user/:user_id/:post_id").post(taskBuilder.add_favourite);
};
