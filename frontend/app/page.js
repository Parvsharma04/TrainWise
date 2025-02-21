import About from "../components/About";
import Contact from "../components/Contact";
import Features from "../components/Features";
import Hero from "../components/Hero";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <Hero />
      <About />
      <Features />
      <Contact />
      <Footer />
    </main>
  )
}