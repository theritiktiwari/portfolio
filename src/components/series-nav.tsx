import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SeriesPost {
	id: string;
	title: string;
	part: number;
	pubDate: Date;
}

interface SeriesNavProps {
	seriesName: string;
	currentPart: number;
	posts: SeriesPost[];
	variant?: "compact" | "full";
}

export function SeriesNav({ seriesName, currentPart, posts, variant = "full" }: SeriesNavProps) {
	const sorted = [...posts].sort((a, b) => a.part - b.part);
	const currentIdx = sorted.findIndex((p) => p.part === currentPart);
	const prev = sorted[currentIdx - 1];
	const next = sorted[currentIdx + 1];

	if ("compact" === variant) {
		return (
			(prev || next) && (
				<div className="border-border flex items-center justify-between gap-4 rounded-lg border px-4 py-2.5 text-sm">
					{prev ? (
						<a
							href={`/blog/${prev.id}`}
							className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
						>
							<ChevronLeft className="size-3.5 shrink-0" />
							<span>Part {prev.part}</span>
						</a>
					) : (
						<span />
					)}
					<span className="text-muted-foreground text-xs">
						{seriesName} · Part {currentPart} of {sorted.length}
					</span>
					{next ? (
						<a
							href={`/blog/${next.id}`}
							className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
						>
							<span>Part {next.part}</span>
							<ChevronRight className="size-3.5 shrink-0" />
						</a>
					) : (
						<span />
					)}
				</div>
			)
		);
	}

	return (
		<div className="border-border bg-card my-8 rounded-xl border p-5">
			<p className="text-muted-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
				Series · {seriesName}
			</p>

			<div className="flex flex-col gap-3 lg:flex-row">
				{prev && (
					<a
						href={`/blog/${prev.id}`}
						className="border-border hover:border-primary/50 flex flex-1 items-center gap-2 rounded-lg border p-3 transition-colors"
					>
						<ChevronLeft className="text-muted-foreground size-4 shrink-0" />
						<div className="min-w-0">
							<p className="text-muted-foreground text-xs">
								Previous · Part {prev.part}
							</p>
							<p className="text-foreground truncate text-sm font-medium">
								{prev.title}
							</p>
						</div>
					</a>
				)}
				{next && (
					<a
						href={`/blog/${next.id}`}
						className="border-border hover:border-primary/50 flex flex-1 items-center justify-end gap-2 rounded-lg border p-3 text-right transition-colors"
					>
						<div className="min-w-0">
							<p className="text-muted-foreground text-xs">Next · Part {next.part}</p>
							<p className="text-foreground truncate text-sm font-medium">
								{next.title}
							</p>
						</div>
						<ChevronRight className="text-muted-foreground size-4 shrink-0" />
					</a>
				)}
			</div>

			<p className="text-muted-foreground mt-3 text-right text-xs">
				Part {currentPart} of {sorted.length} ·{" "}
				{formatDate({ date: posts.find((p) => p.part === currentPart)!.pubDate })}
			</p>
		</div>
	);
}
