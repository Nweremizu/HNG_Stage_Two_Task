import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import orgRouter from "./routes/org";
import cors from "cors";
import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
