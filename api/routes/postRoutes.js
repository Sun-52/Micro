const taskBuilder = require("../controllers/postController.js");

module.exports = (app) => {
  app.route("/post").post(taskBuilder.publish).get(taskBuilder.get_all_post); //finished
  app.route("/post/category").get(taskBuilder.get_post_by_category); //finished
  app.route("/post/search").get(taskBuilder.search); //finished
  app
    .route("/post/:post_id")
    .get(taskBuilder.view_post) //finished
    .post(taskBuilder.post_comment); //finished
  app.route("/post/:post_id/:user_id").patch(taskBuilder.like); //finished
};
