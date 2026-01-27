const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Admin check failed" });
  }
};

module.exports = adminMiddleware;
