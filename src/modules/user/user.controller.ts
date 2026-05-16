import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  // console.log(req.body);
  // const body = req.body;
  // const { name, email, password, age } = req.body;

  // const result = await pool.query(
  //   `
  //   INSERT INTO users(name, email, password, age) VALUE($1, $2, $3, $4) RETURNING *
  //   `,
  //   [name, email, password, age],
  // );
  // // console.log(result);

  // res.status(201).json({
  //   message: "User Created Successfully",
  //   // data: body,
  //   data: result.rows[0],
  // });
  // We put this into the trycatch because we want to see the error message in a cleaner way
  try {
    const result = await userService.createUserIntoDB(req.body);
    // console.log(result);

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      // data: body,
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      // data: body,
      data: error,
    });
  }
};

export const userController = {
  createUser,
};
