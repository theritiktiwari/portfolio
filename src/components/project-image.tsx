"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ProjectImageProps {
	src: string | undefined;
	alt: string;
}

export default function ProjectImage({ src, alt }: ProjectImageProps) {
	const [failed, setFailed] = useState(!src);

	return (
		<div className="z-10 sm:order-1 sm:col-span-2">
			<div
				className={cn(
					"border-muted/20 bg-card group-hover:border-muted/40 aspect-video overflow-hidden rounded border-2 transition",
					{ "hidden sm:block": failed }
				)}
			>
				{!failed && (
					<Image
						src={src!}
						alt={alt}
						width={200}
						height={112}
						className="size-full object-cover"
						onError={() => setFailed(true)}
					/>
				)}
			</div>
		</div>
	);
}
