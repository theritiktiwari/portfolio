"use client";

import { useEffect, useRef } from "react";

export default function MouseGlow() {
	const glowRef = useRef<HTMLDivElement>(null);
	const lastPointerPosition = useRef<{ x: number; y: number } | null>(null);

	useEffect(() => {
		const el = glowRef.current;
		if (!el) return;

		const updatePageHeight = () => {
			el.style.height = `${document.documentElement.scrollHeight}px`;
		};

		const syncGlowToViewportPointer = () => {
			const pointer = lastPointerPosition.current;
			if (!pointer) return;
			const x = pointer.x;
			const y = pointer.y + window.scrollY;
			el.style.background = `radial-gradient(600px at ${x}px ${y}px, var(--mouse-glow), transparent 80%)`;
		};

		const handleMouseMove = (e: MouseEvent) => {
			lastPointerPosition.current = { x: e.clientX, y: e.clientY };
			syncGlowToViewportPointer();
		};

		const handleViewportChange = () => {
			updatePageHeight();
			syncGlowToViewportPointer();
		};

		updatePageHeight();
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("resize", handleViewportChange);
		window.addEventListener("scroll", handleViewportChange, { passive: true });

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("resize", handleViewportChange);
			window.removeEventListener("scroll", handleViewportChange);
		};
	}, []);

	return (
		<div
			ref={glowRef}
			className="pointer-events-none fixed inset-x-0 top-0 z-30 lg:absolute"
			style={{ height: "100%" }}
		/>
	);
}
