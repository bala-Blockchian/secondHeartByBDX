import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Footer from "./components/Footer.jsx";
import ContributionModal from "./components/ContributionModal.jsx";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header onOpenModal={() => setIsModalOpen(true)} />

      <main id="main">
        <Hero onOpenModal={() => setIsModalOpen(true)} />
        <About />
        <HowItWorks onOpenModal={() => setIsModalOpen(true)} />
      </main>

      <Footer />

      <ContributionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
