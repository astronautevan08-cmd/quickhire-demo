const { serverError } = require("./response");

function asyncHandler(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error(err);
      return serverError(res, err.message || "Server error");
    }
  };
}

module.exports = { asyncHandler };