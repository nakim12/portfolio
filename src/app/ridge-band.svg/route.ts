import { ridgeSceneSvg } from "@/lib/ridge-svg";

/**
 * The hero's landscape at a wide, shallow aspect, for the header band on
 * project pages.
 *
 * Served as one immutable asset rather than inlined into each page: all four
 * project pages share it, and the path data is tens of kilobytes that would
 * otherwise be duplicated into every HTML document. Fewer samples per crest
 * than the Open Graph card, since the band is displayed at roughly a third of
 * the height and the extra points resolve to nothing.
 */
/** Route handlers are uncached by default, and this one has no inputs — it
 *  should be a build-time file, not a function invocation per page view. */
export const dynamic = "force-static";

export function GET() {
  const svg = ridgeSceneSvg({
    width: 1800,
    height: 420,
    steps: 90,
    mode: "band",
  });
  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
