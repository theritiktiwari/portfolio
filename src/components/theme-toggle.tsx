"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { flushSync } from "react-dom";

export default function ThemeToggle({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();
	const ref = useRef<HTMLButtonElement>(null);
	const THEME_TRANSITION_DURATION = 500;

	const toggleTheme = async () => {
		const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
		if (!ref.current || !document.startViewTransition) {
			setTheme(nextTheme);
			return;
		}

		const { top, left, width, height } = ref.current.getBoundingClientRect();
		const x = left + width / 2;
		const y = top + height / 2;
		const maxRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y)
		);

		await document.startViewTransition(() => {
			flushSync(() => {
				setTheme(nextTheme);
			});
		}).ready;

		document.documentElement.animate(
			{
				clipPath: [
					`circle(0px at ${x}px ${y}px)`,
					`circle(${maxRadius}px at ${x}px ${y}px)`,
				],
			},
			{
				duration: THEME_TRANSITION_DURATION,
				easing: "ease-in-out",
				pseudoElement: "::view-transition-new(root)",
			}
		);
	};

	return (
		<Button
			ref={ref}
			variant="outline"
			size="icon-lg"
			onClick={toggleTheme}
			aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
			className={cn("rounded-full backdrop-blur-sm", className)}
		>
			<SunMedium
				className={cn(
					"absolute size-4 transition-all",
					resolvedTheme === "light"
						? "scale-100 rotate-0 opacity-100"
						: "scale-0 rotate-90 opacity-0"
				)}
			/>
			<MoonStar
				className={cn(
					"absolute size-4 transition-all",
					resolvedTheme === "dark"
						? "scale-100 rotate-0 opacity-100"
						: "scale-0 -rotate-90 opacity-0"
				)}
			/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
