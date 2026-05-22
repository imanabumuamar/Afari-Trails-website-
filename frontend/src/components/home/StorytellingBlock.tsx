export function StorytellingBlock() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center bg-matte-black px-6 py-32 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--safari-green-deep)_0%,_var(--matte-black)_70%)]" />
      <blockquote className="relative z-10 max-w-4xl text-center">
        <p className="font-serif text-3xl font-light leading-relaxed text-ivory sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.25]">
          The wilderness strips away performance.
          <br />
          <span className="text-ivory/60">On the trail, we return to ourselves.</span>
        </p>
      </blockquote>
    </section>
  );
}
