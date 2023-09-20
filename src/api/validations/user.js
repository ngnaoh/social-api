const Joi = require("joi");

module.exports = {
  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      facebookToken: Joi.string(),
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
