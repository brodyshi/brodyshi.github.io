# Brody Shi’s Blog

A Markdown blog built with [Astro](https://astro.build/), with [Tailwind CSS](https://tailwindcss.com/) for layout and [VitePress](https://vitepress.dev/) for colors and article styles.

## Run locally

Use Node.js `26.12.1` and pnpm `12.15.0`. If you use [mise](https://mise.jdx.dev/), run `mise install` to install both from [mise.toml](mise.toml).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL printed by Astro (usually `http://localhost:4321`).

| Command                             | Purpose                           |
| ----------------------------------- | --------------------------------- |
| `pnpm check`                        | Check formatting, lint, and types |
| `pnpm build`                        | Run checks and build to `dist/`   |
| `pnpm preview`                      | Preview the build                 |
| `pnpm format:fix` / `pnpm lint:fix` | Apply formatting / lint fixes     |

## Write a post

Run `pnpm post` for interactive prompts, or pass a title directly.

```sh
pnpm post "My First Post"
pnpm post --title "我的第一篇文章" --filename my-first-post.md
```

Both examples create `my-first-post.md` in [src/content/posts/](src/content/posts/). Use lowercase letters and digits with single hyphens between words. Keep the filename after publishing to preserve the URL (`/posts/my-first-post/`).

Replace the placeholder description, add optional tags, and write the article below the frontmatter.

```yaml
---
title: 我的第一篇文章
description: 记录第一次搭建博客的过程。
published: 2026-11-13T12:00:00+08:00
tags: [Astro, 随笔]
draft: true
---
```

- Include a time zone in timestamps. Posts sort by `published`, and dates and archive years use `Asia/Shanghai`. If set, `updated` must be on or after `published`.
- Save images in `public/images/` and reference them as `/images/example.png`. See the [Markdown syntax guide](src/content/posts/markdown-syntax-support.md) for supported features.
- Set `draft: false` to include the post in the site, RSS feed, and sitemap, even if `published` is in the future. For a local preview only, restore `draft: true` before committing.

## Deploy to GitHub Pages

In your repository’s **Settings → Pages**, set the source to **GitHub Actions**.

The [CI workflow](.github/workflows/ci.yml) runs `pnpm build` on pull requests and pushes to `main`. After a successful build on `main`, it publishes `dist/` to GitHub Pages, including `/rss.xml`, `/sitemap-index.xml`, and `/robots.txt`.
