import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

User-agent: GPTBot
Disallow: /articles/*

User-agent: ClaudeBot
Disallow: /articles/*

User-agent: BardBot
Disallow: /articles/*

User-agent: J1Bot
Disallow: /articles/*

User-agent: CCBot
Disallow: /articles/*

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL('sitemap-index.xml', site);
	return new Response(getRobotsTxt(sitemapURL));
};
