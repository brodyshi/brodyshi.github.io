export default {
  '*.{astro,ts,js,mjs,md,json,jsonc}': ['eslint --fix', 'prettier --write'],
  '*.{css,yml,yaml}': 'prettier --write',
};
