require('dotenv').config();
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "FitnessAPI";

if (!secret) {
  throw new Error("JWT_SECRET is not set in .env");
}

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin
  };
  return jwt.sign(data, secret, { expiresIn: "1h" });
};

module.exports.verify = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ auth: "Failed", message: "No token provided" });
  }

  const tokenWithoutBearer = token.startsWith("Bearer ") ? token.slice(7) : token;

  jwt.verify(tokenWithoutBearer, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        auth: "Failed",
        message: err.message
      });
    }
    req.user = decoded;
    next();
  });
};