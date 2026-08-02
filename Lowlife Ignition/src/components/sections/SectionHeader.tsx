export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:mb-14">
      <div className="flex items-center gap-3 text-primary">
        <div className="h-px w-8 bg-gradient-brand" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
          {eyebrow}
        </span>
      </div>
      <h2 className="max-w-2xl font-heading text-4xl font-black leading-[0.95] sm:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
