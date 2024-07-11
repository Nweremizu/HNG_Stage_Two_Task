import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRouter from "./src/routes/auth";
import userRouter from "./src/routes/user";
import orgRouter from "./src/routes/org";
import cors from "cors";
import app from "./src/app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
