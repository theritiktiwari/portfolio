interface Project {
	title: string;
	description: string;
	image: string;
	url: string;
	technologies: string[];
	stars?: number;
	installs?: number;
}

export const projects: Project[] = [];
