import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import BrandStatement from '@/components/home/BrandStatement';
import { getProducts } from '@/lib/db';

export default async function HomePage() {
  const allProducts = await getProducts();
  const featured = allProducts.filter(p => p.is_featured && p.is_available).slice(0, 4);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedSection products={featured} />
        <BrandStatement />
      </main>
      <Footer />
    </>
  );
}
