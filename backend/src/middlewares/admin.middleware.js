const { unauthorized } = require("../utils/response");

function requireAdmin(req, res, next) {
  const token = req.header("x-admin-token");

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return unauthorized(res, "Invalid admin token");
  }

  next();
}

module.exports = { requireAdmin };