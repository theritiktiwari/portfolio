import { experiences } from "@/data/experience";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ExperienceSection() {
	return (
		<section
			id="experience"
			className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
			aria-label="Work experience"
		>
			<div className="bg-background/75 sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
				<h2 className="text-foreground text-sm font-bold tracking-widest uppercase lg:sr-only">
					Experience
				</h2>
			</div>

			<div>
				<ol className="group/list space-y-12">
					{experiences.map((exp, index) => (
						<li key={index}>
							<div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:group-hover/list:opacity-50 lg:hover:opacity-100!">
								<div className="lg:group-hover:bg-card/50 absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-[10px] transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-xl" />

								<header className="text-muted-foreground z-10 mt-1 mb-2 text-xs font-semibold tracking-wide uppercase sm:col-span-2">
									{exp.period}
								</header>

								<div className="z-10 sm:col-span-6">
									<h3>
										<Link
											href={exp.companyUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-foreground hover:text-primary focus-visible:text-primary group/link inline-flex items-baseline leading-tight font-medium"
										>
											<span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded-[10px] md:-inset-x-6 md:-inset-y-4 lg:block" />
											<span>
												{exp.title}{" "}
												<span className="inline-block">
													{exp.company && `· ${exp.company}`}
													<ArrowUpRight className="ml-1 inline-block size-4 shrink-0 translate-y-px transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-focus-visible/link:translate-x-1 group-focus-visible/link:-translate-y-1 motion-reduce:transition-none" />
												</span>
											</span>
										</Link>
									</h3>

									<p className="text-muted-foreground mt-2 text-sm leading-6">
										{exp.description}
									</p>

									<ul
										className="mt-2 flex flex-wrap"
										aria-label="Technologies used"
									>
										{exp.technologies.map((tech) => (
											<li key={tech} className="mt-2 mr-1.5">
												<div className="bg-primary/10 text-primary flex items-center rounded-full px-3 py-1 text-xs leading-5 font-medium">
													{tech}
												</div>
											</li>
										))}
									</ul>
								</div>
							</div>
						</li>
					))}
				</ol>

				<div className="mt-12">
					<Link
						href="/resume.pdf"
						target="_blank"
						rel="noopener noreferrer"
						className="text-foreground hover:text-primary focus-visible:text-primary group/link inline-flex items-baseline leading-tight font-bold"
					>
						<span>
							View Full Resume
							<ArrowUpRight className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-focus-visible/link:translate-x-1 group-focus-visible/link:-translate-y-1 motion-reduce:transition-none" />
						</span>
					</Link>
				</div>
			</div>
		</section>
	);
}
