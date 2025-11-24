import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Varieties from '@/components/sections/varieties';

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Varieties />
      </main>
      <Footer />
    </div>
  );
}
