const TAB_KEY = "afari-admin-tab-active";

/** Marks this browser tab as having completed admin sign-in. */
export function markAdminTabAuthenticated() {
  sessionStorage.setItem(TAB_KEY, "1");
}

export function clearAdminTabAuthentication() {
  sessionStorage.removeItem(TAB_KEY);
}

export function isAdminTabAuthenticated() {
  return sessionStorage.getItem(TAB_KEY) === "1";
}
