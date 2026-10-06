type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  light?: boolean;
};

export default function SectionHeading({
  label,
  title,
  description,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <span className={`mb-5 inline-block text-xs font-black tracking-[0.25em] ${light ? "text-cyan-300" : "text-blue-600"}`}>
        {label}
      </span>

      <h2 className={`mb-5 text-4xl font-black tracking-tight md:text-6xl ${light ? "text-white" : "text-slate-950"}`}>
        {title}
      </h2>

      {description && (
        <p className={`text-lg leading-8 ${light ? "text-slate-300" : "text-slate-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
}