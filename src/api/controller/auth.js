const { SignIn, VerifyOtp } = require("../service/auth");
const { OK, CREATED } = require("../../utils/constants");
const moment = require("moment");
const { jwtExpirationInterval } = require("../../config/env-vars");

exports.signIn = async (req, res, next) => {
  try {
    const data = await SignIn(req.body);
    res.status(CREATED).json({ data, success: "SUCCESS" });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const data = await VerifyOtp(req.body);
    const cookie = req?.cookies?.accessToken;
    if (!cookie) {
      res.cookie("accessToken", data.tokens.accessToken, {
        maxAge: moment().add(jwtExpirationInterval, "minutes").unix(),
        httpOnly: true,
      });
    }
    res.status(OK).json({ data, success: "SUCCESS" });
  } catch (err) {
    next(err);
  }
};
