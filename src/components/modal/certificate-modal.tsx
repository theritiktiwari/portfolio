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
import Image from "next/image";
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
		<Dialog onOpenChange={() => setLoaded(false)}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="gap-4 rounded-xl p-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{issuer} · {formatDate(date)}
					</DialogDescription>
				</DialogHeader>
				<div
					className={cn(
						"overflow-hidden rounded-lg transition-all duration-300",
						!loaded && "bg-muted aspect-4/3 animate-pulse"
					)}
				>
					<Image
						src={certificateImage}
						alt={`${title} certificate`}
						width={0}
						height={0}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
						onLoad={() => setLoaded(true)}
						className={cn(
							"h-auto w-full transition-opacity duration-300",
							loaded ? "opacity-100" : "opacity-0"
						)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
