import type { RemarkPlugin } from '@astrojs/markdown-remark';
import type {
  Element,
  ElementContent,
  Properties,
  Root as HastRoot,
} from 'hast';
import type { Paragraph, Root as MdastRoot } from 'mdast';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';

import { config } from '../config';
import { markdown } from '../markdown.config';

const blockNames: Record<string, string> = markdown.callouts;
const segmenter = new Intl.Segmenter('en', { granularity: 'word' });

function element(
  tagName: string,
  properties: Properties = {},
  children: ElementContent[] = [],
): Element {
  return { type: 'element', tagName, properties, children };
}

function text(value: string) {
  return { type: 'text' as const, value };
}

export const remarkReadingTime: RemarkPlugin<[]> = () => (tree, file) => {
  const frontmatter = file.data.astro?.frontmatter;
  if (!frontmatter) return;

  const fragments: string[] = [];
  visit(tree, (node) => {
    if (node.type === 'text' || node.type === 'inlineCode') {
      fragments.push(node.value);
    } else if (
      node.type === 'paragraph' ||
      node.type === 'heading' ||
      node.type === 'tableCell' ||
      node.type === 'break'
    ) {
      fragments.push(' ');
    }
  });
  const text = fragments.join('');
  const chinese = text.match(/\p{Script=Han}/gu)?.length ?? 0;
  const others = text.replace(/\p{Script=Han}/gu, ' ');
  let words = 0;
  for (const { isWordLike } of segmenter.segment(others)) {
    if (isWordLike) words++;
  }

  frontmatter.readingMinutes = Math.max(
    1,
    Math.ceil(chinese / 500 + words / 200),
  );
};

function remarkCallouts() {
  return (tree: MdastRoot) => {
    visit(tree, 'containerDirective', (node) => {
      const { name, children, attributes } = node;
      const label = blockNames[name];
      if (!Object.hasOwn(blockNames, name) || !label) return;

      const details = name === 'details';
      const data = node.data ?? (node.data = {});
      data.hName = details ? 'details' : 'div';
      data.hProperties = { className: ['custom-block', name] };
      if (details && Object.hasOwn(attributes ?? {}, 'open')) {
        data.hProperties.open = true;
      }

      const [first] = children;
      const customTitle =
        first?.type === 'paragraph' && first.data?.directiveLabel
          ? first
          : undefined;
      const body = customTitle ? children.slice(1) : children;
      if (!details && attributes?.['no-title'] === '') {
        node.children = body;
        return;
      }

      const title: Paragraph = {
        type: 'paragraph',
        data: {
          hName: details ? 'summary' : 'p',
          hProperties: details
            ? undefined
            : { className: ['custom-block-title'] },
        },
        children: customTitle?.children ?? [{ type: 'text', value: label }],
      };
      node.children = [title, ...body];
    });
  };
}

function remarkCodeFences() {
  return (tree: MdastRoot) => {
    visit(tree, 'code', (node) => {
      // Markdown treats a compact fence like ts{1}:line-numbers as a language.
      const language = node.lang?.match(/^[^\s:{[]+/)?.[0] ?? '';
      const options = node.lang?.slice(language.length);
      node.lang = language || null;
      node.meta = [options, node.meta].filter(Boolean).join(' ') || null;
    });

    visit(tree, 'containerDirective', (node) => {
      if (node.name !== 'code-group') return;
      const data = node.data ?? (node.data = {});
      data.hName = 'div';
      data.hProperties = { className: ['vp-code-group'] };
    });
  };
}

export const sharedRemarkPlugins = [
  remarkMath,
  remarkDirective,
  remarkCallouts,
  remarkCodeFences,
];

export function rehypeVitePressCode() {
  function iconLabel(title: string) {
    const label = title.toLowerCase();
    const filename = label.split('/').at(-1) ?? label;
    return (
      markdown.codeIconLabels.find((key) =>
        key.startsWith('.') ? filename.endsWith(key) : filename === key,
      ) ?? label
    );
  }

  return (tree: HastRoot) => {
    const fences = new WeakMap<
      Element,
      { title: string | undefined; language: string }
    >();

    visit(tree, 'element', (node, index, parent) => {
      const language = node.properties.dataLanguage;
      if (
        node.tagName !== 'pre' ||
        typeof language !== 'string' ||
        index === undefined ||
        !parent
      )
        return;

      const meta = String(node.properties.dataCodeFence ?? '');
      delete node.properties.dataCodeFence;
      const title = meta.match(/\[([^\]]+)\]/)?.[1]?.trim();
      const options = meta.replace(/\[[^\]]*\]/g, '');
      const numbers = options.match(/:line-numbers(?:=(\d+))?(?![\w=-])/);
      const label = language === 'plaintext' ? '' : language;
      const className = [`language-${label || 'txt'}`];
      const wrapper = element('div', { className, dir: 'ltr' }, [
        element('button', {
          type: 'button',
          className: ['copy'],
          title: markdown.copy,
          ariaLabel: markdown.copy,
          dataCopied: markdown.copied,
        }),
        element('span', { className: ['lang'] }, [text(label)]),
        node,
      ]);
      if (numbers) {
        const code = node.children.find(
          (child) => child.type === 'element' && child.tagName === 'code',
        );
        const lines =
          code?.type === 'element'
            ? code.children.filter(
                (child) => child.type === 'element' && child.tagName === 'span',
              )
            : [];
        const start = Number(numbers[1] ?? 1);
        className.push('line-numbers-mode');
        wrapper.children.push(
          element(
            'div',
            {
              className: ['line-numbers-wrapper'],
              ariaHidden: 'true',
            },
            lines.flatMap((_, line) => [
              element('span', { className: ['line-number'] }, [
                text(String(start + line)),
              ]),
              element('br'),
            ]),
          ),
        );
      }
      fences.set(wrapper, {
        title: title || undefined,
        language: label || 'txt',
      });
      parent.children[index] = wrapper;
      return SKIP;
    });

    let groupIndex = 0;
    visit(tree, 'element', (node, index, parent) => {
      const fileTitle = fences.get(node)?.title;
      if (fileTitle && index !== undefined && parent) {
        parent.children[index] = element(
          'div',
          { className: ['vp-code-block-title'] },
          [
            element('div', { className: ['vp-code-block-title-bar'] }, [
              element(
                'span',
                {
                  className: ['vp-code-block-title-text'],
                  dataTitle: iconLabel(fileTitle),
                },
                [text(fileTitle)],
              ),
            ]),
            node,
          ],
        );
        return SKIP;
      }

      if (
        node.tagName !== 'div' ||
        !Array.isArray(node.properties.className) ||
        !node.properties.className.includes('vp-code-group')
      )
        return;

      const blocks = node.children.filter(
        (child) => child.type !== 'text' || child.value.trim(),
      );
      if (
        !blocks.length ||
        !blocks.every(
          (block): block is Element =>
            block.type === 'element' && fences.has(block),
        )
      ) {
        delete node.properties.className;
        return;
      }

      const name = `markdown-code-group-${++groupIndex}`;
      const tabs = blocks.flatMap((block, index) => {
        const tabId = `${name}-tab-${index + 1}`;
        const panelId = `${name}-panel-${index + 1}`;
        const fence = fences.get(block);
        const title = fence?.title ?? fence?.language ?? 'txt';
        fences.delete(block);
        const active = index === 0;
        block.properties.id = panelId;
        if (active && Array.isArray(block.properties.className))
          block.properties.className.push('active');
        return [
          element('input', {
            type: 'radio',
            name,
            id: tabId,
            checked: active,
            ariaControls: [panelId],
            dataCodeTab: panelId,
          }),
          element('label', { htmlFor: [tabId], dataTitle: iconLabel(title) }, [
            text(title),
          ]),
        ];
      });
      node.children = [
        element('div', { className: ['tabs'] }, tabs),
        element('div', { className: ['blocks'] }, blocks),
      ];
      return undefined;
    });
  };
}

function rehypeAbsoluteUrls({ baseUrl }: { baseUrl: string }) {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node) => {
      for (const key of ['href', 'src']) {
        const value = node.properties[key];
        if (typeof value === 'string') {
          node.properties[key] = URL.parse(value, baseUrl)?.href ?? value;
        }
      }
    });
  };
}

export async function renderFeedContent(
  source: string,
  baseUrl: string = config.url,
) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(sharedRemarkPlugins)
    .use(remarkRehype)
    .use(rehypeKatex, { output: 'mathml' })
    .use(rehypeAbsoluteUrls, { baseUrl })
    .use(rehypeStringify)
    .process(source);
  return String(file);
}
