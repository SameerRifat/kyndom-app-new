import Link from "next/link";
import React from "react";

const DashboardHomeFooter = () => {
  return (
    <div className="flex justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-y-2 rounded-2xl rounded-b-none border-t border-solid bg-white py-3">
        <div className="flex flex-wrap gap-x-3 w-[90%] ml-auto mr-auto justify-center">
          <FooterNavLink href="https://kyndom.com">Get Support</FooterNavLink>
          <FooterNavLink href="/dashboard/terms-and-conditions">
            Terms and Conditions
          </FooterNavLink>
          <FooterNavLink href="/dashboard/privacy-policy">
            Privacy Policy
          </FooterNavLink>
        </div>
        <div className="text-sm font-semibold">
          {new Date().getFullYear()} &copy; Kyndom
        </div>
      </div>
    </div>
  );
};

const FooterNavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link className="text-sm hover:text-primary text-center" href={href}>
      {children}
    </Link>
  );
};

export default DashboardHomeFooter;
