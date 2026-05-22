const X_INTENT_URL = "https://twitter.com/intent/tweet";

const isMobileDevice = () =>
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

export function getXShareUrl(text) {
  return `${X_INTENT_URL}?text=${encodeURIComponent(text)}`;
}

/**
 * Opens X compose with prefilled text. Same-tab navigation on mobile
 * so universal links can open the X app; new tab on desktop.
 */
export function shareToX(text) {
  const url = getXShareUrl(text);

  if (isMobileDevice()) {
    window.location.assign(url);
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}
