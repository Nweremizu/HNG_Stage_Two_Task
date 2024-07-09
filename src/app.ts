import express, { Request, Response } from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import orgRouter from "./routes/org";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send(`
        <div style="height: 100vh; display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <div style="text-align: center; margin-top: 20px;">
                <h1>Welcome to the API</h1>
            </div>
        </div>
    `);
});

app.use("/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/organisations", orgRouter);

export default app;
