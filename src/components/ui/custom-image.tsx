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
				"border-muted/20 bg-card group-hover:border-muted/40 aspect-video overflow-hidden rounded-lg border-3 transition sm:rounded",
				{ "hidden sm:block": failed },
				className
			)}
		>
			{!failed && (
				<img
					src={src}
					alt={alt}
					width={200}
					height={112}
					className="size-full object-cover"
					onError={() => setFailed(true)}
				/>
			)}
		</div>
	);
}
