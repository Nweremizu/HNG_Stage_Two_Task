"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const prisma_1 = __importDefault(require("../../db/prisma"));
const getUser = async (req, res) => {
    const userId = req.params.id;
    const authUserId = req.userId;
    // get all the authenticated user's organizations
    const organizations = (await prisma_1.default.user.findUnique({
        where: {
            userId: authUserId,
        },
        select: {
            organizations: {
                select: {
                    name: true,
                    orgId: true,
                    description: true,
                    users: {
                        select: {
                            userId: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },
        },
    }));
    // check if the requested user is in any of the organizations
    const userOrgs = organizations.organizations.filter((org) => {
        return org.users.some((user) => user.userId === userId);
    });
    if (userOrgs.length > 0) {
        return res.status(200).json({
            status: "success",
            message: "User found in organization",
            data: { ...userOrgs[0].users[0] },
        });
    }
    if (userOrgs.length === 0) {
        return res.status(404).json({
            status: "Not found",
            message: "User not found in any organization",
            statusCode: 404,
        });
    }
};
exports.getUser = getUser;
