import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { userRole } from "../../types";

const router = Router();

router.get("/", auth(userRole.admin , userRole.agent), userController.getAllUser);
router.get("/:id", userController.getSingleUser);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
