import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import type { Element } from 'hast';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import rehypeSlug from 'rehype-slug';
import { visit } from 'unist-util-visit';
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons';

import { config } from './src/config';
import { markdown } from './src/markdown.config';
import {
  rehypeVitePressCode,
  remarkReadingTime,
  sharedRemarkPlugins,
} from './src/utils/markdown';

export default defineConfig({
  site: config.url,
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (url) => !url.endsWith('/404/') })],
  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    processor: unified({
      remarkPlugins: [remarkReadingTime, ...sharedRemarkPlugins],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties(heading: Readonly<Element>) {
              let title = '';
              visit(heading, 'text', (node) => {
                title += node.value;
              });
              return {
                className: ['header-anchor'],
                ariaLabel: title.trim(),
              };
            },
            content: { type: 'text', value: '' },
          },
        ],
        [rehypeMermaid, { strategy: 'pre-mermaid' }],
        rehypeVitePressCode,
      ],
    }),
    shikiConfig: {
      defaultColor: false,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
        {
          name: 'markdown-code-fence',
          pre(node) {
            node.properties.dataCodeFence = this.options.meta?.__raw;
          },
        },
        transformerMetaHighlight(),
        transformerNotationDiff(),
        transformerNotationErrorLevel(),
        transformerNotationFocus({
          classActivePre: 'has-focused-lines',
          classActiveLine: 'has-focus',
        }),
        transformerNotationHighlight(),
      ],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      groupIconVitePlugin({ defaultLabels: [...markdown.codeIconLabels] }),
    ],
  },
});
