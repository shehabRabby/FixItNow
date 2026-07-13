import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../config";
import catchAsync from "../utils/catchAsync";


declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new Error("You are not authorized!");
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt_access_secret as Secret);
    req.user = decoded;

    // Role verification 
    if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
      throw new Error("You are forbidden!");
    }

    next();
  });
};

export default auth;