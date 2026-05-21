import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
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
    role: user.role,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayLoad, config.secrete as string, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(jwtPayLoad, config.refreshSecrete as string, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(
    token as string,
    config.refreshSecrete as string,
  ) as JwtPayload;

  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [decoded?.email],
  );
  const user = userData.rows[0];

  if (userData?.rowCount === 0) {
    throw new Error("User not forund!");
  }
  if (!user?.is_active) {
    throw new Error("Forbidden!");
  }

  const jwtPayLoad = {
    id: user.id,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayLoad, config.secrete as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
  generateRefreshToken,
};
