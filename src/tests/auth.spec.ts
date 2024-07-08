import TokenService from "../utils/tokenService";
import { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import request from "supertest";
import prisma from "../../db/prisma";
import app from "../app";

dotenv.config();

describe("Token Generation", () => {
  const user = {
    userId: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
  };

  beforeAll(() => {
    // Override the secret and expiresIn for testing
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h"; // 1 hour
  });

  afterAll(() => {
    // Clean up environment variables
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRES_IN;
  });

  it("should include correct user details in the token", () => {
    const token = TokenService.generateToken(user);
    const decoded = TokenService.verifyToken(token) as JwtPayload;

    expect(decoded.userId).toBe(user.userId);
    expect(decoded.firstName).toBe(user.firstName);
    expect(decoded.lastName).toBe(user.lastName);
    expect(decoded.email).toBe(user.email);
  });

  it("should generate a token that expires at the correct time", () => {
    // Mock the current time
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    jest.spyOn(Date, "now").mockImplementation(() => now * 1000);

    const token = TokenService.generateToken(user);
    const decoded = TokenService.verifyToken(token) as JwtPayload;

    // Check that the expiration time is correct (now + 1 hour)
    expect(decoded.exp).toBe(now + 3600);

    // Restore the original Date.now implementation
    jest.spyOn(Date, "now").mockRestore();
  });
});

describe("Authentication (e2e)", () => {
  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.userOrganization.deleteMany();
  });

  describe("POST /auth/register", () => {
    it("should register a new user with default organisation", async () => {
      const res = await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "johnDoe@gmail.com",
        password: "password",
        phone: "1234567890",
      });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data).toHaveProperty("accessToken");

      const user = (await prisma.user.findUnique({
        where: {
          userId: res.body.data.user.userId,
        },
        select: {
          organizations: {
            select: {
              name: true,
              description: true,
            },
          },
        },
      })) as any;
      console.log(user);
      expect(user).toBeTruthy();
      expect(user.organizations).toHaveLength(1);
      expect(user.organizations[0].name).toBe("John's Organization");
    }, 20000);

    it("should login successfully with the registered user", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "johnDoe@gmail.com",
        password: "password",
      });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data).toHaveProperty("accessToken");
    });

    it("should not login successfully with incorrect data", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "johnDoe@gmail.com",
        password: "wrong-password",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Authentication failed");
    });

    it("should not register a user with an existing email", async () => {
      const response = await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Black",
        email: "johnDoe@gmail.com",
        password: "password",
        phone: "1234567890",
      });

      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Registration unsuccessful");
    });

    it("should return validation error if required fields are missing", async () => {
      const testCases = [
        {
          firstName: "John",
          lastName: "Doe",
        },
        { firstName: "John", email: "johnDoe@gmail.com", lastName: "Doe" },
        {
          firstName: "John",
          email: "johnDoe@gmail.com",
        },
        {
          lastName: "Doe",
          email: "johnDoe@gmail.com",
        },
      ];

      for (const data of testCases) {
        const response = await request(app).post("/auth/register").send(data);

        expect(response.status).toBe(422);
        expect(response.body.errors);
      }
    });
  });
});
