import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductsGrid from '@/components/sections/products-grid';
import Cta from '@/components/sections/cta';

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-headline font-bold">Our Produce</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                We cultivate and export several premium avocado varieties to meet global demand. Explore our selection below.
                </p>
            </div>
            <ProductsGrid />
            </div>
        </div>
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
