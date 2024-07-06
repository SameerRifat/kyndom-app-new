import { z } from "zod";

export const UpdatePasswordSchema = z
  .object({
    current_password: z.string(),
    new_password: z.string(),
    confirm_new_password: z.string(),
  })
  .refine((values) => values.new_password === values.confirm_new_password, {
    message: "Password confirmation doesn't match",
    path: ["confirm_new_password"],
  });

export const UpdateAccountSchema = z.object({
  name: z.string(),
  email: z.string(),
});
