import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000/",
  }),
); // define which origin only access this server

app.use(cookieParser()); //middlewar
app.use(express.json()); //midleware
app.use(express.text()); //midleware
app.use(express.urlencoded({ extended: true })); // midleware
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  // res.send("This is express servers");
  res.status(200).json({
    message: "Express server",
    Author: "Mehraj",
  });
});

app.use("/api/users", userRoute); //api for users route
app.use("/api/profile", profileRoute); // for profiles route
app.use("/api/auth", authRoute); // for authentication

app.use(globalErrorHandler); //global error handler
export default app;
