import MouseGlow from "@/components/mouse-glow";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";
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
			<body className="flex min-h-screen flex-col">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem={false}
					disableTransitionOnChange
				>
					<div className="relative min-h-screen">
						<MouseGlow />
						<ThemeToggle className="fixed top-3 right-3 z-100" />
						<div className="mx-auto min-h-screen max-w-7xl px-6 py-12 md:px-12 md:py-16 lg:py-0">
							<a
								href="#content"
								className="bg-accent text-accent-foreground absolute top-0 left-0 block -translate-x-full rounded px-4 py-3 text-sm font-bold tracking-widest uppercase focus-visible:translate-x-0"
							>
								Skip to Content
							</a>
							{children}
						</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
