import Image from "next/image";
import Link from "next/link";
import {
  getFeaturedProjectsContent,
  ventureProjectHref,
} from "@/lib/ventures/venture-projects";

export async function FeaturedProjects() {
  const { section, visibleProjects } = await getFeaturedProjectsContent();

  if (visibleProjects.length === 0) return null;

  return (
    <div id="featured-projects" className="scroll-mt-24">
      {visibleProjects.map((project, index) => (
        <section
          key={project.id}
          id={index === 0 ? "featured-project" : undefined}
          className="grid min-h-[420px] grid-cols-1 items-stretch sm:min-h-[480px] sm:grid-cols-[2fr_3fr] lg:min-h-[520px]"
        >
          <div className="flex flex-col justify-center bg-charcoal px-4 py-10 sm:px-6 sm:py-16 lg:px-14 lg:py-24">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-sand">
              {index === 0 ? section.label : project.status}
            </p>
            <h2 className="mt-4 max-w-md font-serif text-3xl font-light leading-tight text-ivory md:text-4xl lg:text-[2.5rem]">
              {project.title}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-[1.85] text-ivory/65 md:text-base">
              {project.description}
            </p>
            <Link
              href={ventureProjectHref(project.id)}
              className="mt-10 inline-flex w-fit border border-ivory/40 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-ivory transition-colors hover:border-sand hover:text-sand"
            >
              {project.ctaLabel ?? "View Project →"}
            </Link>
          </div>

          <div className="relative min-h-[280px] w-full sm:min-h-0">
            <Image
              src={project.image}
              alt={project.imageAlt || project.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 60vw"
              priority={index === 0}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
