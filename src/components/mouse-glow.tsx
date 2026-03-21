"use client";

import { useEffect } from "react";

export default function MouseGlow() {
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			document.documentElement.style.setProperty("--glow-x", `${e.clientX}px`);
			document.documentElement.style.setProperty("--glow-y", `${e.clientY}px`);
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return null;
}
