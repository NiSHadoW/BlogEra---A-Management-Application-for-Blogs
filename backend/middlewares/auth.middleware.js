import jwt from "jsonwebtoken";

const authMiddleWare = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      message: "Auth token is required",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Token has expired"
          : "Invalid token",
    });
  }
};
export const isAdmin = (req, res, next) => {
  if (req.user?.role != "admin") {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }
  next();
};
export default authMiddleWare;
