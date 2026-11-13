import { type CollectionEntry, getCollection } from 'astro:content';

import { config } from '../config';

export type Post = CollectionEntry<'posts'>;

export async function getPosts() {
  const posts = await getCollection('posts');
  return posts
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) =>
        b.data.published.getTime() - a.data.published.getTime() ||
        a.id.localeCompare(b.id),
    );
}

export function postUrl(name: string) {
  return `${config.pages.posts.href}${name}/`;
}

export function tagSlug(name: string) {
  // Escape punctuation that URL parsers or static hosts interpret specially.
  return name.replace(
    /[^\p{L}\p{M}\p{N}_+-]/gu,
    (character) => `~${character.codePointAt(0)?.toString(16)}~`,
  );
}

export function tagUrl(name: string) {
  return `${config.pages.tags.href}${encodeURI(tagSlug(name))}/`;
}

export function getTags(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags)
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort(
      (a, b) =>
        b.count - a.count || a.name.localeCompare(b.name, config.language),
    );
}

export function groupByYear(posts: Post[]) {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    const year = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      timeZone: config.timezone,
    }).format(post.data.published);
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups.entries()].sort(([a], [b]) => Number(b) - Number(a));
}

export function formatDate(date: Date | string, short = false) {
  return new Intl.DateTimeFormat(config.language, {
    ...(!short && { year: 'numeric' }),
    month: '2-digit',
    day: '2-digit',
    timeZone: config.timezone,
  })
    .format(new Date(date))
    .replaceAll('/', '-');
}
