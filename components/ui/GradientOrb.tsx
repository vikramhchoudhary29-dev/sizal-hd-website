export default function GradientOrb({ size = 'h-20 w-20' }: { size?: string }) {
  return <div className={`${size} rounded-full bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 shadow-xl shadow-blue-500/25`} />;
}
