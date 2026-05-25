import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { featuredProject as default_featuredProject } from "@/lib/data/ventures";
import { venturesProjects as default_venturesProjects } from "@/lib/data/ventures";
import { venturesProjectsSection as default_venturesProjectsSection } from "@/lib/data/ventures";

export async function VenturesProjects() {
  const content = await getVenturePageContent("main");
  const featuredProject = content.featuredProject as typeof default_featuredProject;
  const venturesProjects = content.venturesProjects as typeof default_venturesProjects;
  const venturesProjectsSection = content.venturesProjectsSection as typeof default_venturesProjectsSection;

  const pipeline = venturesProjects.filter(
    (p) => !("featured" in p && p.featured)
  );

  return (
    <section id="projects" className="scroll-mt-24 border-t border-charcoal/10 bg-ivory py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 border-b border-charcoal/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel>{venturesProjectsSection.label}</SectionLabel>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-charcoal/60">
              {venturesProjectsSection.intro}
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-charcoal/40">
            Featured below · {venturesProjects.length} in pipeline
          </p>
        </div>

        <ul className="mt-8 divide-y divide-charcoal/10">
          {pipeline.map((project) => (
            <li key={project.id}>
              <Link
                href={project.href ?? "/ventures"}
                className="group flex flex-col gap-3 py-5 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-8"
              >
                <div className="min-w-0">
                  <h3 className="font-serif text-xl font-light text-charcoal transition-colors group-hover:text-gold md:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-charcoal/45">
                    {project.category}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-6">
                  <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-charcoal/50">
                    {project.status}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/35 transition-colors group-hover:text-gold">
                    View →
                  </span>
                </div>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={featuredProject.href ?? "/ventures/eco-lodge"}
              className="group flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
            >
              <div className="min-w-0">
                <h3 className="font-serif text-xl font-light text-charcoal transition-colors group-hover:text-gold md:text-2xl">
                  {featuredProject.title}
                </h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gold-muted">
                  {featuredProject.status} · Featured
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-6">
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-charcoal/50">
                  {featuredProject.status}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/35 transition-colors group-hover:text-gold">
                  View →
                </span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
