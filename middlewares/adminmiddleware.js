const { BadRequestError } = require("../errors");
const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    throw new BadRequestError(
      "You Don't Have Authorization To Access This Route"
    );
  }
};

module.exports = isAdmin;
