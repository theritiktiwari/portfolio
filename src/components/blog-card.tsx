import { TagList } from "@/components/ui/tag-list";
import { formatDate } from "@/lib/utils";
import { BookOpen, Calendar, Clock, Layers as LayersIcon } from "lucide-react";

export interface BlogCardProps {
	id: string;
	title: string;
	description: string;
	pubDate: Date;
	tags: string[];
	readingTime: number;
	series?: { name: string; part: number };
	heroImage?: string;
	featuredPost?: boolean;
	draft?: boolean;
}

function PostImage({ src, alt }: { src?: string; alt: string }) {
	if (src) {
		return (
			<img
				src={src}
				alt={alt}
				className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
				loading="lazy"
				decoding="async"
			/>
		);
	}

	return (
		<div className="bg-primary/5 flex size-full items-center justify-center">
			<BookOpen className="text-primary/30 size-10" />
		</div>
	);
}

function DraftRibbon() {
	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden">
			<div className="bg-primary text-primary-foreground absolute top-5 -right-8 z-10 w-32 rotate-45 py-1 text-center text-[10px] font-bold tracking-widest uppercase shadow-md">
				Draft
			</div>
		</div>
	);
}

function PostMeta({
	pubDate,
	readingTime,
	series,
}: Pick<BlogCardProps, "pubDate" | "readingTime" | "series">) {
	return (
		<div className="text-muted-foreground flex flex-wrap gap-x-2 gap-y-1.5 text-xs">
			<span className="flex shrink-0 items-center gap-1.5">
				<Calendar className="size-3.5" />
				{formatDate({ date: pubDate })}
			</span>
			<span className="flex shrink-0 items-center gap-1.5">
				<Clock className="size-3.5" />
				{readingTime} min read
			</span>
			{series && (
				<span className="flex shrink-0 items-center gap-1.5">
					<LayersIcon className="size-3.5" />
					{series.name} • Part {series.part}
				</span>
			)}
		</div>
	);
}

export function BlogCard({
	id,
	title,
	description,
	pubDate,
	tags,
	readingTime,
	series,
	heroImage,
	featuredPost = false,
	draft = false,
}: BlogCardProps) {
	if (featuredPost) {
		return (
			<a
				href={`/blog/${id}`}
				className="group/card border-border bg-card hover:border-primary/50 flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg sm:only:flex-row"
			>
				<div className="relative aspect-video shrink-0 overflow-hidden sm:group-only/card:aspect-auto sm:group-only/card:w-2/5">
					<PostImage src={heroImage} alt={title} />
					{draft && <DraftRibbon />}
				</div>

				<div className="flex flex-1 flex-col gap-3 p-6 sm:group-only/card:justify-center sm:group-only/card:p-8">
					<div className="flex-1 space-y-3">
						<h2 className="text-foreground group-hover/card:text-primary text-xl leading-snug font-bold transition-colors sm:group-only/card:text-3xl">
							{title}
						</h2>

						<p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed sm:group-only/card:line-clamp-3 sm:group-only/card:text-base">
							{description}
						</p>
					</div>

					<TagList items={tags} label="Tags" className="gap-1.5" />

					<PostMeta pubDate={pubDate} readingTime={readingTime} series={series} />
				</div>
			</a>
		);
	}

	return (
		<a
			href={`/blog/${id}`}
			className="group border-border bg-card hover:border-primary/40 flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md"
		>
			<div className="relative aspect-video overflow-hidden">
				<PostImage src={heroImage} alt={title} />
				{draft && <DraftRibbon />}
			</div>
			<div className="flex flex-1 flex-col gap-2 p-5">
				<div className="flex-1 space-y-2">
					<h3 className="text-foreground group-hover:text-primary text-base leading-snug font-semibold transition-colors">
						{title}
					</h3>

					<p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
						{description}
					</p>
				</div>

				<PostMeta pubDate={pubDate} readingTime={readingTime} series={series} />
			</div>
		</a>
	);
}
