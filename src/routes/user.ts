import { Router } from "express";
import { getUser } from "../controllers/user";
import auth from "../middlewares/auth";

const router = Router();

router.get("/:id", auth, getUser);

export default router;
