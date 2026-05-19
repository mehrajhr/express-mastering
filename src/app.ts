import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";

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

app.use("/api/users", userRoute);










export default app;