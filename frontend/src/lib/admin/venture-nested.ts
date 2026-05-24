/** Set a value on a nested object using dot/bracket paths (e.g. focusAreas.0.image). */
export function setNestedValue(
  root: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const clone = structuredClone(root);
  const parts = path.split(".");
  let cur: Record<string, unknown> | unknown[] = clone;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = parts[i + 1];
    const isIndex = /^\d+$/.test(next);

    if (Array.isArray(cur)) {
      const idx = Number(key);
      if (!cur[idx] || typeof cur[idx] !== "object") {
        cur[idx] = isIndex ? [] : {};
      }
      cur = cur[idx] as Record<string, unknown> | unknown[];
    } else {
      const record = cur as Record<string, unknown>;
      if (
        record[key] === undefined ||
        record[key] === null ||
        typeof record[key] !== "object"
      ) {
        record[key] = isIndex ? [] : {};
      }
      cur = record[key] as Record<string, unknown> | unknown[];
    }
  }

  const last = parts[parts.length - 1];
  if (Array.isArray(cur)) {
    cur[Number(last)] = value;
  } else {
    (cur as Record<string, unknown>)[last] = value;
  }

  return clone;
}

export function getNestedValue(root: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    if (Array.isArray(acc)) return acc[Number(part)];
    if (typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, root);
}

export function fieldPathToFilename(path: string): string {
  return path.replace(/\./g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
}
