"use client";

import { Button } from "@/components/ui/button";
import { MaskedIcon } from "@/components/ui/masked-icon";
import { navLinks, socialLinks } from "@/constants/links";
import { useActiveSection } from "@/hooks/use-active-section";
import { smoothScrollTo } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";
import Link from "next/link";

const sectionIds = navLinks.map((link) => link.id);

export default function Sidebar() {
	const activeSection = useActiveSection(sectionIds);

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
					I build high-performance experiences for the web and mobile.
				</p>
				<p className="border-border bg-background/50 mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur-sm">
					<span className="relative flex size-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
						<span className="relative inline-flex size-2 rounded-full bg-green-400" />
					</span>
					Available for new opportunities
				</p>

				<nav className="nav hidden lg:block" aria-label="In-page jump links">
					<ul className="mt-16 w-max">
						{navLinks.map((item) => (
							<li key={item.id}>
								<Button
									variant="link"
									onClick={() => smoothScrollTo(item.id)}
									className={cn(
										"group my-1 flex items-center py-3 pl-0 no-underline! transition-all",
										{ active: activeSection === item.id }
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
												: "text-foreground/60"
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
				{socialLinks.map((social) => {
					const iconNode = (
						<MaskedIcon
							src={social.icon.src}
							maskSize={social.icon.maskSize}
							className="size-6"
						/>
					);

					return (
						<li key={social.label} className="flex shrink-0 items-center text-xs">
							{"tooltip" in social && social.tooltip ? (
								<span className="group relative inline-flex">
									<Link
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className="text-foreground hover:text-primary block transition-colors"
										aria-label={social.label}
									>
										{iconNode}
									</Link>
									<span className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 opacity-0 transition-all group-hover:opacity-100">
										<span className="bg-card text-card-foreground border-border block w-56 rounded border px-3 py-2 text-xs leading-relaxed shadow-xl">
											{social.tooltip}
										</span>
									</span>
								</span>
							) : (
								<Link
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-foreground hover:text-primary block transition-colors"
									aria-label={`${social.label} (opens in a new tab)`}
								>
									{iconNode}
								</Link>
							)}
						</li>
					);
				})}
			</ul>
		</header>
	);
}
