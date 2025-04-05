import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export function Button({ variant = "default", ...props }: ButtonProps) {
  const base =
    "rounded-xl px-4 py-2 text-sm font-medium transition border";
  const styles =
    variant === "outline"
      ? "bg-white text-black border-gray-300 hover:bg-gray-100"
      : "bg-black text-white border-transparent hover:bg-gray-800";

  return <button {...props} className={`${base} ${styles} ${props.className ?? ""}`} />;
}
