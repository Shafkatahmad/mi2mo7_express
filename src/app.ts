import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();

// middleware?
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  // res.send("Hello World!");
  res.status(200).json({
    message: "Express Server",
    author: "Next Level",
  });
});

app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);

// GET all users from database

// GET user by id from neonDB postgresql database
// app.get("/api/users/:id", async (req: Request, res: Response) => {...

// UPDATE users by PUT method
// app.put("/api/users/:id", async (req: Request, res: Response) => {...

// DELETE user
// app.delete("/api/users/:id", async (req: Request, res: Response) => {...

export default app;
