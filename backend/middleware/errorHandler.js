module.exports = (err, req, res, next) => {
  // Default status
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;

  // Log full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  } else {
    console.error(err.message);
  }

  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};
