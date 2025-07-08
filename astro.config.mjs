// @ts-check
import { loadEnv } from 'vite';
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';
const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } = loadEnv(
	process.env.NODE_ENV || '',
	process.cwd(),
	''
);

// https://astro.build/config
export default defineConfig({
	site: 'https://iankduffy.com',
	// output: 'hybrid',

	devToolbar: {
		enabled: false,
	},

	integrations: [
		sanity({
			projectId: SANITY_PROJECT_ID,
			dataset: SANITY_DATASET,
			useCdn: true,
			apiVersion: SANITY_API_VERSION,
			// perspective: 'previewDrafts',
			// token: process.env.SANITY_DRAFT_KEY,
		}),
		react({
			include: ['**/react/*'],
		}),
		sitemap({
			filter: (page) =>
				page !== 'https://iankduffy.com/uses/' &&
				page !== 'https://iankduffy.com/snippets/',
		}),
	],

	adapter: netlify(),
});
