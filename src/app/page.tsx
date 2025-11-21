import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import Testimonials from '@/components/sections/testimonials';
import Partners from '@/components/sections/partners';
import Blog from '@/components/sections/blog';
import Contact from '@/components/sections/contact';
import Footer from '@/components/layout/footer';
import Quality from '@/components/sections/quality';
import Varieties from '@/components/sections/varieties';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <section id="varieties">
          <Varieties />
        </section>
        <section id="quality">
          <Quality />
        </section>
        <Testimonials />
        <Partners />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
