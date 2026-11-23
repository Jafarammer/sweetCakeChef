import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authRepository from "../repositories/auth.repository.js";
import { SECRET_KEY, JWT_ACCESS_EXPIRES_IN } from "../utils/env.js";

const register = async (data) => {
  const { name, email, password, phoneNumber } = data;

  const existingUser = await authRepository.findByEmail(email);

  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const payload = await authRepository.create({
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    password: hashedPassword,
  });

  return payload;
};

const login = async (data) => {
  const { email, password } = data;

  const user = await authRepository.findByEmail(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  console.log("this", isPasswordValid);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    SECRET_KEY,
    {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    },
  );

  return {
    token,
    user: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phone_number,
    },
  };
};

const getProfile = async (userId) => {
  const profile = await authRepository.findUserProfile(userId);

  if (!profile) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return profile;
};

const updatePersonalInformation = async (userId, body) => {
  if (!body.name && !body.email && !body.phoneNumber) {
    const error = new Error("No data provided for update");
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    name: body.name,
    email: body.email,
    phoneNumber: body.phoneNumber,
  };

  return await authRepository.updatePersonalInformation(userId, payload);
};

const updateSecurity = async (userId, body) => {
  const existingUser = await authRepository.getPasswordByUserId(userId);

  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(
    body.currentPassword,
    existingUser.password,
  );

  if (!isPasswordMatch) {
    const error = new Error("Current password is incorect");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(body.newPassword, 10);

  return await authRepository.updateSecurity(userId, hashedPassword);
};

const authService = {
  register,
  login,
  getProfile,
  updatePersonalInformation,
  updateSecurity,
};

export default authService;
