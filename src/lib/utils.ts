import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
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
