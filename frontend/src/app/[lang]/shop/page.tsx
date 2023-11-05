import { Carousel } from '@/app/[lang]/components/shop/carousel';
import { ThreeItemGrid } from '@/app/[lang]/components/shop/grid/three-items';
import Footer from '@/app/[lang]/components/shop/layout/footer';
import { Suspense } from 'react';

export const runtime = 'edge';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website',
  },
};

export default async function HomePageShop() {
  return (
    <>
    <h1>shop</h1>
      <ThreeItemGrid />
      <Suspense>
        <Carousel />
        {/* <Suspense>
          <Footer />
        </Suspense> */}
      </Suspense>
    </>
  );
}
