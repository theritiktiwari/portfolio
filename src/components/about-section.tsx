import Link from "next/link";

export default function AboutSection() {
	return (
		<section
			id="about"
			className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
			aria-label="About me"
		>
			<div className="bg-background/75 sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
				<h2 className="text-foreground text-sm font-bold tracking-widest uppercase lg:sr-only">
					About
				</h2>
			</div>

			<div className="text-muted-foreground space-y-4">
				<p>
					I&apos;m a{" "}
					<span className="text-foreground font-semibold">Software Engineer</span>{" "}
					specializing in architecting scalable SaaS and high-availability systems. I
					thrive at the intersection of complex backend logic and high-performance product
					engineering, where robust architecture meets seamless, user-centric solutions.
				</p>
				<p>
					I&apos;m a software engineer at{" "}
					<Link
						href="https://rtcamp.com/"
						rel="noopener noreferrer"
						target="_blank"
						className="text-foreground hover:text-primary focus-visible:text-primary font-semibold transition-colors"
					>
						rtCamp
					</Link>
					, where I worked on{" "}
					<Link
						href="https://webauditor.io/"
						rel="noopener noreferrer"
						target="_blank"
						className="text-foreground hover:text-primary focus-visible:text-primary font-semibold transition-colors"
					>
						Web Auditor
					</Link>{" "}
					a platform designed to monitor and audit website performance. In this project, I
					architected multi-tenant structures, modular APIs and built the{" "}
					<span className="text-foreground font-semibold">entire frontend</span>. Beyond
					that, I handle the{" "}
					<span className="text-foreground font-semibold">CI/CD pipelines</span>,{" "}
					<span className="text-foreground font-semibold">payment integrations</span>, and
					email systems, while constantly optimizing the platform to maintain{" "}
					<span className="text-foreground font-semibold">99.9% uptime</span> as our user
					base grows.
				</p>
				<p>
					I&apos;ve also worked on a variety of digital products, handling everything from
					payment integrations and subscription logic to managing production environments.
					I focus on writing defensive, maintainable code that solves real technical
					problems without adding unnecessary complexity.
				</p>
				<p>
					When I&apos;m not working, you can generally find me working on{" "}
					<span className="text-foreground font-semibold">FinLink</span>, a personal
					project I&apos;m building to track net-worth automatically, or at the{" "}
					<span className="inline-block">
						<span className="group relative inline-flex">
							<span className="text-foreground cursor-help font-semibold">gym</span>
							<span className="pointer-events-none absolute top-full left-1/2 mb-2 -translate-x-1/2 opacity-0 transition-all group-hover:mt-3 group-hover:opacity-100">
								<span className="bg-card text-card-foreground border-border block rounded border px-2 py-1 text-xs whitespace-nowrap shadow-xl">
									You found me! &#127947;
									{/* Pushing for a new PR! &#127947; */}
								</span>
							</span>
						</span>
					</span>{" "}
					focusing on my fitness objectives.
				</p>
			</div>
		</section>
	);
}
