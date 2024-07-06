import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateAccountSchema } from "@/lib/schemas/settings";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UpdateAccount = () => {
  const user = api.user.me.useQuery();
  const updateAccount = api.user.updateAccount.useMutation();

  const form = useForm<z.infer<typeof UpdateAccountSchema>>({
    resolver: zodResolver(UpdateAccountSchema),
  });

  const onSubmit = async (values: z.infer<typeof UpdateAccountSchema>) => {
    const result = await updateAccount.mutateAsync(values);
  };

  useEffect(() => {
    if (!user.data) return;

    form.setValue("name", user.data.name);
    form.setValue("email", user.data.email);
  }, [user.data]);

  if (!user.data) return <Skeleton className="h-32 w-full" />;

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {updateAccount.isSuccess && (
          <div className="flex w-full items-center rounded-xl border border-primary px-4 py-2 text-sm text-primary">
            Successfuly updated account!
          </div>
        )}
        {updateAccount.error && (
          <div className="flex w-full items-center rounded-xl border border-primary px-4 py-2 text-sm text-primary">
            {updateAccount.error.message}
          </div>
        )}
        <div className="flex w-full flex-col gap-y-4 md:flex-row md:gap-x-4 md:gap-y-0">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled/>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex w-full flex-col justify-between space-y-2">
            <Label>Created At</Label>
            <Input
              value={user.data.createdAt.toLocaleString()}
              disabled={true}
            />
          </div>
        </div>
        <div className="flex">
          <Button size={"sm"} disabled={updateAccount.isLoading}>
            {updateAccount.isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateAccount;
