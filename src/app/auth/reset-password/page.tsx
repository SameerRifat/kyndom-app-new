"use client";
import FormChoice from "@/app/_components/auth/form-choice";
import FormError from "@/app/_components/auth/form-error";
import FormHeader from "@/app/_components/auth/form-header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SecondaryInput } from "@/components/ui/input";
import { ResetPasswordSchema } from "@/lib/schemas/auth/forgot-password";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const ForgotPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationToken = searchParams.get("token") ?? "";
  const resetPasswordMutation = api.auth.resetPassword.useMutation();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      verification_token: verificationToken,
      password: '',
      confirm_password: ''
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    const result = await resetPasswordMutation.mutateAsync(values);
    if (result) {
      form.reset();
      toast.success("Password reset successfully. Please log in with your new password.", {
        autoClose: 3000,
      });
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col items-center gap-y-16">
        <FormHeader
          title={"Forgot Password"}
          subtitle={"Enter your email below to reset your password"}
        />
        <div className="flex w-full flex-col gap-y-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-8"
            >
              {resetPasswordMutation.error && (
                <FormError>{resetPasswordMutation.error.message}</FormError>
              )}
              <div className="flex flex-col gap-y-6">
                <FormField
                  control={form.control}
                  name={"password"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SecondaryInput
                          placeholder="New Password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={"confirm_password"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SecondaryInput
                          placeholder="Confirm New Password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                variant={"default"}
                size={"xl"}
                disabled={resetPasswordMutation.isLoading}
                type={"submit"}
              >
                {resetPasswordMutation.isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <FormChoice />
      <div className="flex w-full justify-center gap-x-1 text-center">
        Remember your password?{" "}
        <div
          className="div-cursor font-semibold"
          onClick={() => router.push("/auth/login")}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
