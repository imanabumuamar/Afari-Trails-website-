"use client";

import { StoreCollectionsEditor } from "@/components/admin/store/StoreCollectionsEditor";
import { StoreNewArrivalsEditor } from "@/components/admin/store/StoreNewArrivalsEditor";
import { StorePageSettingsEditor } from "@/components/admin/store/StorePageSettingsEditor";
import { StoreProductsEditor } from "@/components/admin/store/StoreProductsEditor";
import { StoreAdminNav } from "@/components/admin/store/StoreAdminNav";
import { useStoreAdmin } from "@/components/admin/store/useStoreAdmin";

export type StoreAdminSection =
  | "page"
  | "collections"
  | "new-arrivals"
  | "items";

const SECTION_META: Record<
  StoreAdminSection,
  { title: string; descriptionReadOnly: string; descriptionEdit: string }
> = {
  page: {
    title: "Store page",
    descriptionReadOnly: "View store page copy.",
    descriptionEdit: "Edit the store hero and World of Afari banner.",
  },
  collections: {
    title: "Store collections",
    descriptionReadOnly: "View featured collections.",
    descriptionEdit:
      "Add, remove, hide, and reorder collection cards on the store page.",
  },
  "new-arrivals": {
    title: "New arrivals",
    descriptionReadOnly: "View which items appear in New Arrivals.",
    descriptionEdit:
      "Pick items from your catalog to feature in the New Arrivals section.",
  },
  items: {
    title: "Store items",
    descriptionReadOnly: "View the product catalog.",
    descriptionEdit:
      "Add and edit every store product — images, pricing, and details.",
  },
};

type StoreAdminPageProps = {
  section: StoreAdminSection;
  readOnly: boolean;
};

export function StoreAdminPage({ section, readOnly }: StoreAdminPageProps) {
  const ctx = useStoreAdmin(readOnly);
  const meta = SECTION_META[section];

  if (ctx.loading) {
    return <p className="text-sm text-charcoal/60">Loading store…</p>;
  }

  if (!ctx.data) {
    return <p className="text-sm text-red-800/80">{ctx.status || "No data."}</p>;
  }

  const { data, setData, setStatus, syncFromUpload, save, patch } = ctx;

  return (
    <>
      <div>
        <h2 className="font-serif text-3xl font-light">{meta.title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-charcoal/65">
          {readOnly ? meta.descriptionReadOnly : meta.descriptionEdit}
        </p>
      </div>

      <StoreAdminNav updatedAt={ctx.updatedAt} status={ctx.status} />

      {section === "page" && (
        <StorePageSettingsEditor
          data={data}
          readOnly={readOnly}
          setData={setData}
          setStatus={setStatus}
          onDocumentSynced={syncFromUpload}
          onSave={save}
        />
      )}

      {section === "collections" && (
        <StoreCollectionsEditor
          collections={data.collections}
          readOnly={readOnly}
          setData={setData}
          setStatus={setStatus}
          onDocumentSynced={syncFromUpload}
          onSave={(collections) => patch({ collections })}
        />
      )}

      {section === "new-arrivals" && (
        <StoreNewArrivalsEditor
          data={data}
          readOnly={readOnly}
          onStatus={setStatus}
          onSave={(newArrivals) => patch({ newArrivals })}
        />
      )}

      {section === "items" && (
        <StoreProductsEditor
          data={data}
          readOnly={readOnly}
          setData={setData}
          setStatus={setStatus}
          onDocumentSynced={syncFromUpload}
          onSave={(products) => patch({ products })}
        />
      )}
    </>
  );
}
