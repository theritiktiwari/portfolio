"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[], offset = 150) {
	const [activeSection, setActiveSection] = useState(sectionIds[0]);

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + offset;
			for (const id of sectionIds) {
				const el = document.getElementById(id);
				if (!el) continue;
				const { offsetTop, offsetHeight } = el;
				if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
					setActiveSection(id);
					break;
				}
			}
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [sectionIds, offset]);

	return activeSection;
}
