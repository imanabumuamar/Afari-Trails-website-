"use client";

import { AdminField, inputClass, textareaClass } from "@/components/admin/ventures/AdminField";
import type { ConnectWhatsAppSettings } from "@/types/connect-content";

type ConnectWhatsAppEditorProps = {
  settings: ConnectWhatsAppSettings;
  readOnly?: boolean;
  onChange: (settings: ConnectWhatsAppSettings) => void;
};

export function ConnectWhatsAppEditor({
  settings,
  readOnly = false,
  onChange,
}: ConnectWhatsAppEditorProps) {
  return (
    <section className="rounded border border-charcoal/12 bg-ivory p-6">
      <h3 className="font-serif text-2xl font-light">WhatsApp</h3>
      <p className="mt-2 max-w-2xl text-sm text-charcoal/60">
        Site-wide floating button (bottom-right on public pages) and expedition
        footer &ldquo;Chat on WhatsApp&rdquo; links. Hidden on admin pages when
        number is empty.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <AdminField label="Phone number">
          <input
            className={inputClass}
            value={settings.number}
            disabled={readOnly}
            placeholder="260974302344"
            onChange={(e) =>
              onChange({
                ...settings,
                number: e.target.value.replace(/\D/g, ""),
              })
            }
          />
          <p className="mt-1.5 text-xs text-charcoal/50">
            Country code + number, digits only (no + or spaces).
          </p>
        </AdminField>
        <AdminField label="Default message">
          <textarea
            className={textareaClass}
            rows={4}
            value={settings.message}
            disabled={readOnly}
            onChange={(e) =>
              onChange({ ...settings, message: e.target.value })
            }
          />
        </AdminField>
      </div>
    </section>
  );
}
