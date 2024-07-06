import { env } from "@/env";
import { sendEmail } from "@/lib/email";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@/lib/schemas/auth/forgot-password";
import { OnboardingSchema, RegisterSchema } from "@/lib/schemas/auth/register";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getServerAuthSession } from "@/server/auth";

export default createTRPCRouter({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const emailExists = await ctx.db.user.findFirst({
        where: { email: input.email },
      });
      if (emailExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This email address is already in use!",
        });

      const passwordHash = await bcrypt.hash(input.password, 10);

      const token = crypto.randomUUID();

      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: passwordHash,
          EmailVerificationToken: {
            create: {
              type: "EMAIL_VERIFICATION",
              token,
            },
          },
        },
      });

      const verificationLink = `${env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
      // await sendEmail(
      //   input.email,
      //   "Kyndom: Verify your email address",
      //   `Welcome to Kyndom!<br />Please verify your email address using the link below<br /><br /><a href="${verificationLink}">${verificationLink}</a>`,
      // );

      const { data, error } = await sendEmail({ email: input.email, verificationLink, emailText: 'Please verify your email address using the button below', preview: 'Verify your email address', subject: 'Email varification', btnText: 'Verify Email' });

      if (error) {
        throw new Error("Failed to send request");
      }

      return true;
    }),
  verifyEmail: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const verificationToken = await ctx.db.emailVerificationToken.findFirst({
        where: {
          AND: [
            { token: input },
            { type: "EMAIL_VERIFICATION" },
            { expired: false },
            { createdAt: { gte: new Date(new Date().getTime() - 1.21e9) } }, //expire after 14 days
          ],
        },
      });
      if (!verificationToken)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This verification token has expired!",
        });

      await ctx.db.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: {
          expired: true,
        },
      });

      await ctx.db.user.update({
        where: { id: verificationToken.userId },
        data: {
          emailVerified: new Date(),
        },
      });

      return true;
    }),

  resendVerificationEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingToken = await ctx.db.emailVerificationToken.findFirst({
        where: { token: input.token },
        include: { user: true },
      });

      if (!existingToken) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Token not found",
        });
      }

      // Invalidate existing tokens for the user
      await ctx.db.emailVerificationToken.updateMany({
        where: {
          userId: existingToken.userId,
          type: "EMAIL_VERIFICATION",
          expired: false,
        },
        data: { expired: true },
      });

      const newToken = crypto.randomUUID();
      await ctx.db.emailVerificationToken.create({
        data: {
          type: "EMAIL_VERIFICATION",
          token: newToken,
          userId: existingToken.userId,
        },
      });

      const verificationLink = `${env.NEXTAUTH_URL}/auth/verify-email?token=${newToken}`;
      const { data, error } = await sendEmail({
        email: existingToken.user.email,
        verificationLink,
        emailText: 'Please verify your email address using the button below',
        preview: 'Verify your email address',
        subject: 'Email verification',
        btnText: 'Verify Email',
      });

      if (error) {
        throw new Error("Failed to send request");
      }

      return true;
    }),

  forgotPassword: publicProcedure
    .input(ForgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { email: input.email },
      });
      if (!user) return true; //if the user doesn't exist, return the success message anyway

      const verificationToken = await ctx.db.emailVerificationToken.create({
        data: {
          type: "FORGOT_PASSWORD",
          token: crypto.randomUUID(),
          userId: user.id,
        },
      });

      const verificationLink = `${env.NEXTAUTH_URL}/auth/reset-password?token=${verificationToken.token}`;
      // await sendEmail(
      //   input.email,
      //   "Kyndom: Reset your password",
      //   `Kyndom Password Reset Request<br />Use the link below to reset your password, if you didn't request this link you can safely disregard this email<br /><br /><a href="${verificationLink}">${verificationLink}</a>`,
      // );
      const { data, error } = await sendEmail({ email: input.email, verificationLink, emailText: "Use the link below to reset your password, if you didn't request this link you can safely disregard this email", preview: 'Kyndom Password Reset Request', subject: 'Reset Password', btnText: 'Reset Password' });

      return true;
    }),
  resetPassword: publicProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const verificationToken = await ctx.db.emailVerificationToken.findFirst({
        where: {
          AND: [
            { token: input.verification_token },
            { type: "FORGOT_PASSWORD" },
            { expired: false },
            { createdAt: { gte: new Date(new Date().getTime() - 3.6e6) } }, //expire after 1 hour
          ],
        },
      });
      if (!verificationToken)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This verification token has expired!",
        });

      const passwordHash = await bcrypt.hash(input.password, 10);

      await ctx.db.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: {
          expired: true,
        },
      });

      await ctx.db.user.update({
        where: { id: verificationToken.userId },
        data: {
          password: passwordHash,
        },
      });

      return true;
    }),

  addOnboarding: publicProcedure
    .input(OnboardingSchema)
    .mutation(async ({ ctx, input }) => {
      // const session = await getServerAuthSession();
      // if (!session?.user.id) return false
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session?.user.id },
      });
      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This user doesn't exist!",
        });

      const updatedUser = await ctx.db.user.update({
        where: { id: ctx.session?.user.id },
        data: {
          onboardedName: input.onboardedName,
          livesIn: input.livesIn,
          buyerOrSellerAgent: input.buyerOrSellerAgent,
          teamOrSoloAgent: input.teamOrSoloAgent,
          brokerageName: input.brokerageName,
          goal: input.goal,
          usingSocialMediaToGenerateLeads: input.usingSocialMediaToGenerateLeads,
          onboarded: true,
        },
      });

      return true;
    }),
});


// import { env } from "@/env";
// import { sendEmail } from "@/lib/email";
// import {
//   ForgotPasswordSchema,
//   ResetPasswordSchema,
// } from "@/lib/schemas/auth/forgot-password";
// import { RegisterSchema } from "@/lib/schemas/auth/register";
// import { TRPCError } from "@trpc/server";
// import bcrypt from "bcrypt";
// import { z } from "zod";
// import { createTRPCRouter, publicProcedure } from "../trpc";

// export default createTRPCRouter({
//   register: publicProcedure
//     .input(RegisterSchema)
//     .mutation(async ({ ctx, input }) => {
//       const emailExists = await ctx.db.user.findFirst({
//         where: { email: input.email },
//       });
//       if (emailExists)
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: "This email address is already in use!",
//         });

//       const passwordHash = await bcrypt.hash(input.password, 10);

//       const token = crypto.randomUUID();

//       const user = await ctx.db.user.create({
//         data: {
//           name: input.name,
//           email: input.email,
//           password: passwordHash,
//           EmailVerificationToken: {
//             create: {
//               type: "EMAIL_VERIFICATION",
//               token,
//             },
//           },
//         },
//       });

//       const verificationLink = `${env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
//       // await sendEmail(
//       //   input.email,
//       //   "Kyndom: Verify your email address",
//       //   `Welcome to Kyndom!<br />Please verify your email address using the link below<br /><br /><a href="${verificationLink}">${verificationLink}</a>`,
//       // );

//       const { data, error } = await sendEmail({ email: input.email, verificationLink, emailText: 'Please verify your email address using the button below', preview: 'Verify your email address', subject: 'Email varification', btnText: 'Verify Email' });

//       if (error) {
//         throw new Error("Failed to send request");
//       }

//       return true;
//     }),
//   verifyEmail: publicProcedure
//     .input(z.string())
//     .mutation(async ({ ctx, input }) => {
//       const verificationToken = await ctx.db.emailVerificationToken.findFirst({
//         where: {
//           AND: [
//             { token: input },
//             { type: "EMAIL_VERIFICATION" },
//             { expired: false },
//             { createdAt: { gte: new Date(new Date().getTime() - 1.21e9) } }, //expire after 14 days
//           ],
//         },
//       });
//       if (!verificationToken)
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "This verification token has expired!",
//         });

//       await ctx.db.emailVerificationToken.update({
//         where: { id: verificationToken.id },
//         data: {
//           expired: true,
//         },
//       });

//       await ctx.db.user.update({
//         where: { id: verificationToken.userId },
//         data: {
//           emailVerified: new Date(),
//         },
//       });

//       return true;
//     }),
//   forgotPassword: publicProcedure
//     .input(ForgotPasswordSchema)
//     .mutation(async ({ ctx, input }) => {
//       const user = await ctx.db.user.findFirst({
//         where: { email: input.email },
//       });
//       if (!user) return true; //if the user doesn't exist, return the success message anyway

//       const verificationToken = await ctx.db.emailVerificationToken.create({
//         data: {
//           type: "FORGOT_PASSWORD",
//           token: crypto.randomUUID(),
//           userId: user.id,
//         },
//       });

//       const verificationLink = `${env.NEXTAUTH_URL}/auth/reset-password?token=${verificationToken.token}`;
//       // await sendEmail(
//       //   input.email,
//       //   "Kyndom: Reset your password",
//       //   `Kyndom Password Reset Request<br />Use the link below to reset your password, if you didn't request this link you can safely disregard this email<br /><br /><a href="${verificationLink}">${verificationLink}</a>`,
//       // );
//       const { data, error } = await sendEmail({ email: input.email, verificationLink, emailText: "Use the link below to reset your password, if you didn't request this link you can safely disregard this email", preview: 'Kyndom Password Reset Request', subject: 'Reset Password', btnText: 'Reset Password' });

//       return true;
//     }),
//   resetPassword: publicProcedure
//     .input(ResetPasswordSchema)
//     .mutation(async ({ ctx, input }) => {
//       const verificationToken = await ctx.db.emailVerificationToken.findFirst({
//         where: {
//           AND: [
//             { token: input.verification_token },
//             { type: "FORGOT_PASSWORD" },
//             { expired: false },
//             { createdAt: { gte: new Date(new Date().getTime() - 3.6e6) } }, //expire after 1 hour
//           ],
//         },
//       });
//       if (!verificationToken)
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "This verification token has expired!",
//         });

//       const passwordHash = await bcrypt.hash(input.password, 10);

//       await ctx.db.emailVerificationToken.update({
//         where: { id: verificationToken.id },
//         data: {
//           expired: true,
//         },
//       });

//       await ctx.db.user.update({
//         where: { id: verificationToken.userId },
//         data: {
//           password: passwordHash,
//         },
//       });

//       return true;
//     }),
// });
