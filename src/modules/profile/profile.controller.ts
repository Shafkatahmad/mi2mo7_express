import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async (req: Request, res: Response) => {
  try {
    // delegate the DB queries into the respected service module
    const result = await profileService.createProfileIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
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

const getAllProfileInfo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fields } = req.body;

  try {
    const result = await profileService.getProfileInfoFromDB(
      fields,
      id as string,
    );

    res.status(200).json({
      success: true,
      message: "Profile info retrived successfully",
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

export const profileController = {
  createProfile,
  getAllProfileInfo,
};
