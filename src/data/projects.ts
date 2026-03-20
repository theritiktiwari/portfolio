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
	installs?: number;
}

export const projects: Project[] = [];
