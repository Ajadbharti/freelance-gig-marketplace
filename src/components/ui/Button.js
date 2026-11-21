"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Button = forwardRef(function Button(
  {
    variant = "primary",
    className,
    children,
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  const base =
    "inline-flex items-center justify-center font-semibold text-sm uppercase tracking-wide select-none transition-all disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "px-5 py-2.5 bg-[#005d42] text-white border border-[#005d42] hover:bg-[#047857] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    secondary:
      "px-5 py-2.5 border border-[#0b1c30] text-[#0b1c30] hover:bg-[#dce9ff] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none bg-white",
    danger:
      "px-5 py-2.5 bg-[#ba1a1a] text-white border border-[#ba1a1a] hover:bg-[#93000a] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(base, variants[variant] || variants.primary, className)}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
