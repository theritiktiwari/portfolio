import { images } from "@/constants/images";
import { projects } from "@/data/projects";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProjectsSection() {
	return (
		<section
			id="projects"
			className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
			aria-label="Selected projects"
		>
			<div className="bg-background/75 sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
				<h2 className="text-foreground text-sm font-bold tracking-widest uppercase lg:sr-only">
					Projects
				</h2>
			</div>

			<div>
				<ul className="group/list space-y-12">
					{projects.map((project) => {
						const projectLink = project.url || project.repository;
						return (
							<li key={project.title}>
								<div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:group-hover/list:opacity-50 lg:hover:opacity-100!">
									<div className="lg:group-hover:bg-card/50 absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-[10px] transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-xl" />

									<div className="z-10 sm:order-2 sm:col-span-6">
										<h3>
											{projectLink && (
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
											)}
										</h3>

										<p className="text-muted-foreground mt-2 text-sm leading-6">
											{project.description}
										</p>

										{project.stars ? (
											<Link
												href={project.repository ?? project.url ?? "#"}
												target="_blank"
												rel="noopener noreferrer"
												className="text-muted-foreground hover:text-primary relative mt-2 inline-flex items-center text-sm font-medium"
											>
												<Star className="mr-1 h-3 w-3" />
												<span>{project.stars.toLocaleString()}</span>
											</Link>
										) : null}

										<ul
											className="mt-2 flex flex-wrap"
											aria-label="Technologies used"
										>
											{project.technologies.map((tech) => (
												<li key={tech} className="mt-2 mr-1.5">
													<div className="bg-primary/10 text-primary flex items-center rounded-full px-3 py-1 text-xs leading-5 font-medium">
														{tech}
													</div>
												</li>
											))}
										</ul>
									</div>

									<div className="z-10 sm:order-1 sm:col-span-2">
										<div className="border-muted/20 bg-card group-hover:border-muted/40 aspect-video overflow-hidden rounded border-2 transition">
											<Image
												src={project.image || images.placeholder}
												alt={`Screenshot of ${project.title}`}
												width={200}
												height={112}
												className="size-full object-cover"
											/>
										</div>
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
