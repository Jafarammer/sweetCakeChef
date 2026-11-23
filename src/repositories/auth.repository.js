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

const updatePersonalInformation = async (userId, payload) => {
  const existingUser = await findUserProfile(userId);

  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedPayload = {};

  if (payload.name !== existingUser.name) {
    updatedPayload.name = payload.name;
  }

  if (payload.email !== existingUser.email) {
    updatedPayload.email = payload.email;
  }

  if (payload.phoneNumber !== existingUser.phone_number) {
    updatedPayload.phoneNumber = payload.phoneNumber;
  }

  if (Object.keys(updatedPayload).length === 0) {
    return {
      name: existingUser.name,
      email: existingUser.email,
      phoneNumber: existingUser.phone_number,
    };
  }

  if (updatedPayload.email) {
    const emailExist = await findByEmail(updatedPayload.email);

    if (emailExist) {
      const error = new Error("Email already registered");
      error.statusCode = 409;
      throw error;
    }
  }

  return await userModel.updatePersonalInformation(userId, updatedPayload);
};

const getPasswordByUserId = async (userId) => {
  return await databaseLogger(
    () => userModel.getPasswordByUserId(userId),
    "Fetch password by id",
  );
};

const updateSecurity = async (userId, payload) => {
  return await databaseLogger(
    () => userModel.updateSecurity(userId, payload),
    "Update password",
  );
};

export default {
  findByEmail,
  create,
  findUserProfile,
  updatePersonalInformation,
  getPasswordByUserId,
  updateSecurity,
};
