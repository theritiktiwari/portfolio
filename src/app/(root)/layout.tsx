import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const jetBrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-jetbrains-mono",
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
			className={cn("antialiased", inter.variable, jetBrainsMono.variable)}
		>
			<body className="flex min-h-screen flex-col">{children}</body>
		</html>
	);
}
