import authService from "../service/auth.service.js";
import { logging } from "../app/logging.js";

const register = async (req, res) => {
  try {
    await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "Register successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Internal server error",
    });
  }
};

const authController = {
  register,
  login,
};

export default authController;
