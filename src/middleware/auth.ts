import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized auccess!",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.secrete as string,
      ) as JwtPayload;

      const userData = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [decoded?.email],
      );
      const user = userData.rows[0];

      if (userData.rowCount === 0) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      if (!user.is_active) {
        res.status(403).json({
          success: false,
          message: "Forbidden!",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };
};

export default auth;
