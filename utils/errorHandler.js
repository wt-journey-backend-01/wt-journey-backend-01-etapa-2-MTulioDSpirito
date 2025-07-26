export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.status && err.errors) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  }

  // Erro genérico
  res.status(500).json({
    status: 500,
    message: 'Erro interno no servidor',
  });
}
