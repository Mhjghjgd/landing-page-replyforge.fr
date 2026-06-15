import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] noise-overlay">
      <div aria-hidden className="absolute inset-0 mesh-gradient opacity-50" />
      <Container size="wide" className="relative z-10 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
          <h1 className="font-display mt-6 text-balance text-4xl leading-[1.05] text-[var(--color-foreground)] md:text-6xl lg:text-[72px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)] md:text-xl">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
