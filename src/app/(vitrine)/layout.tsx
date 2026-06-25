import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function VitrineLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 pt-16">{children}</main>
      <Footer />
    </>
  );
}
