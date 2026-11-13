import { writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

import { cancel, intro, isCancel, outro, text } from '@clack/prompts';
import { format, resolveConfig } from 'prettier';
import { stringify } from 'yaml';

const usage = `
Usage
  pnpm post
  pnpm post <title> [filename]
  pnpm post --title <title> [--filename <filename>]
`;

const path = 'src/content/posts';
const dir = resolve(import.meta.dirname, '..', path);

function filenameFromTitle(title) {
  if (/[^\x20-\x7e\s\p{P}]/u.test(title)) return;
  return title
    .toLowerCase()
    .replace(/['’]/gu, '')
    .match(/[a-z0-9]+/g)
    ?.join('-');
}

function filenameWithoutExtension(filename) {
  return filename?.trim().replace(/\.md$/, '');
}

function validateFilename(name) {
  if (!name) return 'Enter a filename.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    return 'Use lowercase letters, digits, and single hyphens between words.';
  }
}

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      title: { type: 'string' },
      filename: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: true,
  });

  if (values.help) return console.log(usage);

  const [titleArg, filenameArg] = positionals;
  if (
    positionals.length > 2 ||
    (values.title !== undefined && titleArg !== undefined) ||
    (values.filename !== undefined && filenameArg !== undefined)
  ) {
    throw new Error(`Provide at most one title and one filename.\n${usage}`);
  }

  let title = (values.title ?? titleArg)?.trim();
  let name = filenameWithoutExtension(values.filename ?? filenameArg);

  let suggestedName = title ? filenameFromTitle(title) : undefined;
  const interactive = !title || (!name && !suggestedName);
  if (interactive && (!process.stdin.isTTY || !process.stdout.isTTY)) {
    throw new Error(
      `Pass the title and any required filename as arguments.\n${usage}`,
    );
  }

  if (interactive) intro('New draft');
  if (!title) {
    const answer = await text({
      message: 'Title',
      placeholder: 'My First Post',
      validate: (value) => (value?.trim() ? undefined : 'Enter a title.'),
    });
    if (isCancel(answer)) return cancel('Canceled');
    title = answer.trim();
    suggestedName = filenameFromTitle(title);
  }

  if (!name && interactive) {
    const answer = await text({
      message: suggestedName ? 'Filename (edit or press Enter)' : 'Filename',
      placeholder: 'my-first-post',
      initialValue: suggestedName,
      validate: (value) => validateFilename(filenameWithoutExtension(value)),
    });
    if (isCancel(answer)) return cancel('Canceled');
    name = filenameWithoutExtension(answer);
  }

  name ??= suggestedName;
  const error = validateFilename(name);
  if (error) throw new Error(error);

  const filename = `${name}.md`;
  const filepath = join(dir, filename);
  const frontmatter = stringify(
    { title, description: 'Please provide a summary of the article.' },
    { customTags: ['timestamp'], lineWidth: 0 },
  );
  const draft = `---
${frontmatter}published: ${new Date().toISOString()}
tags: []
draft: true
---
`;
  const markdown = await format(draft, {
    ...(await resolveConfig(filepath)),
    filepath,
  });

  await writeFile(filepath, markdown, { flag: 'wx' }).catch((error) => {
    if (error.code === 'EEXIST')
      throw new Error(`File "${filename}" already exists.`);
    throw error;
  });

  const message = `Draft created at ${path}/${filename}`;
  if (interactive) outro(message);
  else console.log(`\n${message}\n`);
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  process.exitCode = 1;
});
