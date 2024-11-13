// @ts-check
import { loadEnv } from 'vite';
import { defineConfig } from 'astro/config';
const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } = loadEnv(
	process.env.NODE_ENV || '',
	process.cwd(),
	''
);
import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
	devToolbar: {
		enabled: false,
	},

	integrations: [
		sanity({
			projectId: SANITY_PROJECT_ID,
			dataset: SANITY_DATASET,
			useCdn: true,
			apiVersion: SANITY_API_VERSION,
		}),
	],
});
