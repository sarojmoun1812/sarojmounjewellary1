/**
 * One lead prompt per visitor, ever.
 *
 * Two separate popups ask for the same name and phone and post to the same
 * endpoint: a timed one on the homepage and an exit-intent one site-wide. They
 * tracked themselves with different localStorage keys, so on a phone the
 * homepage showed the first at ten seconds and the second at thirty — the
 * second one arriving even when the visitor had just handed over their number,
 * because it never checked whether a lead had already been captured.
 *
 * Both now share these helpers, so whichever fires first is the only one shown.
 */

const PROMPT_SHOWN_KEY = "lead_prompt_shown";
const LEAD_CAPTURED_KEY = "lead_captured";

/** False during server rendering, where localStorage does not exist. */
function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function readFlag(key: string): boolean {
  if (!canUseStorage()) return false;
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    // Private browsing and blocked storage both throw. Treat it as "not seen":
    // a repeated prompt is a smaller problem than a crash on the homepage.
    return false;
  }
}

function writeFlag(key: string) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, "true");
  } catch {
    // Nothing to do; the prompt simply may appear again on a later visit.
  }
}

/** Whether any lead prompt may still be shown to this visitor. */
export function canShowLeadPrompt(): boolean {
  return !readFlag(PROMPT_SHOWN_KEY) && !readFlag(LEAD_CAPTURED_KEY);
}

/** Call as soon as a prompt becomes visible, not when it is submitted. */
export function markLeadPromptShown() {
  writeFlag(PROMPT_SHOWN_KEY);
}

/** Call after a lead is successfully submitted. */
export function markLeadCaptured() {
  writeFlag(LEAD_CAPTURED_KEY);
  writeFlag(PROMPT_SHOWN_KEY);
}
