import type { Image, PortableTextBlock, Slug } from 'sanity';
import { sanityClient } from 'sanity:client';

export interface Article {
	_createdAt: string;
	_id: string;
	_rev: string;
	_type: string;
	_updated: string;
	description: string;
	slug: Slug;
	title: string;
	estimatedReadingTime: number | null;
	content: PortableTextBlock[];
	publishedDate: string;
	socialImage: Image;
}

export const getAllArticlesSlug = async (): Promise<
	{ params: { slug: string } }[]
> => {
	const articlesSlugs = await sanityClient.fetch(
		`*[_type == "articles"]{"params": {"slug": slug.current}}`
	);
	return articlesSlugs;
};

export const allArticlesQuery = `*[_type == "articles"] { 
  ...,
  'articleTags': tags[]->tagName,
  "estimatedReadingTime": round(length(pt::text(content)) / 5 / 180 )
} |  order(publishedDate desc)`;

export const getAllArticles = async (): Promise<Article[]> => {
	const articles = await sanityClient.fetch(allArticlesQuery);

	return articles;
};

export const articleFromSlugQuery = `*[_type == "articles" && slug.current == $slug][0] {
  ...,
  "estimatedReadingTime": round(length(pt::text(content)) / 5 / 180 ),
  content[]{
    ...,
    video {
      asset->{...}
    }
  }
}`;

export const getArticleFromSlug = async (slug: string): Promise<Article> => {
	const article = await sanityClient.fetch(articleFromSlugQuery, { slug });

	return article;
};
