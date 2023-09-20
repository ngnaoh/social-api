const { Get, UpdateUser } = require("../service/user");
const { Handler } = require("../../middleware/error");

exports.load = async (req, res, next, id) => {
  try {
    const user = await Get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return Handler(error, req, res, next);
  }
};

exports.get = (req, res) =>
  res.json({ data: req.locals.user.transform(), success: "SUCCESS" });

exports.loggedIn = (req, res) =>
  res.json({ data: req.user.transform(), success: "SUCCESS" });

exports.update = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const response = await UpdateUser(user, req.body);
    return res.json({ data: response, success: "SUCCESS" });
  } catch (error) {
    return next(error);
  }
};
