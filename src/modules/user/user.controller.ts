import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

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

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Created Successfully",
      // data: body,
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      // data: body,
      error: error,
    });
  }
};

// GET all users from db
const getAllUsers = async (req: Request, res: Response) => {
  console.log("Controller", req.user);
  try {
    // separated the DB query into the user.service module
    const result = await userService.getAllUsersFromDB();

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
};

// GET single user by id from db
const getSingleUser = async (req: Request, res: Response) => {
  // const id = req.params;
  // const id = req.params.id;
  const { id } = req.params;

  try {
    // separated the DB query into the user.service module
    const result = await userService.getSingleUserFromDB(id as string);

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
};

// Update user by PUT methon in db
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  // console.log("ID: ", id);
  // console.log({ name, password, age, id_active });

  try {
    // separated the DB query into the user.service module
    const result = await userService.updateUserIntoDB(req.body, id as string);

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
      success: false,
      message: error.message,
      data: error,
    });
  }
};

// Delete user by DELETE method from db
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // separated the DB query into the user.service module
    const result = await userService.deleteUserFromDB(id as string);

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
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
