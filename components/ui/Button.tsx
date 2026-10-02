import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "dark" | "ghost";
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-all duration-300";

  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/30 hover:-translate-y-1",
    secondary:
      "bg-white text-slate-950 shadow-lg shadow-blue-500/10 hover:-translate-y-1",
    dark:
      "bg-slate-950 text-white shadow-lg shadow-slate-900/20 hover:-translate-y-1",
    ghost:
      "bg-white/10 text-white backdrop-blur-xl hover:bg-white/20",
  };

  const classes = `${base} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}