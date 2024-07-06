"use client";
import FormError from "@/app/_components/auth/form-error";
import FormHeader from "@/app/_components/auth/form-header";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationToken = searchParams.get("token") ?? "";
  const [tokenExpired, setTokenExpired] = useState(false);

  const verifyMutation = api.auth.verifyEmail.useMutation({
    onError: (error) => {
      if (error.message.includes("expired")) {
        setTokenExpired(true);
      }
    },
  });

  const resendMutation = api.auth.resendVerificationEmail.useMutation();

  useEffect(() => {
    verifyMutation.mutate(verificationToken);
  }, [verificationToken]);

  const handleResendVerification = () => {
    resendMutation.mutate({ token: verificationToken });
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col items-center gap-y-16">
        <FormHeader
          title={
            verifyMutation.isSuccess
              ? "Verified your email"
              : "Verifying your email..."
          }
          subtitle={
            verifyMutation.isSuccess
              ? "Your email was successfuly verified!"
              : "Please wait while we verify your email address"
          }
        />
        {verifyMutation.error && (
          <FormError>{verifyMutation.error.message}</FormError>
        )}
        {resendMutation.isSuccess && (
          <div className="flex w-full items-center rounded-xl bg-primary p-3 text-sm text-white">
            Verification link sent successful, please click the link sent to your
            email to verify your account
          </div>
        )}
        {tokenExpired && (
          <Button
            variant={"default"}
            size={"xl"}
            onClick={handleResendVerification}
            disabled={resendMutation.isLoading}
            className="disabled:opacity-70"
          >
            {resendMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resend Verification Link
          </Button>
        )}

        <div className="flex w-full flex-col  items-center gap-y-2">
          <Button
            variant={"default"}
            size={"xl"}
            disabled={!verifyMutation.isSuccess}
            onClick={() => router.push("/auth/login")}
          >
            <div>Continue to Login</div>
            <ArrowRightIcon size={19} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;


// "use client";
// import FormError from "@/app/_components/auth/form-error";
// import FormHeader from "@/app/_components/auth/form-header";
// import { Button } from "@/components/ui/button";
// import { api } from "@/trpc/react";
// import { ArrowRightIcon } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect } from "react";

// const VerifyEmail = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const verificationToken = searchParams.get("token") ?? "";

//   const verifyMutation = api.auth.verifyEmail.useMutation();

//   useEffect(() => {
//     verifyMutation.mutate(verificationToken);
//   }, []);

//   return (
//     <div className="flex flex-col gap-y-8">
//       <div className="flex flex-col items-center gap-y-16">
//         <FormHeader
//           title={
//             verifyMutation.isSuccess
//               ? "Verified your email"
//               : "Verifying your email..."
//           }
//           subtitle={
//             verifyMutation.isSuccess
//               ? "Your email was successfuly verified!"
//               : "Please wait while we verify your email address"
//           }
//         />
//         {verifyMutation.error && (
//           <FormError>{verifyMutation.error.message}</FormError>
//         )}
//         <div className="flex w-full flex-col  items-center gap-y-2">
//           <Button
//             variant={"default"}
//             size={"xl"}
//             disabled={!verifyMutation.isSuccess}
//             onClick={() => router.push("/auth/login")}
//           >
//             <div>Continue to Login</div>
//             <ArrowRightIcon size={19} />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;
