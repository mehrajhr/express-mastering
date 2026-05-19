import { pool } from "../../db";
import type { Iuser } from "./user.interface";

const getAllUSerFromDB = async () => {
  const result = await pool.query(`
      SELECT * FROM users
      `);

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE id=$1
      `,
    [id],
  );
  return result;
};

const createUserInDB = async (payload: Iuser) => {
  const { name, email, password, age } = payload;

  const result = await pool.query(
    `
    INSERT INTO users (name , email , password , age) VALUES($1,$2,$3,$4) RETURNING *
    `,
    [name, email, password, age],
  );

  return result;
};

const updateUserInDB = async (id: string, payload: Iuser) => {
  const { name, password, age, is_active } = payload;
  const result = await pool.query(
    `
      UPDATE users SET name=COALESCE($1 , name) , password=COALESCE($2 ,password) , age=COALESCE($3 ,age) , is_active=COALESCE($4, is_active) , updated_at=NOW() WHERE id=$5 RETURNING *
      `,
    [name, password, age, is_active, id],
  );
  return result;
};

const deleteUserInDB = async (id: string) => {
  const result = await pool.query(
    `
      DELETE FROM users WHERE id=$1 
      `,
    [id],
  );
  return result;
};

export const userService = {
  getAllUSerFromDB,
  getSingleUserFromDB,
  createUserInDB,
  updateUserInDB,
  deleteUserInDB,
};
