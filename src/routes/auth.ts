import { Router } from "express";
import { register, login } from "../controllers/auth";
import { validate } from "../middlewares/validator";
import { registerValidator, loginValidator } from "../validators/userValidator";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

export default router;
