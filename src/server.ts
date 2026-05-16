import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();
const port = 5000;

app.use(express.json()); //midleware
app.use(express.text()); //midleware
app.use(express.urlencoded({ extended: true })); // midleware

const pool = new Pool({
  connectionString: `postgresql://neondb_owner:${process.env.CONNECTION_STRING_PASS}@ep-super-shadow-appicnbf-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(25) NOT NULL,
      email VARCHAR(25) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

initDB();

app.get("/", (req: Request, res: Response) => {
  // res.send("This is express servers");
  res.status(200).json({
    message: "Express server",
    Author: "Mehraj",
  });
});

app.post("/user", async (req: Request, res: Response) => {
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
