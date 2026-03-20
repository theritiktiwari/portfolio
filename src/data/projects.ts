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

// TODO: add projects list
export const projects: Project[] = [];
