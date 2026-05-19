import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    // delagate DB queries into respected service module
    const result = await authService.loginUserIntoDB(req.body);

    // destructuring refresh token from the returned output from auth.service
    const { refreshToken } = result;
    // sending cookies in response just like res.status
    res.cookie("refreshToken", refreshToken, {
      secure: false, // In Production we will have to send as true
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "User login successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const authController = {
  loginUser,
};
