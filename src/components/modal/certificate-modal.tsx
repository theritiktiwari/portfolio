"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn, formatDate } from "@/lib/utils";
import type { ImageMetadata } from "astro";
import { Award, Trophy } from "lucide-react";
import React, { useState } from "react";

interface CertificateModalProps {
	title: string;
	issuer: string;
	date: Date;
	certificateImage: ImageMetadata;
	variant?: "title" | "link" | "heading";
}

const VARIANT_STYLES = {
	heading:
		"text-foreground hover:text-primary focus-visible:text-primary group/link inline-flex cursor-pointer items-baseline text-left leading-tight font-medium transition-colors",
	title: "hover:text-primary focus-visible:text-primary group/link cursor-pointer text-left",
	link: "text-muted-foreground hover:text-primary inline-flex cursor-pointer gap-1 text-left text-xs transition-colors",
};

function CertificateTrigger({
	title,
	issuer,
	variant,
	...props
}: Pick<CertificateModalProps, "title" | "issuer" | "variant"> &
	React.ButtonHTMLAttributes<HTMLButtonElement>) {
	if (variant === "heading") {
		return (
			<button type="button" className={VARIANT_STYLES.heading} {...props}>
				<span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded-[10px] md:-inset-x-6 md:-inset-y-4 lg:block" />
				<span>
					{title} · {issuer}
					<Trophy className="ml-1 inline-block size-4 translate-y-px transition-transform group-hover/link:scale-110" />
				</span>
			</button>
		);
	}

	if (variant === "title") {
		return (
			<button type="button" className={VARIANT_STYLES.title} {...props}>
				<span>{title}</span>
				<Trophy className="ml-1 inline-block size-3.5 align-middle transition-transform group-hover/link:scale-110" />
			</button>
		);
	}

	return (
		<button type="button" className={VARIANT_STYLES.link} {...props}>
			<Award className="size-3.5" />
			View Certificate
		</button>
	);
}

export function CertificateModal({
	title,
	issuer,
	date,
	certificateImage,
	variant = "link",
}: CertificateModalProps) {
	const [loaded, setLoaded] = useState<boolean>(false);

	return (
		<Dialog onOpenChange={(open) => !open && setLoaded(false)}>
			<DialogTrigger asChild>
				<CertificateTrigger title={title} issuer={issuer} variant={variant} />
			</DialogTrigger>
			<DialogContent className="gap-4 rounded-xl p-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
				<DialogHeader>
					<DialogTitle className="text-left">{title}</DialogTitle>
					<DialogDescription className="text-left">
						{issuer} · {formatDate({ date, options: { day: "numeric" } })}
					</DialogDescription>
				</DialogHeader>
				<div
					className={cn(
						"overflow-hidden rounded-lg transition-all duration-300",
						!loaded && "bg-muted aspect-4/3 animate-pulse"
					)}
				>
					<img
						src={certificateImage.src}
						alt={`${title} certificate`}
						width={certificateImage.width}
						height={certificateImage.height}
						loading="lazy"
						decoding="async"
						onLoad={() => setLoaded(true)}
						className={cn(
							"h-auto w-full transition-opacity duration-500",
							loaded ? "opacity-100" : "opacity-0"
						)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
