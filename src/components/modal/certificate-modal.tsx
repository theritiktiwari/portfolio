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
import { useState } from "react";

interface CertificateModalProps {
	title: string;
	issuer: string;
	date: Date;
	certificateImage: string;
	children: React.ReactNode;
}

export function CertificateModal({
	title,
	issuer,
	date,
	certificateImage,
	children,
}: CertificateModalProps) {
	const [loaded, setLoaded] = useState(false);

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) setLoaded(false);
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
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
