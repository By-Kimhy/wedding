/** The invitation's one easing curve — quick out, gentle settle. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** A softer curve for the long, cinematic moves: the cover and the heroes. */
export const EASE_LONG = [0.16, 1, 0.3, 1] as const;

/**
 * Shared viewport settings for scroll reveals: fire once, a little before the
 * element is fully on screen, so the movement finishes as the guest arrives.
 */
export const viewportOnce = {
  once: true,
  amount: 0.25,
  margin: "0px 0px -8% 0px",
} as const;
