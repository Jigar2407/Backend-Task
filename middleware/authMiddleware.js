import jwt from "jsonwebtoken";

const JWT_SECRET = "MY_SECRET_KEY";

export const protect = ( req, res, next ) => {
    let token = req.headers.authorization;

    if(!token || !token.startsWith("Bearer "))
        return res.status(401).json({ message: "Unauthorized" });

    token = token.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};