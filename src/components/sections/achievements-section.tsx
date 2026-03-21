"use client";

import { CertificateModal } from "@/components/modal/certificate-modal";
import { Achievement, achievements } from "@/data/achievements";
import { ArrowRight, ArrowUpRight, Trophy } from "lucide-react";
import Link from "next/link";

export default function AchievementsSection() {
	const featuredAchievements = achievements.filter((achievement) => achievement.featured);

	return (
		<section
			id="achievements"
			className="scroll-mt-16 lg:scroll-mt-24"
			aria-label="Achievements"
		>
			<div className="bg-background/75 sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
				<h2 className="text-foreground text-sm font-bold tracking-widest uppercase lg:sr-only">
					Achievements
				</h2>
			</div>

			<ul className="group/list space-y-12">
				{featuredAchievements.map((achievement) => (
					<li key={`${achievement.issuer}-${achievement.title}`}>
						<AchievementCard achievement={achievement} />
					</li>
				))}
			</ul>

			<div className="mt-12">
				<Link
					href="/achievements"
					className="text-foreground hover:text-primary focus-visible:text-primary group/link inline-flex items-center leading-tight font-bold"
				>
					<span>View All Achievements</span>
					<ArrowRight className="ml-1 inline-block size-4 shrink-0 -translate-y-px transition-transform group-hover/link:translate-x-2 group-focus-visible/link:translate-x-2 motion-reduce:transition-none" />
				</Link>
			</div>
		</section>
	);
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
	const { link } = achievement;

	return (
		<div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:group-hover/list:opacity-50 lg:hover:opacity-100!">
			<div className="lg:group-hover:bg-card/50 absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-[10px] transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-xl" />

			<header className="text-muted-foreground z-10 mt-1 mb-2 text-xs font-semibold tracking-wide uppercase sm:col-span-2">
				{achievement.date.getUTCFullYear()}
			</header>

			<div className="z-10 sm:col-span-6">
				<h3>
					{link?.type === "certificate" ? (
						<ShowCertificate achievement={achievement} certificateUrl={link.url} />
					) : link?.type === "external" ? (
						<Link
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-foreground hover:text-primary focus-visible:text-primary group/link inline-flex items-baseline leading-tight font-medium"
						>
							<span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded-[10px] md:-inset-x-6 md:-inset-y-4 lg:block" />
							<span>
								{achievement.title}{" "}
								<span className="inline-block">
									· {achievement.issuer}
									<ArrowUpRight className="ml-1 inline-block size-4 shrink-0 translate-y-px transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-focus-visible/link:translate-x-1 group-focus-visible/link:-translate-y-1 motion-reduce:transition-none" />
								</span>
							</span>
						</Link>
					) : (
						<span className="text-foreground leading-tight font-medium">
							{achievement.title}{" "}
							<span className="text-muted-foreground font-normal">
								· {achievement.issuer}
							</span>
						</span>
					)}
				</h3>

				<p className="text-muted-foreground mt-2 text-sm leading-6">
					{achievement.description}
				</p>

				{achievement.tags.length > 0 ? (
					<ul className="mt-2 flex flex-wrap" aria-label="Tags">
						{achievement.tags.map((tag) => (
							<li key={tag} className="mt-2 mr-1.5">
								<div className="bg-primary/10 text-primary flex items-center rounded-full px-3 py-1 text-xs leading-5 font-medium">
									{tag}
								</div>
							</li>
						))}
					</ul>
				) : null}
			</div>
		</div>
	);
}

function ShowCertificate({
	achievement,
	certificateUrl,
}: {
	achievement: Achievement;
	certificateUrl: string;
}) {
	return (
		<CertificateModal
			title={achievement.title}
			issuer={achievement.issuer}
			date={achievement.date}
			certificateImage={certificateUrl}
		>
			<button
				type="button"
				className="text-foreground hover:text-primary focus-visible:text-primary group/link inline-flex cursor-pointer items-baseline text-left leading-tight font-medium transition-colors"
			>
				<span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded-[10px] md:-inset-x-6 md:-inset-y-4 lg:block" />
				<span>
					{achievement.title}{" "}
					<span className="inline-block">
						· {achievement.issuer}
						<Trophy className="ml-1 inline-block size-4 shrink-0 translate-y-px transition-transform group-hover/link:scale-110 motion-reduce:transition-none" />
					</span>
				</span>
			</button>
		</CertificateModal>
	);
}
