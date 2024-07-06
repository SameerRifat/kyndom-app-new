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
import { ForgotPasswordSchema } from "@/lib/schemas/auth/forgot-password";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ForgotPassword = () => {
  const router = useRouter();
  const forgotPasswordMutation = api.auth.forgotPassword.useMutation();

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    const result = await forgotPasswordMutation.mutateAsync(values);
    if (result) {
      form.reset();
      // router.push("/auth/login");
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
              {forgotPasswordMutation.error && (
                <FormError>{forgotPasswordMutation.error.message}</FormError>
              )}
              {forgotPasswordMutation.isSuccess && (
                <div className="flex w-full items-center rounded-xl bg-primary p-3 text-sm text-white">
                  If an account exists with this email, you'll receive a link to
                  reset your password
                </div>
              )}
              <div className="flex flex-col gap-y-6">
                <FormField
                  control={form.control}
                  name={"email"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SecondaryInput placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                variant={"default"}
                size={"xl"}
                disabled={forgotPasswordMutation.isLoading}
                type={"submit"}
              >
                {/* Request Password Reset */}
                {forgotPasswordMutation.isLoading ? "Requesting..." : "Request Password Reset"}
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
