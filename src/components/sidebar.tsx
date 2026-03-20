"use client";

import { Button } from "@/components/ui/button";
import { socialIcons } from "@/constants/images";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LeftSidebarProps {
	activeSection: string;
}

const navItems = [
	{ id: "about", label: "About" },
	{ id: "experience", label: "Experience" },
	{ id: "projects", label: "Projects" },
];

const socialLinks = [
	{ icon: socialIcons.github, href: "https://github.com", label: "GitHub" },
	{ icon: socialIcons.linkedin, href: "https://linkedin.com", label: "LinkedIn" },
	{ icon: socialIcons.instagram, href: "https://instagram.com", label: "Instagram" },
	{ icon: socialIcons.twitter, href: "https://twitter.com", label: "Twitter" },
];

export default function Sidebar({ activeSection }: LeftSidebarProps) {
	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView();
		}
	};

	return (
		<header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[48%] lg:flex-col lg:justify-between lg:py-24">
			<div>
				<h1 className="text-foreground text-4xl font-bold tracking-wide sm:text-5xl">
					<Link href="/" className="text-primary transition-colors">
						Ritik Tiwari
					</Link>
				</h1>
				<h2 className="text-foreground mt-3 text-lg font-medium tracking-tight sm:text-xl">
					Software Engineer
				</h2>
				<p className="text-muted-foreground mt-4 max-w-xs leading-normal">
					I build accessible, high-performance digital experiences for the web and mobile.
				</p>

				<nav className="nav hidden lg:block" aria-label="In-page jump links">
					<ul className="mt-16 w-max">
						{navItems.map((item) => (
							<li key={item.id}>
								<Button
									variant="link"
									onClick={() => scrollToSection(item.id)}
									className={cn(
										"group flex items-center py-3 no-underline! transition-all",
										{
											active: activeSection === item.id,
										}
									)}
									aria-current={activeSection === item.id ? "true" : undefined}
								>
									<span
										className={cn(
											"group-hover:bg-foreground group-focus-visible:bg-foreground mr-4 h-px transition-all group-hover:w-16 group-focus-visible:w-16 motion-reduce:transition-none",
											activeSection === item.id
												? "bg-foreground w-16"
												: "bg-foreground/30 w-8"
										)}
									/>
									<span
										className={cn(
											"group-hover:text-foreground group-focus-visible:text-foreground text-xs font-bold tracking-widest uppercase transition-colors",
											activeSection === item.id
												? "text-foreground"
												: "text-foreground/50"
										)}
									>
										{item.label}
									</span>
								</Button>
							</li>
						))}
					</ul>
				</nav>
			</div>

			{/* Social Links */}
			<ul className="mt-8 ml-1 flex items-center gap-5" aria-label="Social media">
				{socialLinks.map((social) => (
					<li key={social.label} className="shrink-0 text-xs">
						<Link
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-foreground hover:text-primary block transition-colors"
							aria-label={`${social.label} (opens in a new tab)`}
						>
							<span
								aria-hidden="true"
								className="block h-6 w-6 bg-current transition-colors"
								style={{
									WebkitMaskImage: `url(${social.icon.src})`,
									maskImage: `url(${social.icon.src})`,
									WebkitMaskRepeat: "no-repeat",
									maskRepeat: "no-repeat",
									WebkitMaskPosition: "center",
									maskPosition: "center",
									WebkitMaskSize: social.icon.maskSize,
									maskSize: social.icon.maskSize,
								}}
							/>
						</Link>
					</li>
				))}
			</ul>
		</header>
	);
}
