import { sanityClient } from 'sanity:client';

export const allArticlesQuery = `*[_type == "articles"] { 
  ...,
  "estimatedReadingTime": round(length(pt::text(content)) / 5 / 180 )
} |  order(publishedDate desc)`;

export const getAllArticles = async () => {
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

export const getArticleFromSlug = async (slug: string) => {
	const article = await sanityClient.fetch(articleFromSlugQuery, { slug });

	return article;
};
