"use client";
import UpdateAccount from "@/app/_components/dashboard/settings/update-account";
import UpdatePassword from "@/app/_components/dashboard/settings/update-password";
import UpdateProfileImage from "@/app/_components/dashboard/settings/update-profile-image";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const AccountPage = () => {
  const router = useRouter()
  return (
    <>
      <div className="flex w-full flex-col gap-y-8 rounded-xl bg-white p-8 ">
        <UpdateProfileImage />
        <UpdateAccount />
        <UpdatePassword />
      </div>
      <Button
        variant={"default"}
        size={"sm"}
        type={"submit"}
        className="mt-5 bg-orange hover:bg-orange hover:shadow-md"
        onClick={() => router.push('/auth/logout')}
      >
        Logout <LogOut size="20px" className="ml-1"/>
      </Button>
    </>
  );
};

export default AccountPage;
