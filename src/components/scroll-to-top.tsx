"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop({ className }: { className?: string }) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > 150);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<Button
			variant="default"
			size="icon-lg"
			aria-label="Scroll to top"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			className={cn(
				"bg-primary/20! text-primary! rounded-full backdrop-blur-sm",
				visible
					? "pointer-events-auto translate-y-0 opacity-100"
					: "pointer-events-none translate-y-4 opacity-0",
				className
			)}
		>
			<ArrowUp className="size-4" />
		</Button>
	);
}
