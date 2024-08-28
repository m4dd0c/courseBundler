import express from "express";
import { config } from "dotenv";
config({ path: "./config/.env" });
import userRouter from "./routes/userRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import otherRouter from "./routes/otherRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(cookieParser());

app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", otherRouter);

app.use(errorMiddleware);
export default app;
