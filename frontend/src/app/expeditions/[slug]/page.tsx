import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpeditionDetailView } from "@/components/expeditions/detail/ExpeditionDetailView";
import {
  getAllExpeditionSlugs,
  getExpeditionDetail,
} from "@/lib/data/expedition-details";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllExpeditionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const expedition = getExpeditionDetail(slug);

  if (!expedition) {
    return { title: "Expedition" };
  }

  return {
    title: expedition.title,
    description: expedition.metaDescription,
  };
}

export default async function ExpeditionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const expedition = getExpeditionDetail(slug);

  if (!expedition) notFound();

  return <ExpeditionDetailView expedition={expedition} />;
}
