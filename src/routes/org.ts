import { Router } from "express";
import {
  getUserOrgs,
  createOrg,
  addUserToOrg,
  getOrg,
} from "../controllers/org";
import auth from "../middlewares/auth";
import { organizationValidator } from "../validators/userValidator";
import { validate } from "../middlewares/validator";

const orgRouter = Router();

orgRouter.get("/", auth, getUserOrgs);

orgRouter.get("/:orgId", auth, getOrg);

orgRouter.post("/", auth, organizationValidator, validate, createOrg);

orgRouter.post("/:orgId/user", auth, addUserToOrg);

export default orgRouter;
