import { z } from 'zod';

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const dateStringSchema = z.preprocess(
  (arg) => (arg instanceof Date ? arg.toISOString().slice(0, 10) : arg),
  z.string().regex(dateRegex, 'Date must be formatted as YYYY-MM-DD')
);

const optionalDateStringSchema = z.preprocess(
  (arg) => (arg instanceof Date ? arg.toISOString().slice(0, 10) : arg),
  z.string().regex(dateRegex, 'Date must be formatted as YYYY-MM-DD').optional()
);

export const PostFrontmatterSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().regex(slugRegex, 'Slug must be lowercase alphanumeric with hyphens'),
  date: dateStringSchema,
  updated: optionalDateStringSchema,
  author: z.string().default('Admin'),
  excerpt: z.string().max(280),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export const HeroBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('hero'),
  heading: z.string(),
  subheading: z.string(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  backgroundImage: z.string().optional(),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
});

export const FeatureItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const FeaturesBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('features'),
  title: z.string(),
  items: z.array(FeatureItemSchema),
});

export const RichTextBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('richtext'),
  markdown: z.string(),
});

export const CtaBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('cta'),
  heading: z.string(),
  buttonText: z.string(),
  buttonUrl: z.string(),
});

export const PageBlockSchema = z.discriminatedUnion('type', [
  HeroBlockSchema,
  FeaturesBlockSchema,
  RichTextBlockSchema,
  CtaBlockSchema,
]);

export const PageSchema = z.object({
  title: z.string(),
  slug: z.string().regex(slugRegex, 'Slug must be "home" or a URL-safe lowercase slug'),
  description: z.string(),
  updatedAt: z.string(),
  blocks: z.array(PageBlockSchema),
});

export const SiteConfigSchema = z.object({
  repoOwner: z.string(),
  repoName: z.string(),
  siteTitle: z.string(),
  basePath: z.string().default('/'),
  pagesUrl: z.string(),
  lastSyncedCommit: z.string().optional(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;
export type FeatureItem = z.infer<typeof FeatureItemSchema>;
export type HeroBlock = z.infer<typeof HeroBlockSchema>;
export type FeaturesBlock = z.infer<typeof FeaturesBlockSchema>;
export type RichTextBlock = z.infer<typeof RichTextBlockSchema>;
export type CtaBlock = z.infer<typeof CtaBlockSchema>;
export type PageBlock = z.infer<typeof PageBlockSchema>;
export type PageData = z.infer<typeof PageSchema>;
export type SiteConfig = z.infer<typeof SiteConfigSchema>;
