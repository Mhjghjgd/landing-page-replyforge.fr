import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { GoogleMockup } from "@/components/sections/google-mockup";
import { Process } from "@/components/sections/process";
import { Solution } from "@/components/sections/solution";
import { Pricing } from "@/components/sections/pricing";
import { Proof } from "@/components/sections/proof";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <GoogleMockup />
      <Process />
      <Solution />
      <Pricing />
      <Proof />
      <FAQ />
      <CTA />
    </>
  );
}
