import express, { Request, Response } from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import orgRouter from "./routes/org";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  // send a html response with styling and it should be centered in the middle of the page
  res.send(`
    <html>
    <head>
    <style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    h1 {
        font-size: 3rem;
    }
    </style>
    </head>
    <body>
    <h1>Welcome to the API</h1>
    </body>
    </html>
    `);
});

app.use("/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/organisations", orgRouter);

export default app;
