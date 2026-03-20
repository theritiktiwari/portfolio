"use client";

import { useEffect, useRef, useState } from "react";

export default function MouseGlow() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [pageHeight, setPageHeight] = useState(0);
	const lastPointerPosition = useRef<{ x: number; y: number } | null>(null);

	useEffect(() => {
		const updatePageHeight = () => {
			setPageHeight(document.documentElement.scrollHeight);
		};

		const syncGlowToViewportPointer = () => {
			const pointer = lastPointerPosition.current;

			if (!pointer) {
				return;
			}

			setMousePosition({ x: pointer.x, y: pointer.y + window.scrollY });
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
		window.addEventListener("scroll", handleViewportChange);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("resize", handleViewportChange);
			window.removeEventListener("scroll", handleViewportChange);
		};
	}, []);

	return (
		<div
			className="pointer-events-none fixed inset-x-0 top-0 z-30 transition-opacity duration-300 lg:absolute"
			style={{
				height: pageHeight ? `${pageHeight}px` : "100%",
				background: `radial-gradient(
					600px at ${mousePosition.x}px ${mousePosition.y}px,
					var(--mouse-glow),
					transparent 80%
				)`,
			}}
		/>
	);
}
