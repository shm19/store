module.exports = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    messsage: err.message,
    stack: err.stack,
    err
  });
};
