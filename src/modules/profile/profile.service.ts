import { pool } from "../../db";
import type { IProfile } from "./profile.interface";

const allowedFields: (keyof IProfile)[] = ["bio", "address", "phone", "gender"];

const createProfileIntoDB = async (payload: IProfile) => {
  // console.log(payload);
  const { user_id, bio, address, phone, gender } = payload;

  // First check if the user exists
  const user = await pool.query(
    `
    SELECT * FROM users WHERE id = $1
    `,
    [user_id],
  );
  console.log(user);
  if (user.rows.length === 0) {
    throw new Error("User does not exists!");
  }

  const result = await pool.query(
    `
    INSERT INTO profiles(user_id, bio, address, phone, gender) VALUES($1,$2,$3,$4,$5) RETURNING *
    `,
    [user_id, bio, address, phone, gender],
  );

  return result;
};

const getAllProfileInfoFromDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM profiles
    WHERE user_id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) throw new Error("User not found");
  return result;
};

const getProfileInfoFromDB = async (
  payload: (keyof IProfile)[],
  id: string,
) => {
  // const validFields = payload.filter((field) => allowedFields.includes(field));
  const validFields = payload.filter((field) => allowedFields.includes(field));

  if (validFields.length === 0) throw new Error("No valid fields requested");

  const result = await pool.query(
    `
    SELECT ${validFields.join(", ")}
    FROM profiles
    WHERE id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) throw new Error("User not found");

  return result;
};

const updateProfileInfoIntoDB = async (payload: IProfile, id: string) => {
  // const validFields = payload.filter((field) => allowedFields.includes(field));

  // if (validFields.length === 0) throw new Error("No valid fields requested");

  const { bio, address, phone, gender } = payload;

  const result = await pool.query(
    `
    UPDATE profiles
    SET
    bio =COALESCE($1, bio),
    address =COALESCE($2, address),
    phone = COALESCE($3, phone),
    gender = COALESCE($4, gender)

    WHERE id = $5 RETURNING *
    `,
    [bio, address, phone, gender, id],
  );

  return result;
};

const deleteProfileFromDB = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM profiles WHERE id = $1
    `,
    [id],
  );

  return result;
};

export const profileService = {
  createProfileIntoDB,
  getAllProfileInfoFromDB,
  getProfileInfoFromDB,
  updateProfileInfoIntoDB,
  deleteProfileFromDB,
};
