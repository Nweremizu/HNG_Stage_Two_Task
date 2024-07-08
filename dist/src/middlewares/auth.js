"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenService_1 = __importDefault(require("../utils/tokenService"));
const auth = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({
            status: "Unauthorized",
            message: "Access denied",
            statusCode: 401,
        });
    }
    try {
        const decoded = tokenService_1.default.verifyToken(token);
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        return res.status(401).json({
            status: "Unauthorized",
            message: "Access denied",
            statusCode: 401,
        });
    }
};
exports.default = auth;
