"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenService_1 = __importDefault(require("../utils/tokenService"));
const dotenv_1 = __importDefault(require("dotenv"));
const supertest_1 = __importDefault(require("supertest"));
const prisma_1 = __importDefault(require("../../db/prisma"));
const app_1 = __importDefault(require("../app"));
dotenv_1.default.config();
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
        const token = tokenService_1.default.generateToken(user);
        const decoded = tokenService_1.default.verifyToken(token);
        expect(decoded.userId).toBe(user.userId);
        expect(decoded.firstName).toBe(user.firstName);
        expect(decoded.lastName).toBe(user.lastName);
        expect(decoded.email).toBe(user.email);
    });
    it("should generate a token that expires at the correct time", () => {
        // Mock the current time
        const now = Math.floor(Date.now() / 1000); // current time in seconds
        jest.spyOn(Date, "now").mockImplementation(() => now * 1000);
        const token = tokenService_1.default.generateToken(user);
        const decoded = tokenService_1.default.verifyToken(token);
        // Check that the expiration time is correct (now + 1 hour)
        expect(decoded.exp).toBe(now + 3600);
        // Restore the original Date.now implementation
        jest.spyOn(Date, "now").mockRestore();
    });
});
describe("Authentication (e2e)", () => {
    let token;
    afterAll(async () => {
        await prisma_1.default.user.deleteMany();
        await prisma_1.default.organization.deleteMany();
        await prisma_1.default.userOrganization.deleteMany();
    });
    describe("POST /auth/register", () => {
        it("should register a new user", async () => {
            const res = await (0, supertest_1.default)(app_1.default).post("/auth/register").send({
                firstName: "John",
                lastName: "Doe",
                email: "johnDoe@gmail.com",
                password: "password",
                phone: "1234567890",
            });
            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty("user");
            expect(res.body.data).toHaveProperty("accessToken");
            token = res.body.data.accessToken;
        }, 20000);
        it("should login successfully with the registered user", async () => {
            const res = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
                email: "johnDoe@gmail.com",
                password: "password",
            });
            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty("user");
            expect(res.body.data).toHaveProperty("accessToken");
        });
        it("should not login successfully with incorrect data", async () => {
            const res = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
                email: "johnDoe@gmail.com",
                password: "wrong-password",
            });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Authentication failed");
        });
        it("should not register a user with an existing email", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/register").send({
                firstName: "John",
                lastName: "Black",
                email: "johnDoe@gmail.com",
                password: "password",
                phone: "1234567890",
            });
            expect(response.status).toBe(422);
            expect(response.body.statusCode).toBe(422);
            expect(response.body.message).toBe("Registration unsuccessful");
        });
        it("should return validation error if required fields are missing", async () => {
            const testCases = [
                {
                    firstName: "John",
                    lastName: "Doe",
                    email: "johnDoe@gmail.com",
                },
                { firstName: "John", lastName: "Doe", password: "password" },
                {
                    firstName: "John",
                    email: "johnDoe@gmail.com",
                    password: "password",
                },
                {
                    lastName: "Doe",
                    email: "johnDoe@gmail.com",
                    password: "password",
                },
            ];
            for (const data of testCases) {
                const response = await (0, supertest_1.default)(app_1.default).post("/auth/register").send(data);
                expect(response.status).toBe(422);
                expect(response.body.errors);
            }
        });
        it("should check the default organization is created", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get("/api/organisations")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
    });
});
