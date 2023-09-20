const app = require("express").Router();
const Validate = require("express-validation");
const controller = require("../controller/auth");
const validations = require("../validations/auth");

app.route("/sign-in").post(Validate(validations.SignIn), controller.signIn);
app
  .route("/verify-otp")
  .post(Validate(validations.VerifyOtp), controller.verifyOtp);

module.exports = app;
