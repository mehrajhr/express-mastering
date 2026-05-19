import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";

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
app.use("/api/profile", profileRoute);

export default app;
