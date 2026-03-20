import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Ritik Tiwari | Software Engineer",
	description:
		"Software Engineer dedicated to crafting seamless digital experiences. I bridge the gap between complex backend architecture and intuitive user interfaces, currently building automated wealth-tracking solutions.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn(
				"h-full",
				"antialiased",
				geistSans.variable,
				geistMono.variable,
				"font-sans"
			)}
		>
			<body className="flex min-h-screen flex-col">{children}</body>
		</html>
	);
}
