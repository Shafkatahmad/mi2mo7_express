import type { NextFunction, Request, Response } from "express";
import jwt, { decode, type DecodeOptions, type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";
const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log("This is Protected Route");
      // console.log(req.headers.authorization);

      /**
       * 1. Check if the token exist
       * 2. Verify the token
       * 3. Find the user into the database
       * 4. verify if the user is active or not
       */

      // Auth Guard by taking the access token from request header.
      const token = req.headers.authorization;

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized access!",
        });
      }

      const decoded = jwt.decode(
        token as string,
        config.secret as DecodeOptions,
      ) as JwtPayload;
      // console.log(decoded);

      const userData = await pool.query(
        `
      SELECT * FROM users WHERE email = $1
      `,
        [decoded.email],
      );
      // console.log(userData);

      const user = userData.rows[0];
      // console.log(user);

      // Auth Guard Validation
      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.is_active) {
        res.status(403).json({
          success: false,
          message: "Forbidden! User is not active.",
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
