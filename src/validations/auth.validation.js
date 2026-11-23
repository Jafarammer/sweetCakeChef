import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters!")
      .max(50, "Name cannot exceed 50 characters!"),
    email: z.string().email("Invalid email format!"),
    phoneNumber: z.string({ error: "Phone number is required!" }),
    password: z
      .string()
      .min(8, "Minimum password 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain uppercase letters, lowercase letters, numbers, and special characters.",
      ),
    confirmPassword: z.string({ error: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email format!"),
  password: z
    .string()
    .min(8, "Minimum password 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain uppercase letters, lowercase letters, numbers, and special characters.",
    ),
});

export const updatePersonalInformationSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email(),
    phoneNumber: z.string().trim().min(12).max(15),
  })
  .strict();

export const updateSecuritySchema = z
  .object({
    currentPassword: z.string({ error: "Phone number is required!" }),
    newPassword: z
      .string()
      .min(8, "Minimum password 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain uppercase letters, lowercase letters, numbers, and special characters.",
      ),
    confirmPassword: z.string({ error: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password not match",
    path: ["confirmPassword"],
  });
