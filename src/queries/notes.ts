import type { PortableTextBlock, Slug } from 'sanity';
import { sanityClient } from 'sanity:client';

export interface Notes {
	_createdAt: string;
	_id: string;
	_rev: string;
	_type: string;
	_updated: string;
	slug: Slug;
	title: string;
	content: PortableTextBlock[];
	publishedDate: string;
	articleTags: string[] | null;
}

// export const getAllArticlesSlug = async (): Promise<
// 	{ params: { slug: string } }[]
// > => {
// 	const articlesSlugs = await sanityClient.fetch(
// 		`*[_type == "notes"]{"params": {"slug": slug.current}}`
// 	);
// 	return articlesSlugs;
// };

export const allNotesQuery = `*[_type == "notes"] {
  ...,
  'articleTags': tags[]->tagName,
} |  order(publishedDate desc)`;

export const getAllNotes = async (): Promise<Notes[]> => {
	const notes = await sanityClient.fetch(allNotesQuery);

	return notes;
};

// export const allArticleCategoriesQuery = `*[_type == "articleTags"] { tagName } `;

// export const getAllArticleCategories = async (): Promise<string[]> => {
// 	const categories = await sanityClient.fetch(allArticleCategoriesQuery);

// 	return categories.map((category: { tagName: string }) => category.tagName);
// };

// export const articleFromSlugQuery = `*[_type == "articles" && slug.current == $slug][0] {
//   ...,
//   "estimatedReadingTime": round(length(pt::text(content)) / 5 / 180 ),
//   content[]{
//     ...,
//     video {
//       asset->{...}
//     }
//   }
// }`;

// export const getArticleFromSlug = async (slug: string): Promise<Notes> => {
// 	const article = await sanityClient.fetch(articleFromSlugQuery, { slug });

// 	return article;
// };
