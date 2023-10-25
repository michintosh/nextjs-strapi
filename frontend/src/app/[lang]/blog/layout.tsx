import React from 'react'
import type { Metadata } from "next";
import { getStrapiURL } from '../utils/api-helpers';
import { translate } from '../utils/translate';
import { fetchAPI } from '../utils/fetch-api';
import { FALLBACK_SEO } from '../utils/constants';

async function getGlobal(lang: string): Promise<any> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token)
    throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: [
      "metadata",
    ],
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const meta = await getGlobal(params.lang);

  if (!meta.data) return FALLBACK_SEO;

  const { metadata } = meta.data.attributes;


  return {
    title: `${translate(params.lang,'blog','title')} - ${metadata.metaTitle}`,
    openGraph: {
      type:"website",
      title: `${translate(params.lang,'blog','title')} - ${metadata.metaTitle}`,
    }
  };
}


export default function layout({children} : {children: React.ReactNode}) {
  return (
    <div>{children}</div>
  )
}
