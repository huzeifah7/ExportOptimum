import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import Testimonials from '@/components/sections/testimonials';
import Partners from '@/components/sections/partners';
import Blog from '@/components/sections/blog';
import Footer from '@/components/layout/footer';
import Quality from '@/components/sections/quality';
import About from '@/components/sections/about';
import Varieties from '@/components/sections/varieties';
import Ceo from '@/components/sections/ceo';
import KeyFigures from '@/components/sections/key-figures';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <KeyFigures />
        <About />
        <Quality />
        <Varieties />
        <Ceo />
        <Testimonials />
        <Partners />
        <Blog />
      </main>
      <Footer />
    </div>
  );
}
