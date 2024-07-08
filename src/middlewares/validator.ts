import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: any[] = [];
  errors.array().map((err: any) => {
    if (extractedErrors.find((exErr) => exErr.field === err.path)) {
      return;
    }
    extractedErrors.push({ field: err.path, message: err.msg });
  });

  return res.status(422).json({
    errors: extractedErrors,
  });
};
