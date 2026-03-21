import { socialIcons } from "@/constants/images";
import { projects } from "@/data/projects";
import { getGitHubRepoPath } from "@/lib/utils";
import { ArrowLeft, ArrowUpRight, CircleArrowOutUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "All Projects",
	description:
		"A full archive of projects built by Ritik Tiwari — spanning full-stack web apps, APIs, and open-source contributions.",
};

export default function ArchivePage() {
	return (
		<div className="md:py-20 lg:py-24">
			<Link
				href="/"
				className="group text-primary mb-2 inline-flex items-center leading-tight font-semibold"
			>
				<ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-2" />
				Home
			</Link>

			<h1 className="text-foreground flex items-end gap-1.5 text-4xl font-bold tracking-tight sm:text-5xl">
				All Projects
				<span className="text-muted-foreground text-base font-bold sm:text-lg">
					({projects.length})
				</span>
			</h1>

			<table id="content" className="mt-12 w-full border-collapse text-left">
				<thead className="border-muted/40 bg-background/75 sticky top-0 z-10 border-b px-6 py-5 backdrop-blur">
					<tr>
						<th className="py-4 pr-8 text-sm font-semibold">Year</th>
						<th className="py-4 pr-8 text-sm font-semibold">Project</th>
						<th className="hidden py-4 pr-8 text-sm font-semibold lg:table-cell">
							Built with
						</th>
						<th className="hidden py-4 text-sm font-semibold sm:table-cell">Link</th>
					</tr>
				</thead>
				<tbody>
					{projects.map((project) => {
						const projectLink = project.url || project.repository;
						return (
							<tr
								key={project.title}
								className="border-muted/20 border-b last:border-none"
							>
								<td className="text-muted-foreground py-4 pr-8 align-top text-sm">
									{project.year}
								</td>
								<td className="py-4 pr-4 align-top leading-snug font-semibold">
									<div className="sm:hidden">
										{projectLink ? (
											<Link
												href={projectLink}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:text-primary focus-visible:text-primary group/link"
											>
												<span>{project.title}</span>
												<ArrowUpRight className="ml-1 inline-block h-3.5 w-3.5 shrink-0 align-middle transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
											</Link>
										) : (
											project.title
										)}
									</div>
									<div className="hidden sm:block">{project.title}</div>
								</td>
								<td className="hidden py-4 pr-8 align-top lg:table-cell">
									<ul className="flex flex-wrap gap-x-1.5 gap-y-1">
										{project.technologies.map((tech) => (
											<li key={tech}>
												<div className="bg-primary/10 text-primary flex items-center rounded-full px-3 py-1 text-xs leading-5 font-medium">
													{tech}
												</div>
											</li>
										))}
									</ul>
								</td>
								<td className="align-center hidden py-4 sm:table-cell">
									<div className="flex flex-col gap-3">
										{project.url && (
											<Link
												href={project.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-muted-foreground hover:text-primary inline-flex max-w-50 gap-1 text-xs transition-colors"
												aria-label={`Visit ${project.title}`}
											>
												<CircleArrowOutUpRight className="size-3.5 shrink-0" />
												<span className="truncate">{project.url}</span>
											</Link>
										)}
										{project.repository && (
											<Link
												href={project.repository}
												target="_blank"
												rel="noopener noreferrer"
												className="text-muted-foreground hover:text-primary inline-flex max-w-50 gap-1 text-xs transition-colors"
												aria-label={`View ${project.title} on GitHub`}
											>
												<span
													aria-hidden="true"
													className="block size-3.5 shrink-0 bg-current transition-colors"
													style={{
														WebkitMaskImage: `url(${socialIcons.github.src})`,
														maskImage: `url(${socialIcons.github.src})`,
														WebkitMaskRepeat: "no-repeat",
														maskRepeat: "no-repeat",
														WebkitMaskPosition: "center",
														maskPosition: "center",
														WebkitMaskSize: socialIcons.github.maskSize,
														maskSize: socialIcons.github.maskSize,
													}}
												/>
												<span className="truncate lowercase">
													{getGitHubRepoPath(project.repository)}
												</span>
											</Link>
										)}
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
