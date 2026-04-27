import { CardHoverEffect } from "@/components/ui/card-hover-effect";
import { SectionHeader } from "@/components/ui/section-header";
import { TagList } from "@/components/ui/tag-list";
import { education } from "@/content/education";

export default function EducationSection() {
	return (
		<section id="education" className="scroll-mt-16 lg:scroll-mt-24" aria-label="Education">
			<SectionHeader title="Education" />

			<ol className="group/list space-y-12">
				{education.map((edu) => (
					<li key={`${edu.institution}-${edu.degree}`}>
						<div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:group-hover/list:opacity-50 lg:hover:opacity-100!">
							<CardHoverEffect />

							<header className="text-muted-foreground z-10 mt-1 mb-2 text-xs font-semibold tracking-wide uppercase sm:col-span-2">
								{edu.period}
							</header>

							<div className="z-10 sm:col-span-6">
								<h3 className="text-foreground leading-tight font-medium">
									{edu.degree}{" "}
									<span className="inline-block">· {edu.institution}</span>
								</h3>

								{edu.grade ? (
									<p className="text-primary mt-1 text-xs font-bold tracking-wide">
										{edu.grade.type === "cgpa"
											? `CGPA: ${edu.grade.value} / 10`
											: `Score: ${edu.grade.value}%`}
									</p>
								) : null}

								<p className="text-muted-foreground mt-2 text-sm leading-6">
									{edu.description}
								</p>

								<TagList
									items={edu.courses}
									label="Courses"
									className="mt-2"
									itemClassName="mt-2 mr-1.5"
								/>
							</div>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
