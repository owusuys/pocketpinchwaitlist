import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ScoreScale from "@/components/ScoreScale";
import ValuePoints from "@/components/ValuePoints";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <ScoreScale />
      <ValuePoints />
      <Faq />
      <Footer />
    </main>
  );
}
