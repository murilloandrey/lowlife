export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  compact?: boolean;
}) {
  const titleSize = compact
    ? "text-[1.625rem] sm:text-5xl lg:text-4xl"
    : "text-4xl sm:text-6xl";

  return (
    <div className="mb-10 flex min-w-0 flex-col gap-3 sm:mb-14">
      <div className="flex items-center gap-3 text-primary">
        <div className="h-px w-8 bg-gradient-brand" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
          {eyebrow}
        </span>
      </div>
      <h2
        className={`max-w-2xl font-heading font-black uppercase leading-[0.95] ${titleSize}`}
      >
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
