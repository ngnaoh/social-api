const Joi = require("joi");

module.exports = {
  // POST /v1/auth/verify-otp
  VerifyOtp: {
    body: {
      phone: Joi.string().required().min(2).max(30),
      code: Joi.string().required().length(6),
    },
  },

  // POST /v1/auth/sign-in
  SignIn: {
    body: {
      phone: Joi.string().required().min(2).max(30),
    },
  },
};
