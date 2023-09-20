const User = require("../models/user");

exports.LoginUser = (req, res) => res.json(req.user.transform());

exports.Get = async (id) => User.findById(id);

exports.UpdateUser = async (user, newData) => {
  const updateData = Object.assign(user, newData);
  const savedUser = await updateData.save();
  return savedUser.transform();
};
