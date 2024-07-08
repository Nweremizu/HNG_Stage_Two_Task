"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationValidator = exports.loginValidator = exports.registerValidator = void 0;
// src/validators/userValidator.ts
const express_validator_1 = require("express-validator");
exports.registerValidator = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    (0, express_validator_1.body)("firstName")
        .notEmpty()
        .withMessage("First Name is required")
        .isString()
        .withMessage("First Name must be a string")
        .escape(),
    (0, express_validator_1.body)("lastName")
        .notEmpty()
        .withMessage("Last Name is required")
        .isString()
        .withMessage("Last Name must be a string")
        .escape(),
    (0, express_validator_1.body)("phone")
        .optional()
        .isMobilePhone("any")
        .withMessage("Invalid phone number"),
];
exports.loginValidator = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];
exports.organizationValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .escape(),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("Description must be a string")
        .escape(),
];
