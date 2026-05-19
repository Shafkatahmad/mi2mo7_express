import { pool } from "../../db";
import bcrypt from "bcrypt";
import jwt, { type DecodeOptions, type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  // 1. Check if the user exists --> done
  // 2. Compare the password --> done
  // 3. Generate Token --> done

  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );

  // if user doesn't exist
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }
  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);
  console.log(matchPassword);

  // Comparing the password
  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  // Generate Token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(jwtPayload, config.refresh_secret as string, {
    expiresIn: "10d",
  });

  return { accessToken, refreshToken };
};

const generateFreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.decode(
    token as string,
    config.refresh_secret as DecodeOptions,
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

  if (userData.rows.length === 0) {
    throw new Error("User not found.");
  }

  if (!user?.is_active) {
    throw new Error("Forbidden!");
  }

  // Generate Token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
  generateFreshToken,
};
