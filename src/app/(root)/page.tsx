import AboutSection from "@/components/about-section";
import AchievementsSection from "@/components/achievements-section";
import EducationSection from "@/components/education-section";
import ExperienceSection from "@/components/experience-section";
import ProjectsSection from "@/components/projects-section";
import Sidebar from "@/components/sidebar";

export default function Portfolio() {
	return (
		<div className="lg:flex lg:justify-between lg:gap-4">
			<Sidebar />
			<main id="content" className="pt-24 lg:w-[52%] lg:py-24">
				<AboutSection />
				<ExperienceSection />
				<ProjectsSection />
				<EducationSection />
				<AchievementsSection />
			</main>
		</div>
	);
}
