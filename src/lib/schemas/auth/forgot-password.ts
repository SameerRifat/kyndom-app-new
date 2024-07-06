import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const ResetPasswordSchema = z
  .object({
    verification_token: z.string(),
    password: z
      .string()
      .min(8, { message: "Your password must be atleast 8 characters long!" })
      .max(256, {
        message: "Your password can't be longer than 256 characters!",
      }),
    confirm_password: z
      .string()
      .min(8, { message: "Your password must be atleast 8 characters long!" })
      .max(256, {
        message: "Your password can't be longer than 256 characters!",
      }),
  })
  .refine((form) => form.password === form.confirm_password, {
    message: "Passwords do not match",
    path: ["password"],
  });
