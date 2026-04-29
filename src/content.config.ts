import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const blog = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			author: z.string().optional(),
			heroImage: image().optional(),
			tags: z.array(z.string().transform((t) => t.toLowerCase().trim())).default([]),
			featured: z.boolean().default(false),
			draft: z.boolean().default(false),
			series: z
				.object({
					name: z.string(),
					part: z.number().int().positive(),
				})
				.optional(),
		}),
});

export const collections = { blog };
