export interface ProjectMetrics {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
}

export interface Project {
    id: number;

    title: string;

    category: string;

    description: string;

    technologies: string[];

    metrics: ProjectMetrics;

    image?: string;

    github?: string;

    demo?: string;

    featured?: boolean;
}