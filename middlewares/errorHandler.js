const errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else if (err.errors) {
    let message = err.errors.map((el) => el.message);
    res.status(400).json({ message });
  } else if (err.raw) {
    const { statusCode, message, param, code } = err.raw
    let msg = message
    if (!code || code !== "parameter_missing") { msg = `${param}\n${message}` }
    if (code === 'resource_missing') { msg = message.split(':')[0] }
    res.status(statusCode).json({ message: msg });
  } else if (err.response) {
    const { status, data } = err.response
    if (status === 404) {
      const message = "Not Found"
      res.status(status).json({ message })
    } else {
      const message = data.errors[0].messages
      res.status(status).json({ message })
    }
  } else if (err.name === "JsonWebTokenError") {
    res.status(403).json({ message: "Invalid signature. You don't have permission to access this page" })
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = errorHandler;
