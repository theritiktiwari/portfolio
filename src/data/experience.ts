interface Experience {
	period: string;
	title: string;
	company: string;
	companyUrl: string;
	description: string;
	technologies: string[];
}

export const experiences: Experience[] = [
	{
		period: "2024 — Present",
		title: "Software Engineer",
		company: "rtCamp",
		companyUrl: "https://rtcamp.com/",
		description:
			"Develop and improve crucial full-stack components that power Web Auditor, from backend services to user interfaces. Work on the engineering and design to provide high-performance interfaces and flexible APIs while promoting automated deployment and infrastructure resilience best practices.",
		technologies: ["TypeScript", "React", "Express", "MongoDB", "Redis", "GH Actions"],
	},
	{
		period: "2022 — 2024",
		title: "Freelancer",
		company: "Self-employed",
		companyUrl: "https://linkedin.com/in/theritiktiwari/",
		description:
			"Delivered high-impact full-stack development and multimedia services across diverse industries. I managed the end-to-end lifecycle of visually polished websites while creating engaging video content, consistently exceeding client expectations through technical excellence.",
		technologies: [
			"Docker",
			"GH Actions",
			"Next.js",
			"JavaScript",
			"Express",
			"MongoDB",
			"PostgreSQL",
			"MySQL",
			"DaVinci Resolve",
		],
	},
	{
		period: "FEB 2023",
		title: "Full-stack Developer",
		company: "DiGiLABS",
		companyUrl: "https://linkedin.com/company/digilabs-atpl/",
		description:
			"Engineered a RESTful API and integrated a robust administrative interface for a school management system. This streamlined operations and enhanced user management efficiency, providing a scalable architecture for handling core academic data and administrative workflows with high technical precision.",
		technologies: ["React", "JavaScript", "Express", "MySQL", "Node.js"],
	},
	{
		period: "2020 — 2023",
		title: "Vice President",
		company: "VITFAM",
		companyUrl: "https://linkedin.com/company/vitfam/",
		description:
			"Over three years of progressive leadership, I scaled the club's digital presence and operations. As Vice President, I managed end-to-end finances and events while designing the club's website. Previously, as Social Media Head, I strategized growth for high-reach campaigns and coordinated flagship events like Finance Fest and Cryptonic.",
		technologies: ["Next.js", "JavaScript", "Sanity"],
	},
	{
		period: "2021 — 2022",
		title: "Technical Team Member",
		company: "FYI",
		companyUrl: "https://www.linkedin.com/company/fraternity-of-young-innovators/",
		description:
			"I optimized club operations by implementing systematic task parameters. I built the official website and provided core technical infrastructure for all flagship events as the organizing committee.",
		technologies: ["React", "JavaScript", "Firebase", "Django"],
	},
	{
		period: "2020 — 2021",
		title: "Programme Representative",
		company: "VIT",
		companyUrl: "https://www.linkedin.com/school/vellore-institute-of-technology/",
		description:
			"Elected as the 2020-21 Programme Representative for Cyber Physical Systems. Managed official branch duties and represented student interests, ensuring effective communication with university administration.",
		technologies: ["Leadership", "Communication", "Management"],
	},
];
