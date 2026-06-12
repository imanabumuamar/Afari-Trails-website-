import { notFound } from "next/navigation";
import { VentureProjectDetail } from "@/components/ventures/projects/VentureProjectDetail";
import {
  getVentureProjectBySlug,
  getVentureProjectSlugs,
} from "@/lib/ventures/venture-projects";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getVentureProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getVentureProjectBySlug(slug);
  if (!project) return { title: "Project" };

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function VentureProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getVentureProjectBySlug(slug);
  if (!project) notFound();

  return <VentureProjectDetail project={project} />;
}
