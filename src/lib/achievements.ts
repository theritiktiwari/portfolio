import type { Achievement } from "@/content/achievements";
import type { ImageMetadata } from "astro";

type ResolvedLink = { type: "certificate"; url: ImageMetadata } | { type: "external"; url: string };

export type ResolvedAchievement = Omit<Achievement, "link"> & { link?: ResolvedLink };

/**
 * Resolves all dynamic certificate image imports at build time. Call in .astro frontmatter.
 *
 * @param list List of achievements to resolve.
 * @returns List of achievements with resolved certificate links.
 */
export async function resolveAchievements(list: Achievement[]): Promise<ResolvedAchievement[]> {
	return Promise.all(
		list.map(async (achievement): Promise<ResolvedAchievement> => {
			if (achievement.link?.type !== "certificate") {
				return achievement as ResolvedAchievement;
			}
			const { default: url }: { default: ImageMetadata } = await achievement.link.url;
			return { ...achievement, link: { type: "certificate", url } };
		})
	);
}
