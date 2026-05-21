import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );

  if (userData.rowCount === 0) {
    throw new Error("Invalid credentials!");
  }

  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid credentials!");
  }

  //   generate token
  const jwtPayLoad = {
    id: user.id,
    name: user.name,
    role : user.role,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayLoad, config.secrete as string, {
    expiresIn: "1d",
  });

  return {accessToken};
};

export const authService = {
  loginUserIntoDB,
};
