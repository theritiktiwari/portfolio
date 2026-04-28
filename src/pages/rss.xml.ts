import { isPublished } from "@/lib/utils";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
	const posts = await getCollection("blog");
	const published = posts
		.filter((p) => isPublished(p.data.draft))
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: "Ritik Tiwari — Blog",
		description:
			"Thoughts on software engineering, system design, and the craft of building things.",
		site: context.site!,
		items: published.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
			categories: post.data.tags,
		})),
		customData: `<language>en-us</language>`,
	});
}
