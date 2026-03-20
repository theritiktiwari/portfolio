import AboutSection from "@/components/about-section";
import MouseGlow from "@/components/mouse-glow";
import Sidebar from "@/components/sidebar";

export default function Portfolio() {
	return (
		<div className="relative min-h-screen">
			<MouseGlow />

			<div className="mx-auto min-h-screen max-w-7xl px-6 py-12 font-sans md:px-12 md:py-16 lg:py-0">
				<a
					href="#content"
					className="bg-accent text-accent-foreground absolute top-0 left-0 block -translate-x-full rounded px-4 py-3 text-sm font-bold tracking-widest uppercase focus-visible:translate-x-0"
				>
					Skip to Content
				</a>
				<div className="lg:flex lg:justify-between lg:gap-4">
					<Sidebar />
					<main id="content" className="pt-24 lg:w-[52%] lg:py-24">
						<AboutSection />
					</main>
				</div>
			</div>
		</div>
	);
}
