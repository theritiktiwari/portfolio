import { socialIcons } from "@/constants/images";

export const navLinks = [
	{ id: "about", label: "About" },
	{ id: "experience", label: "Experience" },
	{ id: "projects", label: "Projects" },
	{ id: "education", label: "Education" },
	{ id: "achievements", label: "Achievements" },
];

export const socialLinks = [
	{
		icon: socialIcons.email,
		href: "mailto:theritiktiwari@gmail.com?subject=Let%27s%20Work%20Together&body=Hi%20Ritik%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20wanted%20to%20reach%20out.",
		label: "Email",
		tooltip:
			"I'm currently open to new opportunities. Whether it's a project, a role, or just to say hi — my inbox is always open.",
	},
	{ icon: socialIcons.github, href: "https://github.com/theritiktiwari", label: "GitHub" },
	{
		icon: socialIcons.linkedin,
		href: "https://linkedin.com/in/theritiktiwari",
		label: "LinkedIn",
	},
	{ icon: socialIcons.twitter, href: "https://twitter.com/theritiktiwari", label: "Twitter" },
	{
		icon: socialIcons.instagram,
		href: "https://instagram.com/theritiktiwari",
		label: "Instagram",
	},
];
