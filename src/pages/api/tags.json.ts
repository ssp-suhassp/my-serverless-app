import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { withBase } from '../../utils/basePath';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  const tagMap = new Map<string, { count: number; postSlugs: string[] }>();

  for (const post of posts) {
    for (const rawTag of post.data.tags) {
      const tag = rawTag.toLowerCase().trim();
      if (!tag) continue;
      const current = tagMap.get(tag) || { count: 0, postSlugs: [] };
      current.count += 1;
      current.postSlugs.push(post.slug);
      tagMap.set(tag, current);
    }
  }

  const tags = Array.from(tagMap.entries())
    .map(([tag, data]) => ({
      tag,
      count: data.count,
      postSlugs: data.postSlugs,
      url: withBase(`/api/posts.json?tag=${encodeURIComponent(tag)}`),
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  const payload = {
    totalTags: tags.length,
    tags,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
