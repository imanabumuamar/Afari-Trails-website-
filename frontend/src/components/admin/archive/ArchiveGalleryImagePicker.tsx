"use client";

import Image from "next/image";
import type { ArchiveImageRecord } from "@/types/archive-content";

type ArchiveGalleryImagePickerProps = {
  images: ArchiveImageRecord[];
  value: string[];
  readOnly?: boolean;
  onChange: (ids: string[]) => void;
};

export function ArchiveGalleryImagePicker({
  images,
  value,
  readOnly = false,
  onChange,
}: ArchiveGalleryImagePickerProps) {
  function toggle(id: string) {
    if (readOnly) return;
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  }

  function move(id: string, dir: -1 | 1) {
    if (readOnly) return;
    const i = value.indexOf(id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  const selected = value
    .map((id) => images.find((img) => img.id === id))
    .filter((img): img is ArchiveImageRecord => !!img);

  return (
    <div className="space-y-6">
      {selected.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
            Selected order
          </p>
          <ol className="space-y-2">
            {selected.map((img, index) => (
              <li
                key={img.id}
                className="flex flex-wrap items-center gap-3 rounded border border-charcoal/12 bg-ivory px-3 py-2"
              >
                <span className="text-xs text-charcoal/45">#{index + 1}</span>
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-charcoal/10">
                  <Image
                    src={img.image}
                    alt={img.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </span>
                <span className="flex-1 text-sm text-charcoal">
                  <strong className="font-medium">{img.title}</strong>
                  <span className="ml-2 text-charcoal/50">{img.location}</span>
                </span>
                {!readOnly && (
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      className="rounded border border-charcoal/20 px-2 py-1 text-xs"
                      onClick={() => move(img.id, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="rounded border border-charcoal/20 px-2 py-1 text-xs"
                      onClick={() => move(img.id, 1)}
                      disabled={index === selected.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="px-2 text-xs text-red-800/80 hover:text-red-900"
                      onClick={() => toggle(img.id)}
                    >
                      Remove
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
          Gallery photos
        </p>
        {images.length === 0 ? (
          <p className="text-sm text-charcoal/55">
            Add photos in the Gallery tab first, then pick them here.
          </p>
        ) : (
          <ul className="space-y-2">
            {images.map((img) => {
              const checked = value.includes(img.id);
              const orderIndex = value.indexOf(img.id);
              return (
                <li
                  key={img.id}
                  className="flex flex-wrap items-center gap-3 rounded border border-charcoal/10 bg-beige/30 px-3 py-2"
                >
                  <label className="flex flex-1 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={readOnly}
                      onChange={() => toggle(img.id)}
                      className="h-4 w-4 shrink-0"
                    />
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-charcoal/10">
                      <Image
                        src={img.image}
                        alt={img.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </span>
                    <span className="text-sm text-charcoal">
                      <strong className="font-medium">{img.title}</strong>
                      <span className="ml-2 text-charcoal/50">{img.location}</span>
                      {img.published === false && (
                        <span className="ml-2 text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
                          hidden
                        </span>
                      )}
                    </span>
                  </label>
                  {checked && (
                    <span className="text-xs text-charcoal/45">#{orderIndex + 1}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
