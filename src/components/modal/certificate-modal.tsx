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
import { Award, Trophy } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";

interface CertificateModalProps {
	title: string;
	issuer: string;
	date: Date;
	certificateImage: string;
	/** Pass a single React element as trigger, or use variant for a built-in trigger */
	children?: ReactElement;
	variant?: "title" | "link";
}

export function CertificateModal({
	title,
	issuer,
	date,
	certificateImage,
	children,
	variant,
}: CertificateModalProps) {
	const [loaded, setLoaded] = useState(false);

	const trigger =
		children ??
		(variant === "title" ? (
			<button
				type="button"
				className="hover:text-primary focus-visible:text-primary group/link cursor-pointer text-left"
			>
				<span>{title}</span>
				<Trophy className="ml-1 inline-block h-3.5 w-3.5 shrink-0 align-middle transition-transform group-hover/link:scale-110" />
			</button>
		) : (
			<button
				type="button"
				className="text-muted-foreground hover:text-primary inline-flex cursor-pointer gap-1 text-left text-xs transition-colors"
			>
				<Award className="size-3.5 shrink-0" />
				View Certificate
			</button>
		));

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) setLoaded(false);
			}}
		>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
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
						src={certificateImage}
						alt={`${title} certificate`}
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
