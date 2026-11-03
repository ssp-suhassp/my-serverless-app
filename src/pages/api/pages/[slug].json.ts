import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from '../../../utils/basePath';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getCollection('pages');

  return pages.map((page) => ({
    params: { slug: page.data.slug },
    props: { page },
  }));
};

interface Props {
  page: CollectionEntry<'pages'>;
}

export const GET: APIRoute = async ({ props }) => {
  const { page } = props as Props;

  const payload = {
    title: page.data.title,
    slug: page.data.slug,
    description: page.data.description,
    updatedAt: page.data.updatedAt,
    blocks: page.data.blocks,
    url: page.data.slug === 'home' ? withBase('/') : withBase(`/${page.data.slug}`),
    apiUrl: withBase(`/api/pages/${page.data.slug}.json`),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};

