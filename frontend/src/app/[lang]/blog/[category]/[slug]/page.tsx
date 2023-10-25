import { getStrapiURL } from '@/app/[lang]/utils/api-helpers';
import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import { translate } from '@/app/[lang]/utils/translate';
import Post from '@/app/[lang]/views/post';
import type { Metadata } from 'next';

async function getPostBySlug(slug: string, lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/articles`;
  const urlParamsObject = {
    filters: { slug },
    populate: {
      cover: { fields: ['url'] },
      seo: { fields: ['shareImage,metaTitle,metaDescription'] },
      authorsBio: { populate: '*' },
      category: { fields: ['name'] },
      blocks: { populate: '*' },
    },
    locale: lang,
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response;
}

async function getMetaData(slug: string, lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/articles`;
  const urlParamsObject = {
    filters: { slug },
    populate: { seo: { populate: '*' } },
    locale: lang,
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response.data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; lang: string };
}): Promise<Metadata> {
  const meta = await getMetaData(params.slug, params.lang);
  const metadata = meta[0]?.attributes?.seo;
  return {
    title: metadata?.metaTitle,
    description: metadata?.metaDescription,
    openGraph: {
      type: 'article',
      ...(metadata?.metaTitle && { title: metadata?.metaTitle }),
      ...(metadata?.metaDescription && {
        description: metadata?.metaDescription,
      }),
      ...(metadata?.shareImage?.data?.attributes?.url && {
        images: [
          new URL(metadata?.shareImage?.data?.attributes?.url, getStrapiURL()),
        ],
      }),
    },
  };
}

export default async function PostRoute({
  params,
}: {
  params: { slug: string; lang: string };
}) {
  const { slug, lang } = params;
  const data = await getPostBySlug(slug, lang);
  if (data.data.length === 0)
    return <h2>{translate(lang, 'general', 'no-post')}</h2>;
  return <Post data={data.data[0]} />;
}

export async function generateStaticParams() {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/articles`;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const articleResponse = await fetchAPI(
    path,
    {
      populate: ['category'],
    },
    options
  );

  return articleResponse.data.map(
    (article: {
      attributes: {
        slug: string;
        category: {
          slug: string;
        };
      };
    }) => ({ slug: article.attributes.slug, category: article.attributes.slug })
  );
}
