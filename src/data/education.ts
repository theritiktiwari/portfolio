interface Education {
	period: string;
	degree: string;
	institution: string;
	description: string;
	courses: string[];
	grade?: { type: "cgpa"; value: number } | { type: "percentage"; value: number };
}

export const education: Education[] = [
	{
		period: "2020 — 2024",
		degree: "B.Tech in Computer Science & Engineering",
		institution: "VIT Chennai",
		description:
			"Specialized in full-stack development and distributed systems. Elected Programme Representative for Cyber Physical Systems. Active member of technical clubs, organizing flagship events and building internal tooling for the student community.",
		courses: ["Data Structures", "OS", "DBMS", "Computer Networks"],
		grade: { type: "cgpa", value: 8.7 },
	},
	{
		period: "2018 — 2020",
		degree: "Higher Secondary (Science — PCM)",
		institution: "Kendriya Vidyalaya",
		description:
			"Completed 12th with Physics, Chemistry, and Mathematics. Developed a strong foundation in analytical thinking and problem solving that underpins my engineering work.",
		courses: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
		grade: { type: "percentage", value: 93 },
	},
];
