import { CardHoverEffect } from "@/components/ui/card-hover-effect";
import { CustomImage } from "@/components/ui/custom-image";
import { SectionHeader } from "@/components/ui/section-header";
import { TagList } from "@/components/ui/tag-list";
import { projects } from "@/data/projects";
import { ArrowRight, ArrowUpRight, Download, Star } from "lucide-react";
import Link from "next/link";

export default function ProjectsSection() {
	const featuredProjects = projects.filter((project) => project.featured);

	return (
		<section
			id="projects"
			className="scroll-mt-16 lg:scroll-mt-24"
			aria-label="Selected projects"
		>
			<SectionHeader title="Projects" />

			<div>
				<ul className="group/list space-y-12">
					{featuredProjects.map((project) => {
						const projectLink = project.url || project.repository;

						return (
							<li key={project.title}>
								<div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:group-hover/list:opacity-50 lg:hover:opacity-100!">
									<CardHoverEffect />

									<div className="z-10 sm:order-2 sm:col-span-6">
										<h3>
											{projectLink ? (
												<Link
													href={projectLink}
													target="_blank"
													rel="noopener noreferrer"
													className="text-foreground hover:text-primary focus-visible:text-primary group/link inline-flex items-baseline leading-tight font-medium"
												>
													<span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded-[10px] md:-inset-x-6 md:-inset-y-4 lg:block" />
													<span>
														{project.title}
														<ArrowUpRight className="ml-1 inline-block size-4 shrink-0 translate-y-px transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-focus-visible/link:translate-x-1 group-focus-visible/link:-translate-y-1 motion-reduce:transition-none" />
													</span>
												</Link>
											) : (
												<span className="text-foreground leading-tight font-medium">
													{project.title}
												</span>
											)}
										</h3>

										<p className="text-muted-foreground mt-2 text-sm leading-6">
											{project.description}
										</p>

										<div className="flex gap-3">
											{project.stars ? (
												<div className="text-muted-foreground hover:text-primary relative mt-2 inline-flex items-center text-sm font-medium">
													<Star className="mr-1 size-4" />
													<span>{project.stars.toLocaleString()}</span>
												</div>
											) : null}

											{project.downloads ? (
												<div className="text-muted-foreground hover:text-primary relative mt-2 inline-flex items-center text-sm font-medium">
													<Download className="mr-1 size-4" />
													<span>
														{project.downloads.toLocaleString()}
													</span>
												</div>
											) : null}
										</div>

										<TagList
											items={project.technologies}
											label="Technologies used"
											className="mt-2"
											itemClassName="mt-2 mr-1.5"
										/>
									</div>

									<div className="z-10 sm:order-1 sm:col-span-2">
										<CustomImage
											src={project.image}
											alt={`Screenshot of ${project.title}`}
										/>
									</div>
								</div>
							</li>
						);
					})}
				</ul>

				<div className="mt-12">
					<Link
						href="/projects"
						className="text-foreground hover:text-primary focus-visible:text-primary group/link inline-flex items-center leading-tight font-bold"
					>
						<span>View All Projects</span>
						<ArrowRight className="ml-1 inline-block size-4 shrink-0 -translate-y-px transition-transform group-hover/link:translate-x-2 group-focus-visible/link:translate-x-2 motion-reduce:transition-none" />
					</Link>
				</div>
			</div>
		</section>
	);
}
