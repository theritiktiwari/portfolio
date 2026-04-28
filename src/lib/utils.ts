import type { BlogCardProps } from "@/components/blog-card";
import type { Achievement } from "@/content/achievements";
import type { ImageMetadata } from "astro";
import type { CollectionEntry } from "astro:content";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatDate = ({
	date,
	locale = "en-US",
	options,
}: {
	date: Date;
	locale?: string;
	options?: Intl.DateTimeFormatOptions;
}): string => {
	return date.toLocaleDateString(locale, {
		year: "numeric",
		month: "short",
		...options,
	});
};

/**
 * Easing function for smooth scrolling animation (easeInOutCubic).
 *
 * @param t - The current time (progress) of the animation, normalized between 0 and 1.
 * @returns The eased value corresponding to the input time.
 */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Smoothly scrolls the page to a specific section identified by its ID.
 *
 * @param sectionId - The ID of the target section to scroll to.
 * @param duration - The duration of the scrolling animation in milliseconds (default is 800ms).
 */
export function smoothScrollTo(sectionId: string, duration = 800) {
	const element = document.getElementById(sectionId);
	if (!element) return;

	const targetY = element.getBoundingClientRect().top + window.scrollY;
	const startY = window.scrollY;
	const distance = targetY - startY;
	let startTime: number | null = null;

	const step = (timestamp: number) => {
		if (startTime === null) startTime = timestamp;
		const progress = Math.min((timestamp - startTime) / duration, 1);
		window.scrollTo(0, startY + distance * easeInOutCubic(progress));
		if (progress < 1) requestAnimationFrame(step);
	};

	requestAnimationFrame(step);
}

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

/**
 * Extracts the GitHub repository name from a given URL.
 *
 * @param url - The URL of the GitHub repository.
 * @returns The repository name in the format "/repo-name" or full-url if the URL is invalid or not a GitHub URL.
 */
export const getGitHubRepoPath = (url: string): string | null => {
	try {
		const { hostname, pathname } = new URL(url);
		if (hostname !== "github.com") return url;
		const repo = pathname.split("/")[2];
		return repo ? repo : url;
	} catch {
		return url;
	}
};

/**
 * Returns the value of a URL search parameter.
 * Returns null when called server-side (no window).
 */
export function getURLParam(key: string): string | null {
	if (typeof window === "undefined") return null;
	return new URLSearchParams(window.location.search).get(key);
}

/**
 * Updates URL search parameters in-place using history.replaceState.
 * Pass `null` as a value to delete that parameter from the URL.
 */
export function setURLParams(updates: Record<string, string | null>): void {
	if (typeof window === "undefined") return;
	const params = new URLSearchParams(window.location.search);
	for (const [key, value] of Object.entries(updates)) {
		if (value === null) params.delete(key);
		else params.set(key, value);
	}
	const qs = params.toString();
	history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
}

/**
 * Estimates reading time for blog post content.
 * Strips MDX/HTML tags and frontmatter before counting words.
 *
 * @param rawContent - Raw markdown/MDX string content
 * @returns Reading time in minutes (minimum 1)
 */
export function readingTime(rawContent: string): number {
	const stripped = rawContent
		.replace(/---[\s\S]*?---/, "") // frontmatter
		.replace(/import\s+.*?from\s+['"].*?['"]/g, "") // MDX imports
		.replace(/<[^>]+>/g, " ") // HTML/JSX tags
		.replace(/```[\s\S]*?```/g, " ") // code blocks
		.replace(/`[^`]+`/g, " ") // inline code
		.replace(/[#*_~[\]()>|!]/g, " ") // markdown syntax
		.replace(/\s+/g, " ")
		.trim();

	const wordCount = stripped.split(" ").filter(Boolean).length;
	return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Checks if a blog post should be publicly visible.
 * In dev mode, drafts are shown; in production they are hidden.
 *
 * @param draft - Whether the post is marked as a draft
 * @returns True if the post should be shown, false otherwise
 */
export function isPublished(draft: boolean): boolean {
	return !draft || import.meta.env.DEV;
}

export function getRelatedPosts(
	currentPost: CollectionEntry<"blog">,
	allPosts: CollectionEntry<"blog">[],
	limit = 3
): BlogCardProps[] {
	if (currentPost.data.series) return [];

	const currentTags = new Set(currentPost.data.tags);

	return allPosts
		.filter(
			(p) =>
				isPublished(p.data.draft) &&
				p.id !== currentPost.id &&
				!p.data.series &&
				p.data.tags.some((t) => currentTags.has(t))
		)
		.map((p) => ({
			post: p,
			sharedTags: p.data.tags.filter((t) => currentTags.has(t)).length,
		}))
		.sort(
			(a, b) =>
				b.sharedTags - a.sharedTags ||
				b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime()
		)
		.slice(0, limit)
		.map(({ post }) => ({
			id: post.id,
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			tags: post.data.tags,
			readingTime: readingTime(post.body ?? ""),
			heroImage: post.data.heroImage?.src,
			series: post.data.series,
		}));
}
