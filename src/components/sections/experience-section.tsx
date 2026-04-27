import { CardHoverEffect } from "@/components/ui/card-hover-effect";
import { SectionHeader } from "@/components/ui/section-header";
import { TagList } from "@/components/ui/tag-list";
import { experiences } from "@/data/experience";
import { ArrowUpRight } from "lucide-react";

export default function ExperienceSection() {
	return (
		<section
			id="experience"
			className="scroll-mt-16 lg:scroll-mt-24"
			aria-label="Work experience"
		>
			<SectionHeader title="Experience" />

			<div>
				<ol className="group/list space-y-12">
					{experiences.map((exp) => (
						<li key={`${exp.company}-${exp.title}`}>
							<div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:group-hover/list:opacity-50 lg:hover:opacity-100!">
								<CardHoverEffect />

								<header className="text-muted-foreground z-10 mt-1 mb-2 text-xs font-semibold tracking-wide uppercase sm:col-span-2">
									{exp.period}
								</header>

								<div className="z-10 sm:col-span-6">
									<h3>
										<a
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
										</a>
									</h3>

									<p className="text-muted-foreground mt-2 text-sm leading-6">
										{exp.description}
									</p>

									<TagList
										items={exp.technologies}
										label="Technologies used"
										className="mt-2"
										itemClassName="mt-2 mr-1.5"
									/>
								</div>
							</div>
						</li>
					))}
				</ol>

				<div className="mt-12">
					<a
						href="/resume.pdf"
						target="_blank"
						rel="noopener noreferrer"
						className="text-foreground hover:text-primary focus-visible:text-primary group/link inline-flex items-baseline leading-tight font-bold"
					>
						<span>
							View Full Resume
							<ArrowUpRight className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-focus-visible/link:translate-x-1 group-focus-visible/link:-translate-y-1 motion-reduce:transition-none" />
						</span>
					</a>
				</div>
			</div>
		</section>
	);
}
