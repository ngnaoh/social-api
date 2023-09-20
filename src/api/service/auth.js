const moment = require("moment");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");

const User = require("../models/user");
const RefreshToken = require("../models/refresh-token");
const { jwtExpirationInterval, saltRound } = require("../../config/env-vars");

const generateOtpCode = async () => {
  const code = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  const hashed = await bcrypt.hash(code, Number(saltRound));
  return {
    hashed,
    code,
  };
};
const generateTokenResponse = (user, accessToken) => {
  const tokenType = "Bearer";
  const refreshToken = RefreshToken.generate(user);
  const expiresIn = moment().add(jwtExpirationInterval, "minutes");
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
};

exports.SignIn = async (userData) => {
  const { phone } = userData;
  const user = await User.findOne({ phone }).exec();
  const { code, hashed } = await generateOtpCode();
  if (!user) {
    const newUser = new User({ phone, accessCode: hashed });
    await newUser.save();
  } else {
    await User.findOneAndUpdate({ phone }, { accessCode: hashed });
  }
  await User.sendMessageCode({ phone, code });
  return {};
};

exports.VerifyOtp = async (userData) => {
  const { phone } = userData;
  const { user, accessToken } = await User.verifyOtpAndGenerateToken(userData);
  await User.findOneAndUpdate({ phone }, { accessCode: "" });
  const tokens = generateTokenResponse(user, accessToken);
  return { tokens, user };
};
