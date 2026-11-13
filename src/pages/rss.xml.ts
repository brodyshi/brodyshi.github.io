import rss from '@astrojs/rss';

import { config } from '../config';
import { renderFeedContent } from '../utils/markdown';
import { getPosts, postUrl } from '../utils/posts';

export async function GET() {
  const posts = await getPosts();
  return rss({
    title: config.name,
    description: config.pages.home.description,
    site: config.url,
    customData: `<language>${config.language}</language>`,
    items: await Promise.all(
      posts.map(async (post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.published,
        link: postUrl(post.id),
        categories: post.data.tags,
        content: await renderFeedContent(
          post.body ?? '',
          new URL(postUrl(post.id), config.url).href,
        ),
      })),
    ),
  });
}
