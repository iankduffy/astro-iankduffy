import type { PortableTextBlock } from 'sanity';

export async function getContentHeader(content: PortableTextBlock[]) {
	return content?.filter(
		(block) => typeof block.style === 'string' && /^h\d/.test(block.style)
	);
}
