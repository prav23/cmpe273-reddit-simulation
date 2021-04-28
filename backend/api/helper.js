const successResponse = (req, res, data, code = 200) =>
  res.status(code).send({
    data,
    success: true,
  });

const errorResponse = (
  req,
  res,
  errorMessage = "Something went wrong",
  code = 500,
  error = {}
) =>
  res.status(code).json({
    errorMessage,
    error,
    data: null,
    success: false,
  });

module.exports = {successResponse, errorResponse};