"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
prisma.$use(async (params, next) => {
    if (params.model === 'User' && params.action === 'create') {
        const hashedPassword = await bcryptjs_1.default.hash(params.args.data.password, 10);
        params.args.data.password = hashedPassword;
    }
    return next(params);
});
exports.default = prisma;
