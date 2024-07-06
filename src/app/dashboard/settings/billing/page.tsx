"use client";
import PricingTable from "@/app/_components/dashboard/settings/billing/pricing-table";
import { readableEnum } from "@/lib/utils";
import { api } from "@/trpc/react";
import React, { useEffect } from "react";
import useStore from "store/useStore";

const BillingSettings = () => {
  const billingSubscription = api.billing.getSubscription.useQuery();
  
  const setUser = useStore((state) => state.setUser);
  const { data: user } = api.user.me.useQuery();
  
  useEffect(() => {
    if (billingSubscription.data) setUser(user);
  }, [billingSubscription.data]);
  
  if (!billingSubscription.isFetched) return null;

  if (billingSubscription.data) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex w-full flex-col gap-y-4 rounded-xl bg-white p-5 md:w-[700px]">
          <SubscriptionField title="Tariff">
            {readableEnum(billingSubscription.data.tariff)}
          </SubscriptionField>
          <SubscriptionField title="Last Payment">
            {billingSubscription.data.invoices.at(-1)
              ? `$${(
                  (billingSubscription.data.invoices.at(-1)?.total ?? 0) / 100
                ).toFixed(2)}, ${billingSubscription.data.invoices
                  .at(-1)
                  ?.createdAt.toDateString()}`
              : "Never"}
          </SubscriptionField>
          <SubscriptionField title="Next Payment">
            {billingSubscription.data.expiresAt?.toDateString() ?? "Never"}
          </SubscriptionField>
          <SubscriptionField title="Expires At">
            {billingSubscription.data.expiresAt?.toDateString() ?? "Never"}
          </SubscriptionField>
        </div>
      </div>
    );
  } else {
    return <SubscriptionOnboarding />;
  }
};

const SubscriptionField = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="font-pjs flex justify-between text-sm">
      <div className="font-semibold">{title}</div>
      <div>{children}</div>
    </div>
  );
};

const SubscriptionOnboarding = () => {
  return (
    <div className="flex w-full flex-col items-center gap-y-16 py-8">
      <div className="flex">
        <h1 className="max-w-sm text-center font-elmessiri text-4xl font-semibold leading-10">
          Our Pricing Designed For your{" "}
          <span className="text-primary">Business</span>
        </h1>
      </div>
      <div className="flex">
        <PricingTable
          plan_id={"LIFETIME_SPECIAL"}
          title={"Lifetime"}
          description={"A limited, exclusive plan for launch"}
          price={99}
          billing_interval={"lifetime"}
          features={[
            "Content Calendar",
            "Unique Social Media Templates",
            "Lifetime Access",
          ]}
        />
      </div>
    </div>
  );
};

export default BillingSettings;
