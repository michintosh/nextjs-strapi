import type { Metadata } from 'next';
import './globals.css';
import { getStrapiMedia, getStrapiURL } from './utils/api-helpers';
import { fetchAPI } from './utils/fetch-api';

import { i18n } from '../../../i18n-config';
import Banner from './components/Banner';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { FALLBACK_SEO } from '@/app/[lang]/utils/constants';
import { Providers } from '../store/provider';
import { Suspense } from 'react';
import OpenCart from './components/shop/cart/open-cart';
import Cart from './components/shop/cart';

async function getGlobal(lang: string): Promise<any> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token)
    throw new Error('The Strapi API Token environment variable is not set.');

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: [
      'metadata.shareImage',
      'favicon',
      'notificationBanner.link',
      'navbar.links',
      'navbar.navbarLogo.logoImg',
      'footer.footerLogo.logoImg',
      'footer.menuLinks',
      'footer.legalLinks',
      'footer.socialLinks',
      'footer.categories',
      'GlobalSEOImage',
    ],
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
}
async function getLocales(): Promise<
  { id: number; name: string; code: string; isDefault: boolean }[]
> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token)
    throw new Error('The Strapi API Token environment variable is not set.');

  const path = `/i18n/locales`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  return await fetchAPI(path, {}, options);
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const meta = await getGlobal(params.lang);

  if (!meta.data) return FALLBACK_SEO;

  const { metadata, favicon, GlobalSEOImage } = meta.data.attributes;
  const { url } = favicon.data.attributes;
  const { url: globalImageUrl } = GlobalSEOImage?.data?.attributes;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
    icons: {
      icon: [new URL(url, getStrapiURL())],
    },
    openGraph: {
      type: 'website',
      title: metadata.metaTitle,
      description: metadata.metaDescription,
      images: [new URL(globalImageUrl, getStrapiURL())],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const global = await getGlobal(params.lang);
  const locales = await getLocales();

  // TODO: CREATE A CUSTOM ERROR PAGE
  if (!global.data) return null;

  const { notificationBanner, navbar, footer } = global.data.attributes;

  const navbarLogoUrl = getStrapiMedia(
    navbar.navbarLogo.logoImg.data.attributes.url
  );

  const footerLogoUrl = getStrapiMedia(
    footer.footerLogo.logoImg.data.attributes.url
  );

  return (
    <html lang={params.lang}>
      <Providers>
        <body>
          <Navbar
            links={navbar.links}
            logoUrl={navbarLogoUrl}
            logoText={navbar.navbarLogo.logoText}
            locales={locales}
            cart={
              <div className="flex justify-end md:w-1/3">
                <Suspense fallback={<OpenCart />}>
                  <Cart />
                </Suspense>
              </div>
            }
          />
          <main className="dark:bg-black dark:text-gray-100 min-h-screen">
            {children}
          </main>

          <Banner data={notificationBanner} />

          <Footer
            logoUrl={footerLogoUrl}
            logoText={footer.footerLogo.logoText}
            menuLinks={footer.menuLinks}
            categoryLinks={footer.categories.data}
            legalLinks={footer.legalLinks}
            socialLinks={footer.socialLinks}
          />
        </body>
      </Providers>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }));
}
