import express, { Request, Response } from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import orgRouter from "./routes/org";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/organisations", orgRouter);

export default app;
