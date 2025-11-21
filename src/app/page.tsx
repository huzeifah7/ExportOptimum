import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import Quality from '@/components/sections/quality';
import Varieties from '@/components/sections/varieties';
import Testimonials from '@/components/sections/testimonials';
import Partners from '@/components/sections/partners';
import Blog from '@/components/sections/blog';
import Contact from '@/components/sections/contact';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Quality />
        <Varieties />
        <Testimonials />
        <Partners />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
