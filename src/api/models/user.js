const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const moment = require("moment");

const APIError = require("../../utils/APIError");
const { INVALID_CREDENTIALS, UNAUTHORIZED } = require("../../utils/constants");
const {
  jwtExpirationInterval,
  jwtSecret,
  verifySid,
} = require("../../config/env-vars");
const { TwilioClient } = require("../../config/twilio");

/**
 * User Schema
 * @private
 */
const UserModel = new Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    accessCode: {
      type: String,
      trim: true,
      default: "",
    },
    facebookToken: {
      type: String,
      trim: true,
      default: null,
    },
    instagramToken: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

UserModel.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "phone",
      "accessCode",
      "facebookToken",
      "instagramToken",
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
  token() {
    const payload = {
      exp: moment().add(jwtExpirationInterval, "minutes").unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return Jwt.sign(payload, jwtSecret);
  },
  async verificationChecks(options) {
    const { phone, code } = options;
    return TwilioClient.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: `+${phone}`, code });
  },
  async compareAccessCode(code) {
    return bcrypt.compare(code, this.accessCode);
  },
});

UserModel.statics = {
  async createVerificationCode(phone) {
    return TwilioClient.verify.v2
      .services(verifySid)
      .verifications.create({ to: `+${phone}`, channel: "sms" });
  },

  async sendMessageCode(options) {
    const { phone, code } = options;
    return TwilioClient.messages.create({
      body: code,
      from: "+15706781048",
      to: `+${phone}`,
    });
  },

  async verifyOtpAndGenerateToken(options) {
    const { phone, code } = options;
    const user = await this.findOne({ phone }).exec();
    if (!user) {
      throw new APIError({
        message: INVALID_CREDENTIALS,
        status: UNAUTHORIZED,
      });
    }

    if (!(await user.compareAccessCode(code))) {
      throw new APIError({
        message: INVALID_CREDENTIALS,
        status: UNAUTHORIZED,
      });
    }
    return { user: user.transform(), accessToken: user.token() };
  },
};

module.exports = model("users", UserModel);
