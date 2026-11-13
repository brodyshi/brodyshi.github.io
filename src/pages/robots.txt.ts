import { config } from '../config';

export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${config.url}/sitemap-index.xml\n`,
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    },
  );
}
