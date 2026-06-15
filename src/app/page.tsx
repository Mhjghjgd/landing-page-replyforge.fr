import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Solution } from "@/components/sections/solution";
import { Proof } from "@/components/sections/proof";
import { Process } from "@/components/sections/process";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <Proof />
      <Process />
      <FAQ />
      <CTA />
    </>
  );
}
