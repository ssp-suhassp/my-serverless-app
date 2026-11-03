import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { withBase } from '../../utils/basePath';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const payload = {
    generatedAt: new Date().toISOString(),
    total: posts.length,
    posts: posts.map((post) => ({
      title: post.data.title,
      slug: post.slug,
      date: post.data.date,
      updated: post.data.updated || null,
      author: post.data.author,
      excerpt: post.data.excerpt,
      coverImage: post.data.coverImage ? withBase(post.data.coverImage) : null,
      tags: post.data.tags,
      draft: post.data.draft,
      url: withBase(`/blog/${post.slug}`),
      apiUrl: withBase(`/api/posts/${post.slug}.json`),
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
