import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import fs from "fs";
import logger from "./modules/middleware/logger";
import CookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./modules/middleware/globalErrorHandler";

const app: Application = express();

// middleware?
app.use(CookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   }),
// );
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);

// Global Error Handling Middleware
app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response) => {
  // res.send("Hello World!");
  res.status(200).json({
    message: "Express Server",
    author: "Next Level",
  });
});
// GET all users from database

// GET user by id from neonDB postgresql database
// app.get("/api/users/:id", async (req: Request, res: Response) => {...

// UPDATE users by PUT method
// app.put("/api/users/:id", async (req: Request, res: Response) => {...

// DELETE user
// app.delete("/api/users/:id", async (req: Request, res: Response) => {...

export default app;
