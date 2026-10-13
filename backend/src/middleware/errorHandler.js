export const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational 
    ? err.message 
    : 'Terjadi kesalahan internal pada server. Silakan coba beberapa saat lagi.';

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rute API '${req.originalUrl}' tidak ditemukan`,
  });
};
