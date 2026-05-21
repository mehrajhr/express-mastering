import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUSerFromDB();
    // console.log(result);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Data retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const result = await userService.getSingleUserFromDB(id as string);
    if (result.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
        data: {},
      });
    }
     sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error,
    });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserInDB(req.body);
    sendResponse(res, {
      statusCode : 201,
      success : true ,
      message : "User created successfully",
      data: result.rows[0],
    })
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.updateUserInDB(id as string, req.body);
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
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserInDB(id as string);
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
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error,
    });
  }
};

export const userController = {
  getAllUser,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
