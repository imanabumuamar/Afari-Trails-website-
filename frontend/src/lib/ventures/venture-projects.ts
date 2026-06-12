import { isVentureProjectPublished } from "@/lib/ventures/venture-project-sections";
import {
  getVisibleFeaturedProjects,
  resolveFeaturedProjects,
  resolveFeaturedProjectsSection,
} from "@/lib/ventures/venture-projects-shared";
import { getVenturePageContent } from "@/services/content/ventures";
import type {
  FeaturedProjectsSection,
  VentureFeaturedProject,
} from "@/types/venture-project";

export {
  getVisibleFeaturedProjects,
  normalizeFeaturedProject,
  resolveFeaturedProjects,
  resolveFeaturedProjectsSection,
  slugifyVentureProjectId,
  ventureProjectHref,
  VENTURE_PROJECT_BASE_PATH,
} from "@/lib/ventures/venture-projects-shared";

export async function getFeaturedProjectsContent(): Promise<{
  section: FeaturedProjectsSection;
  projects: VentureFeaturedProject[];
  visibleProjects: VentureFeaturedProject[];
}> {
  const content = await getVenturePageContent("main");
  const projects = resolveFeaturedProjects(content);
  return {
    section: resolveFeaturedProjectsSection(content),
    projects,
    visibleProjects: getVisibleFeaturedProjects(projects),
  };
}

export async function getVentureProjectBySlug(
  slug: string,
): Promise<VentureFeaturedProject | undefined> {
  const { projects } = await getFeaturedProjectsContent();
  const normalized = slug.trim().toLowerCase();
  const project = projects.find(
    (item) => item.id.trim().toLowerCase() === normalized,
  );
  if (!project || !isVentureProjectPublished(project)) return undefined;
  return project;
}

export async function getVentureProjectSlugs(): Promise<string[]> {
  const { visibleProjects } = await getFeaturedProjectsContent();
  return visibleProjects.map((project) => project.id);
}
