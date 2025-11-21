import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Quality from '@/components/sections/quality';

export default function QualityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Quality />
      </main>
      <Footer />
    </div>
  );
}
