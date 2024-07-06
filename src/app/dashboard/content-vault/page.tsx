"use client";
import VaultHeader from "@/app/_components/dashboard/content-vault/vault-header";
import VaultItems from "@/app/_components/dashboard/content-vault/vault-items";

export default () => {
  return (
    <div className="flex flex-col gap-y-16">
      <VaultHeader />
      <VaultItems />
    </div>
  );
};
