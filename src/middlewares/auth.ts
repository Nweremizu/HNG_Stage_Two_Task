import { Request, Response, NextFunction } from "express";
import TokenService from "../utils/tokenService";
import { JwtPayload } from "jsonwebtoken";

// create a Custom Request interface
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({
      status: "Unauthorized",
      message: "Access denied",
      statusCode: 401,
    });
  }
  try {
    const decoded = TokenService.verifyToken(token) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "Unauthorized",
      message: "Access denied",
      statusCode: 401,
    });
  }
};

export default auth;
