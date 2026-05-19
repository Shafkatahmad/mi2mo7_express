import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connection_string: process.env.CONNECTIONSTRING as string,
  port: Number(process.env.PORT),
  secret: process.env.JWT_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET,

  access_token: process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  refresh_token: process.env
    .REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
};

export default config;
