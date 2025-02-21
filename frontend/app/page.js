import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import Features from "./components/Features";
import Contact from "./components/Contact";
import Footer from "./components/Footr";

export default function Home() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      {/* <NavBar /> */}
      <Hero />
      <About />
      <Features />
      <Contact />
      {/* <Footer /> */}
    </main>
  );
}
