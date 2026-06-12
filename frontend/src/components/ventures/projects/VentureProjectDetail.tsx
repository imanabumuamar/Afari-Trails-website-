import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ROUTES } from "@/config/routes";
import { resolveVentureProjectSectionVisibility } from "@/lib/ventures/venture-project-sections";
import type { VentureFeaturedProject } from "@/types/venture-project";

type VentureProjectDetailProps = {
  project: VentureFeaturedProject;
};

function TextSection({
  label,
  heading,
  body,
}: {
  label: string;
  heading?: string;
  body: string;
}) {
  if (!body.trim()) return null;
  const paragraphs = body.split("\n\n").filter(Boolean);

  return (
    <section className="bg-ivory py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-3xl">
          <SectionLabel>{label}</SectionLabel>
          {heading ? (
            <h2 className="mt-4 font-serif text-3xl font-light text-charcoal md:text-4xl">
              {heading}
            </h2>
          ) : null}
          <div className="mt-8 space-y-4">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-[1.9] text-charcoal/70 md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function VentureProjectDetail({ project }: VentureProjectDetailProps) {
  const sections = resolveVentureProjectSectionVisibility(project);
  const storyParagraphs = project.story.split("\n\n").filter(Boolean);
  const visionParagraphs = project.vision.split("\n\n").filter(Boolean);

  return (
    <article>
      {sections.hero && (
        <section className="relative min-h-[72vh] pt-28 lg:min-h-[78vh]">
          <Image
            src={project.image}
            alt={project.imageAlt || project.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-matte-black/80 via-matte-black/45 to-matte-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black/70 via-transparent to-matte-black/20" />

          <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-[1400px] flex-col justify-end px-6 pb-16 lg:min-h-[78vh] lg:px-10 lg:pb-20">
            <Link
              href={ROUTES.ventures}
              className="mb-8 text-[10px] uppercase tracking-[0.24em] text-ivory/55 transition-colors hover:text-sand"
            >
              ← Back to Ventures
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-sand">
              {project.status}
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl font-light leading-tight text-ivory md:text-5xl lg:text-[3.5rem]">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-[1.85] text-ivory/75 md:text-base">
              {project.description}
            </p>
          </div>
        </section>
      )}

      {sections.story && storyParagraphs.length > 0 && (
        <section className="bg-beige py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="max-w-3xl">
              <SectionLabel>Project Story</SectionLabel>
              <div className="mt-8 space-y-4">
                {storyParagraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-sm leading-[1.9] text-charcoal/70 md:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {sections.vision && visionParagraphs.length > 0 && (
        <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-matte-black px-6 py-24 lg:min-h-[55vh]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--safari-green-deep)_0%,_var(--matte-black)_65%)]" />
          <div className="relative z-10 max-w-4xl text-center">
            <SectionLabel light>Vision & Goals</SectionLabel>
            <div className="mt-8 space-y-4">
              {visionParagraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="font-serif text-2xl font-light leading-[1.45] text-ivory md:text-3xl"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.location && project.locationBody.trim() && (
        <section className="bg-ivory py-20 lg:py-24">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
            <div>
              <SectionLabel>{project.locationLabel ?? "Location"}</SectionLabel>
              {project.locationHeading ? (
                <h2 className="mt-4 font-serif text-3xl font-light text-charcoal md:text-4xl">
                  {project.locationHeading}
                </h2>
              ) : null}
              <p className="mt-6 text-sm leading-[1.9] text-charcoal/70 md:text-base">
                {project.locationBody}
              </p>
            </div>
            {project.locationImage ? (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.locationImage}
                  alt={project.locationHeading || project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : null}
          </div>
        </section>
      )}

      {sections.gallery && project.gallery.length > 0 && (
        <section
          className="overflow-hidden bg-matte-black py-4 lg:py-6"
          aria-label="Project gallery"
        >
          <div className="flex gap-1 overflow-x-auto scrollbar-none lg:gap-1.5">
            {project.gallery.map((frame) => (
              <div
                key={frame.src}
                className="relative h-[50vh] min-h-[320px] w-[min(92vw,640px)] shrink-0 lg:h-[70vh] lg:w-[720px]"
              >
                <Image
                  src={frame.src}
                  alt={frame.alt || project.title}
                  fill
                  className="object-cover opacity-95"
                  sizes="720px"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {sections.communityImpact && (
        <TextSection
          label="Community Impact"
          body={project.communityImpact}
        />
      )}

      {sections.conservation && (
        <TextSection
          label="Conservation"
          body={project.conservation}
        />
      )}

      {sections.timeline && project.timeline.length > 0 && (
        <section className="bg-beige py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <SectionLabel>Timeline & Progress</SectionLabel>
            <ol className="mt-10 max-w-3xl space-y-8 border-l border-charcoal/15 pl-6">
              {project.timeline.map((entry) => (
                <li key={`${entry.date}-${entry.title}`} className="relative">
                  <span className="absolute -left-[1.84rem] top-1.5 h-2.5 w-2.5 rounded-full bg-gold" />
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-charcoal/45">
                    {entry.date}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-light text-charcoal">
                    {entry.title}
                  </h3>
                  {entry.body ? (
                    <p className="mt-3 text-sm leading-[1.85] text-charcoal/65">
                      {entry.body}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {sections.cta && (
        <section className="bg-charcoal py-20 text-center lg:py-24">
          <div className="mx-auto max-w-2xl px-6 lg:px-10">
            <h2 className="font-serif text-3xl font-light text-ivory md:text-4xl">
              Interested in this venture?
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ivory/65">
              We welcome aligned partners, investors, and collaborators who share a
              long-term vision for Africa.
            </p>
            <Link
              href={ROUTES.contact}
              className="mt-10 inline-flex border border-ivory/40 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-ivory transition-colors hover:border-sand hover:text-sand"
            >
              Get in Touch →
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
