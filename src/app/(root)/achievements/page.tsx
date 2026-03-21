"use client";

import { TagList } from "@/components/ui/tag-list";
import { achievements } from "@/data/achievements";
import { ArrowLeft, ArrowUpRight, Award, CircleArrowOutUpRight, Trophy } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const CertificateModal = dynamic(
	() => import("@/components/modal/certificate-modal").then((m) => m.CertificateModal),
	{ ssr: false }
);

export default function AchievementsPage() {
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
				Achievements
				<span className="text-muted-foreground text-base font-bold sm:text-lg">
					({achievements.length})
				</span>
			</h1>

			<table id="content" className="mt-12 w-full border-collapse text-left">
				<thead className="border-muted/40 bg-background/75 sticky top-0 z-10 border-b px-6 py-5 backdrop-blur">
					<tr>
						<th className="py-4 pr-8 text-sm font-semibold">Year</th>
						<th className="py-4 pr-8 text-sm font-semibold">Achievement</th>
						<th className="hidden py-4 pr-8 text-sm font-semibold lg:table-cell">
							Tags
						</th>
						<th className="hidden py-4 text-sm font-semibold sm:table-cell">Link</th>
					</tr>
				</thead>
				<tbody>
					{achievements.map((achievement) => {
						const { link } = achievement;
						return (
							<tr
								key={`${achievement.issuer}-${achievement.title}`}
								className="border-muted/20 border-b last:border-none"
							>
								<td className="text-muted-foreground py-4 pr-8 align-top text-sm">
									{achievement.date.getUTCFullYear()}
								</td>

								<td className="py-4 pr-4 align-top leading-snug font-semibold">
									<div className="sm:hidden">
										{link?.type === "external" ? (
											<Link
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:text-primary focus-visible:text-primary group/link"
											>
												<span>{achievement.title}</span>
												<ArrowUpRight className="ml-1 inline-block h-3.5 w-3.5 shrink-0 align-middle transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
											</Link>
										) : link?.type === "certificate" ? (
											<CertificateModal
												title={achievement.title}
												issuer={achievement.issuer}
												date={achievement.date}
												certificateImage={link.url}
											>
												<button
													type="button"
													className="hover:text-primary focus-visible:text-primary group/link cursor-pointer text-left"
												>
													<span>{achievement.title}</span>
													<Trophy className="ml-1 inline-block h-3.5 w-3.5 shrink-0 align-middle transition-transform group-hover/link:scale-110" />
												</button>
											</CertificateModal>
										) : (
											achievement.title
										)}
									</div>
									<div className="hidden sm:block">
										<span>{achievement.title}</span>
										<span className="text-muted-foreground ml-1 font-normal">
											· {achievement.issuer}
										</span>
									</div>
								</td>

								<td className="hidden py-4 pr-8 align-top lg:table-cell">
									<TagList
										items={achievement.tags}
										label="Tags"
										className="gap-x-1.5 gap-y-1"
									/>
								</td>

								<td className="align-center hidden py-4 sm:table-cell">
									<div className="flex flex-col gap-3">
										{link?.type === "external" ? (
											<Link
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-muted-foreground hover:text-primary inline-flex max-w-50 gap-1 text-xs transition-colors"
												aria-label={`View ${achievement.title}`}
											>
												<CircleArrowOutUpRight className="size-3.5 shrink-0" />
												<span className="truncate">{link.url}</span>
											</Link>
										) : link?.type === "certificate" ? (
											<CertificateModal
												title={achievement.title}
												issuer={achievement.issuer}
												date={achievement.date}
												certificateImage={link.url}
											>
												<button
													type="button"
													className="text-muted-foreground hover:text-primary inline-flex cursor-pointer gap-1 text-left text-xs transition-colors"
												>
													<Award className="size-3.5 shrink-0" />
													View Certificate
												</button>
											</CertificateModal>
										) : null}
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
