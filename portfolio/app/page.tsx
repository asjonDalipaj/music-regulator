import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        
        {/* Placeholder sections - to be built in future iterations */}
        <section id="about" className="min-h-screen flex items-center justify-center bg-cream">
          <div className="text-center">
            <h2 className="font-playfair text-4xl font-bold text-burgundy mb-4">About Me</h2>
            <p className="font-inter text-charcoal">Coming soon...</p>
          </div>
        </section>

        <section id="projects" className="min-h-screen flex items-center justify-center bg-cream-dark">
          <div className="text-center">
            <h2 className="font-playfair text-4xl font-bold text-burgundy mb-4">Featured Projects</h2>
            <p className="font-inter text-charcoal">Coming soon...</p>
          </div>
        </section>

        <section id="skills" className="min-h-screen flex items-center justify-center bg-cream">
          <div className="text-center">
            <h2 className="font-playfair text-4xl font-bold text-burgundy mb-4">Skills & Expertise</h2>
            <p className="font-inter text-charcoal">Coming soon...</p>
          </div>
        </section>

        <section id="contact" className="min-h-screen flex items-center justify-center bg-cream-dark">
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
