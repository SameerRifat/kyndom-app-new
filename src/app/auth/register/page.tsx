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
import { RegisterSchema } from "@/lib/schemas/auth/register";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RegisterPage = () => {
  const router = useRouter();
  const registerMutation = api.auth.register.useMutation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: ''
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    const result = await registerMutation.mutateAsync(values);
    if (result) {
      form.reset();
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col items-center gap-y-16">
        <FormHeader
          title={"Welcome to Kyndom!"}
          subtitle={"Enter the details below to get started"}
        />
        <div className="flex w-full flex-col gap-y-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-8"
            >
              {registerMutation.error && (
                <FormError>{registerMutation.error.message}</FormError>
              )}
              {registerMutation.isSuccess && (
                <div className="flex w-full items-center rounded-xl bg-primary p-3 text-sm text-white">
                  Registration successful, please click the link sent to your
                  email to verify your account
                </div>
              )}
              <div className="flex flex-col gap-y-6">
                <FormField
                  control={form.control}
                  name={"name"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SecondaryInput placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name={"password"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SecondaryInput
                          placeholder="Password"
                          type={"password"}
                          {...field}
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
                          placeholder="Confirm Password"
                          type={"password"}
                          {...field}
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
                disabled={registerMutation.isLoading}
                type={"submit"}
              >
                {registerMutation.isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="flex w-full justify-center gap-x-1 text-center">
        Already have an account?{" "}
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

export default RegisterPage;
