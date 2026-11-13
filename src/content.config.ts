import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const tagName = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => !/[\\/]/u.test(value) && value !== '.' && value !== '..',
    'Tag names must not contain path separators or equal "." or "..".',
  );

const postDate = z.union([
  z.date(),
  z.iso.datetime({ offset: true }).transform((value) => new Date(value)),
]);

const posts = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/posts',
    generateId: ({ entry }) => {
      const name = entry.slice(0, -'.md'.length);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
        throw new Error(
          `Invalid post filename "${entry}": use lowercase letters, digits, and single hyphens between words.`,
        );
      }
      return name;
    },
  }),
  schema: z
    .object({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      published: postDate,
      updated: postDate.optional(),
      tags: z
        .array(tagName)
        .default([])
        .transform((tags) => [...new Set(tags)]),
      draft: z.boolean().default(false),
    })
    .refine((post) => !post.updated || post.updated >= post.published, {
      message: 'The update date must not precede the publication date.',
      path: ['updated'],
    }),
});

export const collections = { posts };
