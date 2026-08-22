// shastra.io — www -> apex 301, then falls through to the static assets.
//
// The canonical fix is a zone-level Redirect Rule, but the wrangler OAuth token
// only carries `zone:read` and rulesets return "Authentication error", so that
// route is closed. www.shastra.io and the apex were serving byte-identical
// content from this same Worker (verified 22 Aug 2026 by md5).
//
// NOTE: assets are served BEFORE the Worker unless run_worker_first is set in
// wrangler.toml — without it this redirect silently never runs.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname.toLowerCase() === "www.shastra.io") {
      url.hostname = "shastra.io";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
