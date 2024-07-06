import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string()
        .email({ message: "You must enter a valid email address!" })
        .max(256, { message: "Your email address can't be longer than 256 characters!" }),
    password: z.string()
        .min(8, { message: "Your password must be atleast 8 characters long!" })
        .max(256, { message: "Your password can't be longer than 256 characters!" })
});