# Site conventions

- Use Astro for static pages and native TypeScript for browser interactions. Use Tailwind for layout, VitePress for the palette and prose CSS, and `@tabler/icons-astro` for interface icons.
- Keep the semantic colors in `src/styles/theme.css` backed by VitePress variables. The root `.dark` class drives both Tailwind and VitePress. Scope article overrides to `.vp-doc` in `src/styles/typography.css`.
