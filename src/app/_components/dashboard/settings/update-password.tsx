import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdatePasswordSchema } from "@/lib/schemas/settings";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UpdatePassword = () => {
  const updatePassword = api.user.updatePassword.useMutation();

  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_new_password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdatePasswordSchema>) => {
    try {
      const result = await updatePassword.mutateAsync(values);
      if(result) {
        form.reset();
      }
    } catch (error) {
      console.error('Update password failed:', error);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {updatePassword.isSuccess && (
          <div className="flex w-full items-center rounded-xl border border-primary px-4 py-2 text-sm text-primary">
            Successfuly updated password!
          </div>
        )}
        {updatePassword.error && (
          <div className="flex w-full items-center rounded-xl border border-primary px-4 py-2 text-sm text-primary">
            {updatePassword.error.message}
          </div>
        )}
        <div className="flex w-full flex-col gap-y-4 md:flex-row md:gap-x-4 md:gap-y-0">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_new_password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Confirm Current Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex">
          {/* <Button disabled={updatePassword.isLoading} size={"sm"} type="submit" onClick={() => console.log('clicked')}>
            Update Password
          </Button> */}
          <Button
            variant={"default"}
            size={"sm"}
            disabled={updatePassword.isLoading}
            type={"submit"}
          >
            {updatePassword.isLoading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdatePassword;
