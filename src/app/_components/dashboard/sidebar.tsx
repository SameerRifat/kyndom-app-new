"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Permission } from "@/lib/types/permissions";
import { api } from "@/trpc/react";
import { FileSearchIcon, MenuIcon, UserIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import useStore from "store/useStore";

type SidebarOption = {
  icon: React.ReactNode;
  title: string;
  href: string;
  permission?: Permission;
  disabled?: boolean;
  activeUrlKey?: string;
};

type SidebarSection = {
  title?: string;
  permission?: Permission;
  options: SidebarOption[];
};

const SidebarSections = [
  {
    options: [
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 18V15"
              stroke="#0C6E4F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.07 2.82L3.14002 8.37C2.36002 8.99 1.86002 10.3 2.03002 11.28L3.36002 19.24C3.60002 20.66 4.96002 21.81 6.40002 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.99 20.86 8.37L13.93 2.83C12.86 1.97 11.13 1.97 10.07 2.82Z"
              stroke="#0C6E4F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Dashboard",
        href: "/dashboard/home",
      },
      {
        permission: Permission.ACTIVE_SUBSCRIPTION,
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2V5"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 2V5"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.5 9.09H20.5"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.9955 13.7H12.0045"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.29431 13.7H8.30329"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.29431 16.7H8.30329"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Content Calendar",
        href: "/dashboard/content-calendar",
      },
      {
        permission: Permission.ACTIVE_SUBSCRIPTION,
        icon: <FileSearchIcon />,
        title: "Content Vault",
        href: "/dashboard/content-vault",
        activeUrlKey: "contentVault",
      },
      {
        permission: Permission.ACTIVE_SUBSCRIPTION,
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Favourites",
        href: "/dashboard/favourites",
      },
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Settings",
        href: "/dashboard/settings",
      },
    ],
  },
  {
    permission: Permission.ACTIVE_SUBSCRIPTION,
    title: "Resources",
    options: [
      //IMAGE BASED CONTENT
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 8.25C8 9.25 9.63 9.25 10.64 8.25"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.3601 8.25C14.3601 9.25 15.9901 9.25 17.0001 8.25"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.4 13H15.6C16.1 13 16.5 13.4 16.5 13.9C16.5 16.39 14.49 18.4 12 18.4C9.51 18.4 7.5 16.39 7.5 13.9C7.5 13.4 7.9 13 8.4 13Z"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Social Media",
        href: "/dashboard/social/content/social_media",
        activeUrlKey: "socialMedia",
      },
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.0399 3.02001L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L20.9799 7.96001C22.3399 6.60001 22.9799 5.02001 20.9799 3.02001C18.9799 1.02001 17.3999 1.66001 16.0399 3.02001Z"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.9099 4.14999C15.5799 6.53999 17.4499 8.40999 19.8499 9.08999"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Story Templates",
        href: "/dashboard/social/content/story_templates",
        activeUrlKey: "storyTemplates",
      },
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.25 7H16.75V5C16.75 3 16 2 13.75 2H10.25C8 2 7.25 3 7.25 5V7Z"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 15V19C16 21 15 22 13 22H11C9 22 8 21 8 19V15H16Z"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 10V15C21 17 20 18 18 18H16V15H8V18H6C4 18 3 17 3 15V10C3 8 4 7 6 7H18C20 7 21 8 21 10Z"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 15H15.79H7"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 11H10"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Printable",
        href: "/dashboard/social/content/printable",
        activeUrlKey: "printable",
      },
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Email",
        href: "/dashboard/social/content/email",
      },
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15C15.7279 15 18.75 12.0899 18.75 8.5C18.75 4.91015 15.7279 2 12 2C8.27208 2 5.25 4.91015 5.25 8.5C5.25 12.0899 8.27208 15 12 15Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.51999 13.52L7.51001 20.9C7.51001 21.8 8.14001 22.24 8.92001 21.87L11.6 20.6C11.82 20.49 12.19 20.49 12.41 20.6L15.1 21.87C15.87 22.23 16.51 21.8 16.51 20.9V13.34"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Branding",
        href: "/dashboard/social/content/branding",
      },

      //TEXT BASED CONTENT
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.6599 10.44L20.6799 14.62C19.8399 18.23 18.1799 19.69 15.0599 19.39C14.5599 19.35 14.0199 19.26 13.4399 19.12L11.7599 18.72C7.58994 17.73 6.29994 15.67 7.27994 11.49L8.25994 7.30001C8.45994 6.45001 8.69994 5.71001 8.99994 5.10001C10.1699 2.68001 12.1599 2.03001 15.4999 2.82001L17.1699 3.21001C21.3599 4.19001 22.6399 6.26001 21.6599 10.44Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.0601 19.39C14.4401 19.81 13.6601 20.16 12.7101 20.47L11.1301 20.99C7.1601 22.27 5.0701 21.2 3.7801 17.23L2.5001 13.28C1.2201 9.31001 2.2801 7.21001 6.2501 5.93001L7.8301 5.41001C8.2401 5.28001 8.6301 5.17001 9.0001 5.10001C8.7001 5.71001 8.4601 6.45001 8.2601 7.30001L7.2801 11.49C6.3001 15.67 7.5901 17.73 11.7601 18.72L13.4401 19.12C14.0201 19.26 14.5601 19.35 15.0601 19.39Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.6399 8.53L17.4899 9.76"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.6599 12.4L14.5599 13.14"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Story Ideas",
        href: "/dashboard/social/text/story_ideas",
      },
      {
        icon: (
          <svg
            width="18"
            height="22"
            viewBox="0 0 18 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 6V16C17 20 16 21 12 21H6C2 21 1 20 1 16V6C1 2 2 1 6 1H12C16 1 17 2 17 6Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 4.5H7"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.99995 18.1C9.85599 18.1 10.55 17.406 10.55 16.55C10.55 15.694 9.85599 15 8.99995 15C8.14391 15 7.44995 15.694 7.44995 16.55C7.44995 17.406 8.14391 18.1 8.99995 18.1Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: "Reels Ideas",
        href: "/dashboard/social/text/reels_ideas",
      },
    ],
  },
] as SidebarSection[];

export const SidebarSeperator = () => {
  return (
    <div className="flex w-full px-3">
      <div className="h-px w-full bg-white/[0.12]" />
    </div>
  );
};

const SidebarOption = ({
  sectionPermission,
  permissions,
  option,
  setMobileNavExpanded,
}: {
  sectionPermission?: Permission;
  permissions: Permission[];
  option: SidebarOption;
  setMobileNavExpanded: (state: boolean) => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const proDisabled =
    (option.permission && !permissions.includes(option.permission)) ||
    (sectionPermission && !permissions.includes(sectionPermission));

  const searchParams = useSearchParams();
  const sidebarKey = searchParams.get("sidebarKey");

  const isActive =
    pathname.includes(option.href) ||
    (option.activeUrlKey && sidebarKey === option.activeUrlKey);

  useEffect(() => {
    router.prefetch(option.href);
  }, []);

  return (
    <div
      className={`flex h-12 w-full select-none items-center justify-between gap-x-4 rounded-xl px-6 text-sm cursor-pointer ${isActive ? "bg-white text-primary" : "bg-transparent text-white hover:bg-white/[0.12]"}`}
      onClick={() => {
        if (proDisabled) {
          router.push("/dashboard/settings/billing")
        } else {
          router.push(option.href);
        };
        setMobileNavExpanded(false);
      }}
    >
      <div className="flex items-center gap-x-4">
        <div
          className={`flex w-5 justify-center ${isActive ? "sidebar-option-active-icon" : "sidebar-option-inactive-icon"}`}
        >
          {option.icon}
        </div>
        <div className="truncate">{option.title}</div>
      </div>
      {proDisabled && (
        <div className="flex h-6 min-w-10 items-center justify-center rounded-lg bg-orange text-[13px] font-semibold uppercase">
          Pro
        </div>
      )}
    </div>
  );
};

const SidebarSection = ({
  permissions,
  section,
  setMobileNavExpanded,
  sectionIndex,
}: {
  permissions: Permission[];
  section: SidebarSection;
  setMobileNavExpanded: (state: boolean) => void;
  sectionIndex: number;
}) => {
  return (
    <>
      {sectionIndex > 0 && <SidebarSeperator />}
      <div className="flex w-full flex-col px-4">
        {section.title && (
          <div className="flex px-6 py-3 text-sm uppercase text-white/50">
            {section.title}
          </div>
        )}
        {section.options.map((option, index) => (
          <SidebarOption
            sectionPermission={section.permission}
            permissions={permissions}
            option={option}
            setMobileNavExpanded={setMobileNavExpanded}
            key={`sidebar-section-${sectionIndex}-option-${index}`}
          />
        ))}
      </div>
    </>
  );
};

const SidebarNav = ({
  permissions,
  setMobileNavExpanded,
}: {
  permissions: Permission[];
  setMobileNavExpanded: (state: boolean) => void;
}) => {
  return (
    <div className="flex flex-col gap-y-3">
      {SidebarSections.map((section, index) => (
        <SidebarSection
          permissions={permissions}
          section={section}
          setMobileNavExpanded={setMobileNavExpanded}
          sectionIndex={index}
          key={`sidebar-section-${index}`}
        />
      ))}
    </div>
  );
};

const SidebarUser = () => {
  const router = useRouter();
  const user = useStore((state) => state.user);

  useEffect(() => {
    router.prefetch("/dashboard/settings");
  }, [router]);

  return (
    <div className="flex w-full items-center gap-x-4 px-11 py-9 text-white">
      {user ? (
        <div
          className="rounded-full border border-solid border-white p-[3px] hover:cursor-pointer"
          onClick={() => router.push("/dashboard/settings")}
        >
          <img
            className="h-[42px] w-[42px] rounded-full"
            src={user.image ?? "/img/user.png"}
          />
        </div>
      ) : (
        <Skeleton className="h-[48px] w-[48px] rounded-full" />
      )}

      <div className="flex flex-col">
        <div className="text-xs font-semibold">Hello,</div>
        {user ? (
          <div className="text-base font-bold">{user.name}</div>
        ) : (
          <Skeleton className="h-[24px] w-20" />
        )}
      </div>
    </div>
  );
};

// const SidebarUser = () => {
//   const router = useRouter();

//   const user = api.user.me.useQuery();

//   useEffect(() => {
//     router.prefetch("/dashboard/settings");
//   }, []);

//   console.log('user: ', user)

//   return (
//     <div className="flex w-full items-center gap-x-4 px-11 py-9 text-white">
//       {user.isSuccess && user.data ? (
//         <div
//           className="rounded-full border border-solid border-white p-[3px] hover:cursor-pointer"
//           onClick={() => router.push("/dashboard/settings")}
//         >
//           <img
//             className="h-[42px] w-[42px] rounded-full"
//             src={user.data?.image ?? "/img/user.png"}
//           />
//         </div>
//       ) : (
//         <Skeleton className="h-[48px] w-[48px] rounded-full" />
//       )}

//       <div className="flex flex-col">
//         <div className="text-xs font-semibold">Hello,</div>
//         {user.isSuccess && user.data ? (
//           <div className="text-base font-bold">{user.data.name}</div>
//         ) : (
//           <Skeleton className="h-[24px] w-20" />
//         )}
//       </div>
//     </div>
//   );
// };

const SidebarProAdvert = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/dashboard/settings/billing");
  }, []);

  return (
    <div className="flex w-full px-4">
      <div
        className="font-pjs flex w-full flex-col rounded-xl bg-lighter-green p-3 text-white hover:cursor-pointer"
        onClick={() => router.push("/dashboard/settings/billing")}
      >
        <div className="flex gap-x-2">
          <div>
            <Image
              src={"/img/svg/sidebar-crown.svg"}
              alt={"Sidebar Crown"}
              width={42}
              height={42}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-x-2 text-lg font-semibold">
              <div>Let's go</div>
              <div className="flex h-8 items-center rounded-lg bg-light-orange px-2 text-base">
                PRO
              </div>
            </div>
            <div className="text-sm">
              Subscribe to a paid plan to get access to all features
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const userPermissions = api.user.permissions.useQuery();
  const [mobileNavExpanded, setMobileNavExpanded] = useState<boolean>(false);

  return (
    <>
      <div
        className={`flex h-16 md:h-28 md:pt-2 items-center justify-between px-4 md:px-8 lgMd:hidden`}
      >
        <div onClick={() => setMobileNavExpanded(!mobileNavExpanded)}>
          {mobileNavExpanded ? <XIcon /> : <MenuIcon />}
        </div>
        <Image
          src={"/img/svg/sidebar-mobile-logo.svg"}
          alt={"Sidebar Mobile Logo"}
          width={123}
          height={35}
        />
        <div>
          <Link href={"/dashboard/settings"}>
            <UserIcon />
          </Link>
        </div>
      </div>
      <div
        className={`hidden w-full flex-col justify-between bg-primary font-plusjakartasans lgMd:flex lgMd:h-full lgMd:w-72 lgMd:min-w-72`}
      >
        <div className="flex flex-col">
          <div className="relative hidden w-full justify-center py-9 lgMd:flex">
            <Image
              src={"/img/svg/sidebar-logo.svg"}
              alt="Kyndom Logo"
              width={115}
              height={27}
            />
          </div>
          <div className="sidebar-over flex h-full flex-col gap-y-3 overflow-y-auto lgMd:h-[calc(100vh_-_221px)]">
            <SidebarSeperator />
            <Suspense>
              {userPermissions.data ? (
                <SidebarNav
                  permissions={userPermissions.data}
                  setMobileNavExpanded={setMobileNavExpanded}
                />
              ) : (
                <div className="flex flex-col gap-y-3">
                  <div className="flex flex-col gap-y-1">
                    {Array.from(Array(5).keys()).map((_, index) => (
                      <div
                        className="px-4"
                        key={`sidebar-loading-nav-${index}`}
                      >
                        <Skeleton className="h-12 w-full rounded-xl" />
                      </div>
                    ))}
                  </div>
                  <div className="px-4">
                    <Skeleton className="h-8 w-32" />
                  </div>
                  <div className="flex flex-col gap-y-1">
                    {Array.from(Array(7).keys()).map((_, index) => (
                      <div
                        className="px-4"
                        key={`sidebar-loading-nav-2-${index}`}
                      >
                        <Skeleton className="h-12 w-full rounded-xl" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Sheet
                open={mobileNavExpanded}
                onOpenChange={setMobileNavExpanded}
              >
                <SheetContent
                  side="left"
                  className="border-r-0 bg-primary px-0 text-white"
                >
                  <div className="flex justify-center py-8">
                    <Image
                      src={"/img/svg/sidebar-logo.svg"}
                      alt="Kyndom Logo"
                      width={115}
                      height={27}
                    />
                  </div>
                  {userPermissions.data && (
                    <div className="sidebar-over flex h-[75%] flex-col overflow-y-auto">
                      <SidebarNav
                        permissions={userPermissions.data}
                        setMobileNavExpanded={setMobileNavExpanded}
                      />
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </Suspense>
          </div>
        </div>
        <div
          className={`${mobileNavExpanded ? "flex" : "hidden lgMd:flex"} flex-col`}
        >
          {userPermissions.data &&
            !userPermissions.data.includes(Permission.ACTIVE_SUBSCRIPTION) && (
              <SidebarProAdvert />
            )}
          <SidebarUser />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
