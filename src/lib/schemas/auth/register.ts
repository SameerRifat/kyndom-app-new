import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Your name must be atleast 3 characters long!" })
      .max(128, { message: "Your name can't be longer than 128 characters!" }),
    email: z
      .string()
      .email({ message: "You must enter a valid email address!" })
      .max(256, {
        message: "Your email address can't be longer than 256 characters!",
      }),
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
    path: ["confirm_password"],
  });


export const OnboardingSchema = z
.object({

  onboardedName: z
    .string()
    .min(3, { message: "Your name must be atleast 3 characters long!" })
    .max(128, { message: "Your name can't be longer than 128 characters!" }),
  
  livesIn: z
    .string()
    .min(3, { message: "Your city name must be atleast 3 characters long!" })
    .max(300, { message: "Your city name can't be longer than 300 characters!" }),
  
  buyerOrSellerAgent: z
    .string(),
  teamOrSoloAgent: z
    .string(),

  brokerageName: z
    .string()
    .min(3, { message: "Your brokerage name must be atleast 3 characters long!" })
    .max(500, { message: "Your brokerage name can't be longer than 500 characters!" }),
  
  goal: z
    .string()
    .min(3, { message: "Your goal must be atleast 3 characters long!" })
    .max(500, { message: "Your goal can't be longer than 500 characters!" }),
  
  usingSocialMediaToGenerateLeads: z
    .string(),
  
})