export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-black tracking-[0.2em] text-blue-600">
      {children}
    </span>
  );
}