import { education } from "@/data/education";

export default function EducationSection() {
	return (
		<section
			id="education"
			className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
			aria-label="Education"
		>
			<div className="bg-background/75 sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
				<h2 className="text-foreground text-sm font-bold tracking-widest uppercase lg:sr-only">
					Education
				</h2>
			</div>

			<ol className="group/list space-y-12">
				{education.map((edu) => (
					<li key={`${edu.institution}-${edu.degree}`}>
						<div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:group-hover/list:opacity-50 lg:hover:opacity-100!">
							<div className="lg:group-hover:bg-card/50 absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-[10px] transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-xl" />

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

								{edu.courses.length > 0 ? (
									<ul className="mt-2 flex flex-wrap" aria-label="Courses">
										{edu.courses.map((course) => (
											<li key={course} className="mt-2 mr-1.5">
												<div className="bg-primary/10 text-primary flex items-center rounded-full px-3 py-1 text-xs leading-5 font-medium">
													{course}
												</div>
											</li>
										))}
									</ul>
								) : null}
							</div>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
