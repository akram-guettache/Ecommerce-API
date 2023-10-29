const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please Provide Your First Name"],
    minlength: 3,
    maxlength: 20,
  },
  lastname: {
    type: String,
    required: [true, "Please Provide Your Last Name"],
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your E-mail"],
    validate: {
      validator: validator.isEmail,
      message: "Please Provide A Valid Email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide Your Password"],
    minlength: 6,
  },
  wishlist: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Product",
  },
  verificationToken: String,
  verified: {
    type: Boolean,
    default: false,
  },
  passtoken: String,
  pwrexp: Date,
  adress: {
    type: String,
    minlength: 6,
  },

  role: {
    type: String,
    default: "user",
  },
});
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function (refreshToken) {
  return jwt.sign(
    {
      userId: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      role: this.role,
      refreshToken,
    },
    process.env.JWT_SECRET
  );
};
UserSchema.methods.comparePW = async function (password) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

module.exports = mongoose.model("User", UserSchema);
