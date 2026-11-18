import bcrypt from "bcrypt";
import authRepository from "../repositories/auth.repository.js";

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

const authService = {
  register,
};

export default authService;
