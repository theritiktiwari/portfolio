import { projectImages } from "@/constants/images";

interface Project {
	title: string;
	year: number;
	technologies: string[];
	description?: string;
	url?: string;
	repository?: string;
	image?: string;
	featured?: boolean;
	stars?: number;
	downloads?: number;
}

export const projects: Project[] = [
	{
		title: "FinLink",
		year: 2026,
		technologies: ["React Native", "Nest.js", "PostgreSQL", "Supabase"],
		description:
			"A comprehensive wealth-tracking platform enabling users to monitor real-time net worth through automated financial data aggregation.",
		image: projectImages.finlink,
		featured: true,
	},
	{
		title: "Web Auditor (rtCamp)",
		year: 2024,
		technologies: ["Next.js", "Node.js", "MongoDB", "Redis", "Auth0", "Stripe"],
		description:
			"High-performance auditing engine for web health, featuring distributed caching with Redis and a secure multi-tenant Stripe integration.",
		url: "https://webauditor.io/",
		image: projectImages.web_auditor,
		featured: true,
	},
	{
		title: "Turbo Typing",
		year: 2024,
		technologies: ["Next.js", "TypeScript", "MongoDB", "Auth0"],
		description:
			"Performance-oriented typing application featuring real-time telemetry, user authentication, and global competitive leaderboards.",
		repository: "https://github.com/theritiktiwari/turbo-typing",
		url: "https://turbotyping.vercel.app/",
		image: projectImages.turbo_typing,
		featured: true,
	},
	{
		title: "E-commerce Store",
		year: 2024,
		technologies: ["Next.js", "TypeScript", "GraphQL", "Razorpay Subscription"],
		repository: "https://github.com/theritiktiwari/sports-ecom",
		url: "https://fitsportshub.vercel.app/",
	},
	{
		title: "Invoice Generator",
		year: 2024,
		technologies: ["Next.js", "TypeScript", "NextAuth", "MongoDB", "Cloudinary"],
		description:
			"Automated invoicing system capable of generating thousands of professional documents with secure session handling and custom email distribution.",
		repository: "https://github.com/theritiktiwari/invoice-generator",
		url: "https://invoice-generate.vercel.app/",
		image: projectImages.invoice_generator,
		featured: true,
	},
	{
		title: "Blockchain-based File Sharing System",
		year: 2024,
		technologies: ["Next.js", "TypeScript", "Solidity", "IPFS", "Web3.js"],
		description:
			"Decentralized storage platform leveraging IPFS to ensure high-availability and privacy-first file retrieval across distributed nodes.",
		repository: "https://github.com/theritiktiwari/file-sharing",
		url: "https://bfs-system.vercel.app/",
		image: projectImages.blockchain_file_sharing,
		featured: true,
	},
	{
		title: "Location-based Attendance System",
		year: 2024,
		technologies: ["Next.js", "MongoDB", "Express", "Geolocation API"],
		repository: "https://github.com/theritiktiwari/gps-attendance",
		url: "https://gps-attendance.vercel.app/",
	},
	{
		title: "TODO App",
		year: 2024,
		technologies: ["React", "JavaScript", "HTML", "SCSS"],
		repository: "https://github.com/theritiktiwari/react-todo",
		url: "https://react-todo-ritik.vercel.app/",
	},
	{
		title: "Personal Portfolio (v2)",
		year: 2023,
		technologies: ["Next.js", "SCSS", "JavaScript", "Sanity CMS"],
		repository: "https://github.com/theritiktiwari/portfolio.v2",
		url: "https://theritiktiwari-v2.vercel.app/",
	},
	{
		title: "IRA — Mood Detector",
		year: 2023,
		technologies: ["Next.js", "SCSS", "Firebase", "Speech Recognition API"],
		repository: "https://github.com/theritiktiwari/IRA",
		url: "https://ira.vercel.app/",
	},
	{
		title: "Flight Booking System",
		year: 2023,
		technologies: ["Next.js", "SCSS", "MongoDB"],
		repository: "https://github.com/theritiktiwari/flight-booking-system",
		url: "https://lets-fly.vercel.app/",
	},
	{
		title: "Finance Club Website — VITFAM",
		year: 2023,
		technologies: ["Next.js", "Sanity"],
		url: "https://vitfam.vercel.app/",
	},
	{
		title: "Music Club Website — VIT",
		year: 2023,
		technologies: ["Next.js", "Sanity", "Express", "Node.js", "MongoDB"],
		url: "https://musicclubvitc.vercel.app/",
	},
	{
		title: "Weather Monitoring Dashboard",
		year: 2023,
		technologies: ["Next.js", "CSS", "JavaScript"],
		repository: "https://github.com/theritiktiwari/Weather-Monitoring-System",
	},
	{
		title: "Mailer — Email sending API",
		year: 2023,
		technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Express"],
		repository: "https://github.com/theritiktiwari/mailer",
		url: "https://mailer-ritik.vercel.app/",
	},
	{
		title: "OLX Clone",
		year: 2023,
		technologies: ["Next.js", "JavaScript", "HTML", "CSS", "MongoDB"],
		repository: "https://github.com/theritiktiwari/OLX-Clone",
	},
	{
		title: "technoVIT Website",
		year: 2023,
		technologies: ["Next.js", "CSS", "JavaScript"],
		repository: "https://github.com/theritiktiwari/technoVIT",
		url: "https://technovit.vercel.app/",
	},
	{
		title: "Weather App",
		year: 2023,
		technologies: ["Next.js", "SCSS", "JavaScript", "Weather API"],
		repository: "https://github.com/theritiktiwari/weather-app",
		url: "https://weather-app-theritiktiwari.vercel.app/",
	},
	{
		title: "DORMIO",
		year: 2023,
		technologies: ["React", "CSS", "JavaScript", "Firebase"],
		repository: "https://github.com/theritiktiwari/DORMIO",
		url: "https://dormiostore.web.app/",
	},
	{
		title: "Personal Portfolio (v1)",
		year: 2022,
		technologies: ["Next.js", "CSS", "JavaScript", "Sanity CMS"],
		repository: "https://github.com/theritiktiwari/portfolio.v1",
		url: "https://theritiktiwari-v1.vercel.app/",
	},
	{
		title: "PulScope",
		year: 2022,
		technologies: ["Next.js", "CSS", "JavaScript", "Firebase"],
		repository: "https://github.com/theritiktiwari/pulscope",
		url: "https://pulscope.vercel.app/",
	},
	{
		title: "Certificate Finder",
		year: 2022,
		technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
		repository: "https://github.com/vitfam/certificates-finder",
	},
	{
		title: "Grand Thrift Auto: VITFAM Event",
		year: 2022,
		technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
		repository: "https://github.com/vitfam/Grand-Thrift-Auto",
	},
	{
		title: "DeFrauder: VITFAM Event",
		year: 2022,
		technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
		repository: "https://github.com/vitfam/DeFrauder",
	},
	{
		title: "Automatic Night Lamp",
		year: 2022,
		technologies: ["C++"],
		repository: "https://github.com/theritiktiwari/automatic-night-lamp",
	},
	{
		title: "VIT CRMS",
		year: 2021,
		technologies: ["PHP", "JavaScript", "MySQL", "HTML", "CSS"],
		repository: "https://github.com/theritiktiwari/VIT-CRMS",
	},
	{
		title: "Traffic Control System",
		year: 2021,
		technologies: ["C++", "Python"],
		repository: "https://github.com/theritiktiwari/traffic-control-system",
	},
];
