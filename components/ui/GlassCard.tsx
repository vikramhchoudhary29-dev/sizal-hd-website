import { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/60 bg-white/70 p-8 shadow-xl shadow-blue-500/10 backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}