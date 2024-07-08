"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../../db/prisma"));
const tokenService_1 = __importDefault(require("../utils/tokenService"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const register = async (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body;
    // Check if the email already exists
    const existingUser = await prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        return res.status(400).json({
            status: "Bad request",
            message: "Registration unsuccessful",
            statusCode: 400,
        });
    }
    try {
        const user = await prisma_1.default.user.create({
            data: {
                firstName,
                lastName,
                email,
                password,
                phone,
                organizations: {
                    create: {
                        name: `${firstName}'s Organization`,
                        description: `Default organization for ${firstName}`,
                    },
                },
            },
        });
        const token = tokenService_1.default.generateToken({ id: user.userId });
        return res.status(201).json({
            status: "success",
            message: "Registration successful",
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                },
            },
        });
    }
    catch (error) {
        return res.status(400).json({
            status: "Bad request",
            message: "Registration unsuccessful",
            statusCode: 400,
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        return res.status(401).json({
            status: "Bad request",
            message: "Authentication failed",
            statusCode: 401,
        });
    }
    const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({
            status: "Bad request",
            message: "Authentication failed",
            statusCode: 401,
        });
    }
    const token = tokenService_1.default.generateToken({ id: user.userId });
    return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
            accessToken: token,
            user: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            },
        },
    });
};
exports.login = login;
