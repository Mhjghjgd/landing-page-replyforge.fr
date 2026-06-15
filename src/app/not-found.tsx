import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden noise-overlay py-20">
      <div aria-hidden className="absolute inset-0 mesh-gradient opacity-60" />
      <Container size="narrow" className="relative z-10 text-center">
        <p className="font-display text-[120px] leading-none text-[var(--color-gold-300)] md:text-[200px]">
          404
        </p>
        <Eyebrow className="justify-center mt-4">Page introuvable</Eyebrow>
        <h1 className="font-display mt-6 text-balance text-3xl leading-[1.1] text-[var(--color-foreground)] md:text-5xl">
          Cette chambre n&apos;existe{" "}
          <span className="italic text-[var(--color-gold-300)]">pas dans notre hôtel</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-relaxed text-[var(--color-pearl-300)]">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
          Retournons à l&apos;accueil — il y a beaucoup à voir.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">
            <ArrowLeft size={18} />
            Retour à l&apos;accueil
          </Button>
          <Button href="/contact" variant="ghost" size="lg">
            Prendre rendez-vous
          </Button>
        </div>
      </Container>
    </section>
  );
}
