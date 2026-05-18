import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";

const app: Application = express();

app.use(express.json()); //midleware
app.use(express.text()); //midleware
app.use(express.urlencoded({ extended: true })); // midleware


app.get("/", (req: Request, res: Response) => {
  // res.send("This is express servers");
  res.status(200).json({
    message: "Express server",
    Author: "Mehraj",
  });
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `);
    // console.log(result);
    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      users: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id=$1
      `,
      [id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrived successfullly",
      user: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: {},
    });
  }
});

app.post("/api/users", async (req: Request, res: Response) => {
  // console.log(req.body);
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
    INSERT INTO users (name , email , password , age) VALUES($1,$2,$3,$4) RETURNING *
    `,
      [name, email, password, age],
    );
    res.status(201).json({
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE users SET name=COALESCE($1 , name) , password=COALESCE($2 ,password) , age=COALESCE($3 ,age) , is_active=COALESCE($4, is_active) , updated_at=NOW() WHERE id=$5 RETURNING *
      `,
      [name, password, age, is_active, id],
    );
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      DELETE FROM users WHERE id=$1 
      `,
      [id],
    );
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

export default app;