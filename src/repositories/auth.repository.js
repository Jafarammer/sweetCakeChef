import userModel from "../model/user.model.js";
import databaseLogger from "../middleware/dbLogger.js";

const findByEmail = async (email) => {
  return await databaseLogger(
    () => userModel.findByEmail(email),
    "Find user by email",
  );
};

const create = async (data) => {
  return await databaseLogger(() => userModel.create(data), "User registered");
};

const findUserProfile = async (userId) => {
  return await databaseLogger(
    () => userModel.findById(userId),
    "Find user by id",
  );
};

export default {
  findByEmail,
  create,
  findUserProfile,
};
