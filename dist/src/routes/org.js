"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const org_1 = require("../controllers/org");
const auth_1 = __importDefault(require("../middlewares/auth"));
const userValidator_1 = require("../validators/userValidator");
const validator_1 = require("../middlewares/validator");
const orgRouter = (0, express_1.Router)();
orgRouter.get("/", auth_1.default, org_1.getUserOrgs);
orgRouter.get("/:orgId", auth_1.default, org_1.getOrg);
orgRouter.post("/", auth_1.default, userValidator_1.organizationValidator, validator_1.validate, org_1.createOrg);
orgRouter.post("/:orgId/user", auth_1.default, org_1.addUserToOrg);
exports.default = orgRouter;
