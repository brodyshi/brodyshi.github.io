# Brody Shi’s Blog

[Visit the blog](https://brodyshi.github.io/) · [Subscribe via RSS](https://brodyshi.github.io/rss.xml)

[Astro](https://astro.build/) builds the site from Markdown. [Tailwind CSS](https://tailwindcss.com/) handles the layout, and [VitePress](https://vitepress.dev/) provides the palette and article styles.

## Run locally

Use [Node.js](https://nodejs.org/en) `26.12.1` and [pnpm](https://pnpm.io/) `12.15.0`. With [mise](https://mise.jdx.dev/), run `mise install` to set up both versions from [`mise.toml`](mise.toml).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL Astro prints, usually `http://localhost:4321`.

| Command        | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `pnpm check`   | Check formatting, lint rules, and types.             |
| `pnpm build`   | Run all checks and build the static site in `dist/`. |
| `pnpm preview` | Preview `dist/` after a build.                       |

Use `pnpm format:fix` and `pnpm lint:fix` to apply automatic fixes.

## Write a post

Run `pnpm post` to answer the prompts, or use either command below. The first derives the filename from the English title. The second supplies a filename for a Chinese title.

```sh
pnpm post "My First Post"
pnpm post --title "我的第一篇文章" --filename my-first-post.md
```

Both commands create `my-first-post.md` in [`src/content/posts/`](src/content/posts/). Use lowercase letters and digits, with single hyphens between words. The filename determines the URL (`/posts/my-first-post/`), so keep it stable after publishing.

New posts start with `draft: true`, a placeholder description, and no tags. Replace the description, add tags if you like, and write the article below the frontmatter.

```yaml
---
title: 我的第一篇文章
description: 记录第一次搭建博客的过程。
published: 2026-11-13T12:00:00+08:00
tags: [Astro, 随笔]
draft: true
---
```

Include a time zone in timestamps. The site sorts posts by `published` and uses `Asia/Shanghai` for dates and archive years. The optional `updated` timestamp must be on or after `published`.

Store images in `public/images/` and reference them with paths such as `/images/example.png`. The [Markdown syntax guide](src/content/posts/markdown-syntax-support.md) covers tables, task lists, heading anchors, callouts, collapsible sections, code tabs, [Shiki](https://shiki.style/) highlighting, and [KaTeX](https://katex.org/) math.

The site, RSS feed, and sitemap omit drafts. Set `draft: false` to preview a post locally or include it in the next deployment, even if `published` is in the future. If you’re only previewing, restore `draft: true` before committing.

## Deploy to GitHub Pages

In the repository’s **Settings → Pages**, select **GitHub Actions** as the source. The [CI workflow](.github/workflows/ci.yml) runs `pnpm build` on pull requests. After a successful build on `main`, it deploys `dist/` to [GitHub Pages](https://docs.github.com/en/pages). The output includes `/rss.xml`, `/sitemap-index.xml`, and `/robots.txt`.
