const { apiKey } = require("../utils/hosts");

module.exports.authentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports.serverOnly = (req, res, next) => {
  // Access the Authorization header value
  function extractTokenFromHeader(request) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  const apiKeyOfRequest = extractTokenFromHeader(req);

  if (apiKey === apiKeyOfRequest) {
    next();
  } else {
    res.status(403).send("Unauthorized request");
  }
};
