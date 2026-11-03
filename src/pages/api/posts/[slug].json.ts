import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { marked } from 'marked';
import { withBase, rewriteHtmlSubpaths } from '../../../utils/basePath';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
};

interface Props {
  post: CollectionEntry<'posts'>;
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as Props;
  const rawHtml = await marked.parse(post.body || '');
  const renderedHtml = rewriteHtmlSubpaths(rawHtml);

  const payload = {
    frontmatter: {
      ...post.data,
      slug: post.slug,
      coverImage: post.data.coverImage ? withBase(post.data.coverImage) : null,
    },
    markdown: post.body,
    html: renderedHtml,
    url: withBase(`/blog/${post.slug}`),
    apiUrl: withBase(`/api/posts/${post.slug}.json`),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
