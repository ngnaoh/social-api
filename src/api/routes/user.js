const app = require("express").Router();
const Validate = require("express-validation");
const controller = require("../controller/user");

const { Authorize } = require("../../middleware/auth");
const { updateUser } = require("../validations/user");

app.param("userId", controller.load);

app.route("/profile").get(Authorize(), controller.loggedIn);

app
  .route("/:userId")
  .get(Authorize(), controller.get)
  .patch(Authorize(), Validate(updateUser), controller.update);

module.exports = app;
