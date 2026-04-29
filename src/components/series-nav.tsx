import { cn, formatDate } from "@/lib/utils";
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
}

export function SeriesNav({ seriesName, currentPart, posts }: SeriesNavProps) {
	const sorted = [...posts].sort((a, b) => a.part - b.part);
	const currentIdx = sorted.findIndex((p) => p.part === currentPart);
	const prev = sorted[currentIdx - 1];
	const next = sorted[currentIdx + 1];

	return (
		<div className="border-border bg-card my-8 rounded-xl border p-5">
			<p className="text-muted-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
				Series · {seriesName}
			</p>

			<ol className="mb-7 space-y-3">
				{sorted.map((post) => (
					<li key={post.id} className="flex items-start gap-2.5">
						<span
							className={cn(
								"mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
								post.part === currentPart
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground"
							)}
						>
							{post.part}
						</span>
						{post.part === currentPart ? (
							<span className="text-foreground line-clamp-2 text-sm leading-snug font-medium">
								{post.title}
							</span>
						) : (
							<a
								href={`/blog/${post.id}`}
								className="text-muted-foreground hover:text-primary line-clamp-2 text-sm leading-snug transition-colors"
							>
								{post.title}
							</a>
						)}
					</li>
				))}
			</ol>

			<div className="flex flex-col gap-3 lg:flex-row">
				{prev && (
					<a
						href={`/blog/${prev.id}`}
						className="border-border hover:border-primary/50 flex flex-1 items-center gap-2 rounded-lg border p-3 transition-colors"
					>
						<ChevronLeft className="text-muted-foreground size-4 shrink-0" />
						<div className="min-w-0">
							<p className="text-muted-foreground text-xs">Previous</p>
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
							<p className="text-muted-foreground text-xs">Next</p>
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
