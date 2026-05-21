/**
 * Standalone snippet for non-Astro sites (Eleventy talks, plain-HTML brand).
 * Loads Google Analytics via CDN.
 *
 * Usage:
 *   <script>
 *     window.__CHIMI_SITE__ = "talks";
 *     window.__CHIMI_GA_ID__ = "G-XXXXXXXXX";
 *   </script>
 *   <script src="/analytics/snippet.js" defer></script>
 *
 * Astro sites should not use this — they import from @chimi/analytics directly.
 */
(function () {
  if (typeof window === "undefined") return;
  var site = window.__CHIMI_SITE__ || "unknown";
  var measurementId = window.__CHIMI_GA_ID__ || "G-PLACEHOLDER";

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    site: site
  });
})();
