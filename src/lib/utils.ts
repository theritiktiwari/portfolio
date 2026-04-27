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
