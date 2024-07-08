import jwt, { Secret } from "jsonwebtoken";

class TokenService {
  private static secret: Secret = process.env.JWT_SECRET || "default-secret";
  private static expiresIn = process.env.JWT_EXPIRES_IN || "1h"; // Default to 1 hour if not set

  static generateToken(payload: any, expiration?: string) {
    console.log(
      `Generating token with expiration: ${expiration || this.expiresIn}`
    );
    return jwt.sign(payload, this.secret, {
      expiresIn: expiration || this.expiresIn,
    });
  }

  static verifyToken(token: string) {
    return jwt.verify(token, this.secret);
  }
}

export default TokenService;
