"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface CustomImageProps {
	src: string | undefined;
	alt: string;
	className?: string;
}

export function CustomImage({ src, alt, className }: CustomImageProps) {
	const [failed, setFailed] = useState(!src);

	return (
		<div
			className={cn(
				"border-popover-foreground/20 bg-card group-hover:border-muted/40 aspect-video overflow-hidden rounded-lg border-3 shadow-lg transition sm:rounded",
				{ "hidden sm:block": failed },
				className
			)}
		>
			{!failed && (
				<img
					src={src}
					alt={alt}
					width={900}
					height={485}
					className="size-full rounded-xs object-cover"
					loading="lazy"
					decoding="async"
					onError={() => setFailed(true)}
				/>
			)}
		</div>
	);
}
