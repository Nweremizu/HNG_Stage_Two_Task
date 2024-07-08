"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    static generateToken(payload, expiration) {
        console.log(`Generating token with expiration: ${expiration || this.expiresIn}`);
        return jsonwebtoken_1.default.sign(payload, this.secret, {
            expiresIn: expiration || this.expiresIn,
        });
    }
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.secret);
    }
}
TokenService.secret = process.env.JWT_SECRET || "default-secret";
TokenService.expiresIn = process.env.JWT_EXPIRES_IN || "1h"; // Default to 1 hour if not set
exports.default = TokenService;
