"use client";

import MouseGlow from "@/components/mouse-glow";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";

export default function Portfolio() {
	const [activeSection, setActiveSection] = useState("about");

	useEffect(() => {
		const handleScroll = () => {
			const sections = ["about", "experience", "projects"];
			const scrollPosition = window.scrollY + 150;

			for (const section of sections) {
				const element = document.getElementById(section);
				if (element) {
					const { offsetTop, offsetHeight } = element;
					if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
						setActiveSection(section);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="relative min-h-screen">
			<MouseGlow />

			<div className="mx-auto min-h-screen max-w-7xl px-6 py-12 font-sans md:px-12 md:py-16 lg:py-0">
				<a
					href="#content"
					className="absolute top-0 left-0 block -translate-x-full rounded bg-yellow-500 px-4 py-3 text-sm font-bold tracking-widest text-slate-900 uppercase focus-visible:translate-x-0 focus-visible:text-slate-900"
				>
					Skip to Content
				</a>
				<div className="lg:flex lg:justify-between lg:gap-4">
					<Sidebar activeSection={activeSection} />
				</div>
			</div>
		</div>
	);
}
