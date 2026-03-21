import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Achievements",
	description:
		"A full archive of achievements, certifications, and recognitions earned by Ritik Tiwari.",
};

export default function AchievementsLayout({ children }: { children: React.ReactNode }) {
	return children;
}
