"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map((err) => {
        if (extractedErrors.find((exErr) => exErr.field === err.path)) {
            return;
        }
        extractedErrors.push({ field: err.path, message: err.msg });
    });
    return res.status(422).json({
        errors: extractedErrors,
    });
};
exports.validate = validate;
