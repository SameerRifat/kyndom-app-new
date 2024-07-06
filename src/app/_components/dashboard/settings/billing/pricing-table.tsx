"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import Image from "next/image";

export default ({
  title,
  description,
  price,
  billing_interval,
  features,
  plan_id,
}: {
  title: string;
  description: string;
  price: number;
  billing_interval: string;
  features: string[];
  plan_id: string;
}) => {
  const checkoutBilling = api.billing.purchase.useMutation();

  const initCheckout = async () => {
    const result = await checkoutBilling.mutateAsync("LIFETIME_SPECIAL");
    if (result.checkout_url) window.location.href = result.checkout_url;
  };

  return (
    <div className="pricing-table-bg flex w-full flex-col gap-y-8 rounded-3xl px-6 py-9 text-white md:w-80">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="font-pjs text-sm font-medium">{description}</div>
      </div>
      <div className="flex items-center gap-x-2">
        <div className="font-elmessiri text-4xl">${price}</div>
        <div className="font-pjs text-xl text-white/50">
          /{billing_interval}
        </div>
      </div>
      <Button
        variant={"white"}
        size={"lg"}
        onClick={() => initCheckout()}
        disabled={checkoutBilling.isLoading}
      >
        Get Started
      </Button>
      <div className="flex flex-col gap-y-1">
        {features.map((feature, index) => (
          <div
            className="flex items-center gap-x-2"
            key={`plan-${plan_id}-feature-${index}`}
          >
            <Image
              src={"/img/svg/billing-tick.svg"}
              alt={"Feature Tick"}
              width={12}
              height={9}
            />
            <div className="font-pjs text-sm font-medium">{feature}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
