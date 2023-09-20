const passport = require("passport");
const { UNAUTHORIZED } = require("../utils/constants");
const APIError = require("../utils/APIError");

const handleJWT = (req, res, next) => async (err, user, info) => {
  const error = err || info;

  const apiError = new APIError({
    message: error ? error.message : "Unauthorized",
    status: UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });
  if (err || !user) {
    return next(apiError);
  }

  req.user = user;

  return next();
};

exports.Authorize = () => (req, res, next) =>
  passport.authenticate("jwt", { session: false }, handleJWT(req, res, next))(
    req,
    res,
    next
  );
