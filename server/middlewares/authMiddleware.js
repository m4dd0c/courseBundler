import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../Model/User.js";

export const authMiddleware = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return next(new ErrorHandler("Unauthorized User", 401));

  const isIdeal = jwt.verify(token, process.env.JWT_SECRET);

  if (!isIdeal) return next(new ErrorHandler("Unauthorized User", 401));

  req.id = isIdeal.id;
  next();
};

export const authorizedAdmin = async (req, res, next) => {
  const userId = req.id;
  const currentUser = await User.findById(userId);
  if (currentUser.role !== "admin")
    return next(
      new ErrorHandler(
        `${currentUser.role} is not allowed to access this resource`,
        403,
      ),
    );

  next();
};

export const authorizedSubscribers = async (req, res, next) => {
  const userId = req.id;
  const currentUser = await User.findById(userId);
  if (
    currentUser.role !== "admin" &&
    currentUser.subscription.status !== "active"
  )
    return next(
      new ErrorHandler(
        "Only authorized subscribers can access this resource | Admin not allowed to access this resource",
        403,
      ),
    );

  next();
};
