import { certificates } from "@/constants/images";

export type AchievementLink =
	| { type: "certificate"; url: string }
	| { type: "external"; url: string };

export interface Achievement {
	title: string;
	date: Date;
	issuer: string;
	tags: string[];
	description?: string;
	featured?: boolean;
	link?: AchievementLink;
}

export const achievements: Achievement[] = [
	{
		title: "Research Publication: Blockchain-Based File Sharing System",
		date: new Date("2024-07-30"),
		issuer: "IRJMS",
		description:
			'Published a peer-reviewed paper titled "Blockchain-Based File Sharing System — A Hybrid Approach" exploring decentralized security and optimized data distribution.',
		tags: ["Blockchain", "Research", "Security"],
		featured: true,
		link: {
			type: "external",
			url: "https://www.irjms.com/wp-content/uploads/2024/07/Manuscript_IRJMS_0925_WS.pdf",
		},
	},
	{
		title: "Microsoft SC-900: Security & Compliance",
		date: new Date("2023-06-29"),
		issuer: "Microsoft",
		description:
			"Industry certification validating foundational knowledge of cloud security, identity management, and compliance.",
		tags: ["Identity", "Cloud Security", "Compliance"],
		featured: true,
		link: { type: "certificate", url: certificates.microsoft_sc900 },
	},
	{
		title: "Advanced C++ Certification",
		date: new Date("2023-06-21"),
		issuer: "IIT Bombay",
		description:
			"Verified proficiency in Advanced C++ concepts and high-performance programming.",
		tags: ["C++", "IIT Bombay"],
		featured: true,
		link: { type: "certificate", url: certificates.iit_cpp },
	},
	{
		title: "Java Programming Certification",
		date: new Date("2023-06-21"),
		issuer: "IIT Bombay",
		description: "Certification in core Java development and object-oriented principles.",
		tags: ["Java", "OOPs", "IIT Bombay"],
		featured: true,
		link: { type: "certificate", url: certificates.iit_java },
	},
	{
		title: "Backend Development: PHP & MySQL",
		date: new Date("2023-06-21"),
		issuer: "IIT Bombay",
		description: "Technical certification for server-side logic and database management.",
		tags: ["PHP", "MySQL", "Database", "IIT Bombay"],
		featured: true,
		link: { type: "certificate", url: certificates.iit_php_mysql },
	},
	{
		title: "Exemplary Leadership Award",
		date: new Date("2022-09-10"),
		issuer: "VIT Finance & Management Club",
		description:
			"Recognized for astounding leadership and team motivation as Social Media Head.",
		tags: ["Leadership", "Strategy", "Finance"],
		link: { type: "certificate", url: certificates.vitfam_head },
	},
	{
		title: "AWSome Day Online Conference",
		date: new Date("2022-06-09"),
		issuer: "Amazon Web Services (AWS)",
		tags: ["Cloud", "AWS"],
		link: { type: "certificate", url: certificates.awsome_day },
	},
	{
		title: "HashCode Participant",
		date: new Date("2022-03-19"),
		issuer: "Google",
		tags: ["Competitive Programming", "Algorithms"],
		link: { type: "certificate", url: certificates.hashcode_2022 },
	},
	{
		title: "SnackDown 2021 Participant",
		date: new Date("2021-11-11"),
		issuer: "CodeChef",
		tags: ["Competition", "DSA"],
		link: { type: "certificate", url: certificates.codechef_snackdown },
	},
	{
		title: "Social Media Member",
		date: new Date("2021-10-19"),
		issuer: "VIT Finance & Management Club",
		tags: ["ECA", "Community"],
		link: { type: "certificate", url: certificates.vitfam_member },
	},
	{
		title: "SOCIOTHON — Ideate the Change",
		date: new Date("2021-09-20"),
		issuer: "TWH Club, VIT Chennai",
		tags: ["Hackathon", "Product"],
		link: { type: "certificate", url: certificates.twh_sociothon },
	},
	{
		title: "CSS Skills Assessment",
		date: new Date("2021-09-18"),
		issuer: "HackerRank",
		tags: ["CSS", "Design"],
		link: { type: "certificate", url: certificates.hackerrank_css },
	},
	{
		title: "SQL Skills Assessment",
		date: new Date("2021-09-18"),
		issuer: "HackerRank",
		tags: ["SQL", "Database"],
		link: { type: "certificate", url: certificates.hackerrank_sql },
	},
	{
		title: "Global Rank 6400 — HashCode",
		date: new Date("2021-03-02"),
		issuer: "Google",
		description:
			"Achieved a top-tier worldwide ranking in Google's flagship team-based optimization competition.",
		tags: ["Competitive Programming", "Optimization"],
		featured: true,
		link: { type: "certificate", url: certificates.hashcode_2021 },
	},
	{
		title: "WordPress SEO",
		date: new Date("2020-08-09"),
		issuer: "Udemy",
		tags: ["WordPress", "CMS", "SEO"],
		link: { type: "certificate", url: certificates.udemy_wordpress },
	},
	{
		title: "JavaScript, PHP & Bootstrap Certification",
		date: new Date("2020-05-09"),
		issuer: "Udemy",
		tags: ["JS", "PHP", "Bootstrap", "Web Development"],
		link: { type: "certificate", url: certificates.udemy_js_php },
	},
	{
		title: "HTML Fundamentals",
		date: new Date("2020-05-04"),
		issuer: "SoloLearn",
		tags: ["HTML", "Web Development"],
		link: { type: "certificate", url: certificates.sololearn_html },
	},
	{
		title: "Microsoft Excel: Formula & Functions",
		date: new Date("2020-04-27"),
		issuer: "Start Tech Academy",
		tags: ["Excel", "Data", "Spreadsheets"],
		link: { type: "certificate", url: certificates.skillzcafe_excel },
	},
	{
		title: "Social Science Exhibition: Skit Competition",
		date: new Date("2018-09-25"),
		issuer: "KVS",
		tags: ["Skit", "Drama"],
		link: { type: "certificate", url: certificates.sse_skit },
	},
	{
		title: "Volleyball Regional Championship 2018",
		date: new Date("2018-05-03"),
		issuer: "KVS",
		tags: ["Volleyball", "Sports", "Regional Championship"],
		link: { type: "certificate", url: certificates.volleyball_regional_2018 },
	},
	{
		title: "Social Science Exhibition: Dance Competition",
		date: new Date("2017-08-31"),
		issuer: "KVS",
		tags: ["Keyboardist", "Music"],
		link: { type: "certificate", url: certificates.sse_dance },
	},
	{
		title: "Bharat Scout & Guide: Rajya Puraskar",
		date: new Date("2017-07-22"),
		issuer: "KVS",
		tags: ["Scouting", "Leadership"],
		link: { type: "certificate", url: certificates.bsng_rajya_puraskar },
	},
	{
		title: "Volleyball Regional Championship 2017",
		date: new Date("2017-04-21"),
		issuer: "KVS",
		tags: ["Volleyball", "Sports", "Regional Championship"],
		link: { type: "certificate", url: certificates.volleyball_regional_2017 },
	},
	{
		title: "Volleyball Regional Championship 2016",
		date: new Date("2016-08-23"),
		issuer: "KVS",
		tags: ["Volleyball", "Sports", "Regional Championship"],
		link: { type: "certificate", url: certificates.volleyball_regional_2016 },
	},
	{
		title: "Bharat Scout & Guide: Tritiya Sopan",
		date: new Date("2016-05-08"),
		issuer: "KVS",
		tags: ["Scouting", "Leadership"],
		link: { type: "certificate", url: certificates.bsng_tritiya_sopan },
	},
];
