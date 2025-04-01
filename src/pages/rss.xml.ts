import rss from '@astrojs/rss';
import { getAllArticles } from '../queries/articles';
import type { AstroConfig } from 'astro';
import { toHTML } from '@portabletext/to-html';
import { components } from '../features/article/components/article-body/ArticleBody.astro';

export async function GET() {
	const articles = await getAllArticles();
	return rss({
		title: 'Blog | IankDuffy',
		description: 'RSS Feed for IankDuffy',
		site: 'https://iankduffy.com',
		items: articles.map((article) => ({
			title: article.title,
			description: article.description,
			link: `https://www.iankduffy.com/articles/${article.slug.current}`,
			pubDate: new Date(article.publishedDate),
			// content: toHTML(article.content, {
			// 	components: {
			// 		types: {},
			// 		block: {},
			// 		marks: {},
			// 		list: {},
			// 	},
			// }),
		})),
	});
}
