import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex gap-x-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        "outline-primary":
          "border border-primary text-primary bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-[#82828214] text-secondary-foreground hover:bg-[#82828214]/20",
        filter: "bg-poly/[0.08] text-black hover:bg-poly/[0.06]",
        vaultFilter:
          "bg-[#82828214] hover:bg-[#82828214]/20 text-[#303134] font-pjs text-[13px] justify-start px-5 gap-x-3",
        orange: "bg-orange text-white hover:bg-orange/80",
        white: "bg-white text-black hover:text-primary",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        search:
          "bg-primary text-primary-foreground hover:bg-primary/90 font-pjs font-light text-[13px]",
      },
      size: {
        default: "h-10 rounded-lg px-4 py-2",
        search: "h-8 rounded-[38px] px-7 md:px-5",
        xs: "h-6 rounded-lg px-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        lgMd: "h-[42px] rounded-2xl px-7",
        xl: "h-[52px] rounded-lg px-8",
        xlIcon: "h-[52px] rounded-xl",
        icon: "h-10 w-10",
        vaultFilter: "h-[42px] gap-x-20 w-full md:w-fit md:gap-x-2 rounded-xl",
        vaultOption: "h-[42px] w-fit rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
