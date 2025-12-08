import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutMe from "@/components/about/AboutMe";
import Skills from "@/components/skills/Skills";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <AboutMe />
        <Skills />
        
        {/* Placeholder sections - to be built in future iterations */}
        <section id="projects" className="min-h-screen flex items-center justify-center bg-cream-dark">
          <div className="text-center">
            <h2 className="font-playfair text-4xl font-bold text-burgundy mb-4">Featured Projects</h2>
            <p className="font-inter text-charcoal">Coming soon...</p>
          </div>
        </section>

        <section id="contact" className="min-h-screen flex items-center justify-center bg-cream">
          <div className="text-center">
            <h2 className="font-playfair text-4xl font-bold text-burgundy mb-4">Get In Touch</h2>
            <p className="font-inter text-charcoal">Coming soon...</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
