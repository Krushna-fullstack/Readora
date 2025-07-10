// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";

// const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.headers("Authorization").replace("Bearer ", "");

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "No authentication token provided, access denied" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select("-password");
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Error in protectRoute middleware:", error);
//     res.status(500).json({ message: "Token verification failed" });
//   }
// };

// export default protectRoute;

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token provided, access denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Fetch user and attach to request
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res
      .status(401)
      .json({ message: "Unauthorized - token invalid or expired" });
  }
  const protectRoute = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res
          .status(401)
          .json({ message: "No authentication token provided, access denied" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded?.userId) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next(); // ✅ don't forget this
    } catch (error) {
      console.error("Error in protectRoute middleware:", error);
      return res
        .status(401)
        .json({ message: "Unauthorized - token invalid or expired" });
    }
  };
};

export default protectRoute;
