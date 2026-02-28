function ok(res, data, message = "OK") {
  return res.status(200).json({ success: true, message, data });
}

function created(res, data, message = "Created") {
  return res.status(201).json({ success: true, message, data });
}

function badRequest(res, message = "Bad Request", errors = null) {
  return res.status(400).json({ success: false, message, errors });
}

function notFound(res, message = "Not Found") {
  return res.status(404).json({ success: false, message });
}

function unauthorized(res, message = "Unauthorized") {
  return res.status(401).json({ success: false, message });
}

function serverError(res, message = "Server error") {
  return res.status(500).json({ success: false, message });
}

module.exports = {
  ok,
  created,
  badRequest,
  notFound,
  unauthorized,
  serverError,
};