import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";

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

// GET all users from database
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `);
    res.status(200).json({
      success: true,
      message: "Users retrived successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

// GET user by id from neonDB postgresql database
app.get("/api/users/:id", async (req: Request, res: Response) => {
  // const id = req.params;
  // const id = req.params.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id=$1
      `,
      [id],
    );

    // If user not found by id
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrived successfully",
      data: result.rows[0],
    });
    console.log(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

// UPDATE users by PUT method
app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

  // console.log("ID: ", id);
  // console.log({ name, password, age, id_active });

  try {
    const result = await pool.query(
      // added COALESCE to not update if that parameter is not given: COALESCE(%1, variableName)
      `
    UPDATE users
    SET
    name =COALESCE($1, name),
    password=COALESCE($2, password),
    age=COALESCE($3, age),
    is_active=COALESCE($4, is_active)

    WHERE id = $5 RETURNING *
    `,
      [name, password, age, is_active, id],
    );

    // We don't want to see the updated message in console. We want to see the updated result as resonse.
    // console.log(result);

    // if user with that :id is not found to update:
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: result.rows[0],
      });
    }

    // if user with :id is found to update
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error.message,
      data: error,
    });
  }
});

// DELETE user
app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM users WHERE id = $1
      `,
      [id],
    );

    // if user with that :id is not found to update:
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: result.rows[0],
      });
    }

    // if user with :id is found to update
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error.message,
      data: error,
    });
  }
});

export default app;
