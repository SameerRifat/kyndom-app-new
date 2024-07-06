"use client";
import FormChoice from "@/app/_components/auth/form-choice";
import FormError from "@/app/_components/auth/form-error";
import FormHeader from "@/app/_components/auth/form-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SecondaryInput } from "@/components/ui/input";
import { LoginSchema } from "@/lib/schemas/auth/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const LoginPage = () => {
  const [error, setError] = useState<string | null>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      setIsLoading(true)
      const result = await signIn("credentials", {
        ...values,
        redirect: false,
      });
      if (result?.ok) {
        setIsSuccess(true)
        router.push("/dashboard/home");
      } else if (result?.error) {
        setError(result?.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col items-center gap-y-16">
          <FormHeader
            title={"Welcome back"}
            subtitle={"Welcome back! Please enter your details."}
          />
          <div className="flex w-full flex-col gap-y-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-8"
              >
                {error && <FormError>{error}</FormError>}
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
                  <div className="flex w-full justify-between text-xs font-medium">
                    <div className="flex gap-x-2">
                      <Checkbox checked={true} />
                      <div>Remember Me</div>
                    </div>
                    <Link className="div-cursor" href="/auth/forgot-password">
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <Button
                  variant={"default"}
                  size={"xl"}
                  type={"submit"}
                  disabled={isLoading || isSuccess}
                >
                  {(isLoading || isSuccess) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="flex w-full justify-center gap-x-1 text-center">
          Don&apos;t have an account?{" "}
          <Link className="div-cursor font-semibold" href="/auth/register">
            Register
          </Link>
        </div>
      </div>
      
    </>
  );
};

export default LoginPage;
