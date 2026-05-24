import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getArchiveContent } from "@/services/content/archive";

export const metadata = {
  title: "Submit — The Afari Lens",
  description: "Submit your photography to The Afari Lens — Afari Trails community feature.",
};

export default async function ArchiveSubmitPage() {
  const content = await getArchiveContent();
  const { submitPage } = content.page;

  return (
    <section className="bg-beige pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-xl px-6 lg:px-10">
        <SectionLabel>{submitPage.label}</SectionLabel>
        <h1 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {submitPage.heading}
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-charcoal/65">
          {submitPage.intro}
        </p>

        <form className="mt-14 space-y-10">
          <div>
            <label
              htmlFor="name"
              className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-3 w-full border-b border-charcoal/20 bg-transparent py-3 text-sm text-charcoal focus:border-charcoal/50 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="photo"
              className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
            >
              Photo
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="mt-3 w-full text-sm text-charcoal/70 file:mr-4 file:border-0 file:bg-transparent file:text-xs file:uppercase file:tracking-[0.15em] file:text-charcoal"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              placeholder="e.g. South Luangwa, Zambia"
              className="mt-3 w-full border-b border-charcoal/20 bg-transparent py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/50 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="story"
              className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
            >
              Story
            </label>
            <textarea
              id="story"
              name="story"
              rows={5}
              required
              placeholder="A few lines about the image and the moment."
              className="mt-3 w-full resize-none border-b border-charcoal/20 bg-transparent py-3 text-sm leading-relaxed text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/50 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="instagram"
              className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
            >
              Instagram <span className="text-charcoal/35">(optional)</span>
            </label>
            <input
              id="instagram"
              name="instagram"
              type="text"
              placeholder="@yourhandle"
              className="mt-3 w-full border-b border-charcoal/20 bg-transparent py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/50 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-charcoal px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-matte-black sm:w-auto"
          >
            Submit
          </button>
        </form>

        <Link
          href={submitPage.backHref}
          className="mt-12 inline-block text-xs uppercase tracking-[0.25em] text-charcoal/45 hover:text-charcoal"
        >
          ← Back to Archive
        </Link>
      </div>
    </section>
  );
}
