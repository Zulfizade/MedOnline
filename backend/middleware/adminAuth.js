// middleware/adminAuth.js
export const adminAuth = (req, res, next) => {
  const user = req.user; // token’dan user bilgisi middleware ile gelmeli
  if (user && user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin yetkisi gerekli' });
  }
};
