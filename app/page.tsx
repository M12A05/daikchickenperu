import HeroInicio from '@/components/HeroInicio';
import MasPedidos from '@/components/MasPedidos';
import PromoBanner from '@/components/PromoBanner';
import BentoCalidad from '@/components/BentoCalidad';
import WebPromoBanner from '@/components/WebPromoBanner';
import { getCatalogState } from '@/lib/catalog-server';
import { isCatalogItemExpired } from '@/lib/catalog';

export default async function Home() {
  const { items, error } = await getCatalogState();
  const products = items.filter((item) => item.type === 'product');
  const promos = items.filter((item) => item.type === 'promo' && !isCatalogItemExpired(item));

  return (
    <>
      <HeroInicio />
      <div className="relative">
        <div 
          className="absolute inset-0 z-0 opacity-80 bg-fixed bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/fondodelpolloblanco.webp')" }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <MasPedidos products={products} catalogError={error} />
          {promos.length > 0 && <PromoBanner />}
          <BentoCalidad />
        </div>
      </div>
      <WebPromoBanner />
    </>
  );
}
