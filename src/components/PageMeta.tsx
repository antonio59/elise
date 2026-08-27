import { useEffect } from "react";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from "../lib/seo";

interface PageMetaProps {
  title?: string;
  description?: string;
  image?: string | null;
  url?: string;
  type?: "website" | "article";
}

function upsertMeta(
  content: string,
  opts: { name?: string; property?: string },
) {
  const selector = opts.property
    ? `meta[property="${opts.property}"]`
    : `meta[name="${opts.name}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    if (opts.property) el.setAttribute("property", opts.property);
    else if (opts.name) el.setAttribute("name", opts.name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(
    `link[rel="${rel}"]`,
  ) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sets document title + Open Graph / Twitter tags for the current route.
 * Note: most chat/social crawlers read the static tags in index.html, not JS.
 * Keep index.html defaults in sync; this upgrades the tab + JS-capable previews.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function usePageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url,
  type = "website",
}: PageMetaProps = {}) {
  const fullTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME;
  const pageUrl = absoluteUrl(url) ?? (typeof window !== "undefined"
    ? `${SITE_URL}${window.location.pathname}`
    : SITE_URL);
  const ogImage = absoluteUrl(image) ?? DEFAULT_OG_IMAGE;

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta(description, { name: "description" });

    upsertMeta(fullTitle, { property: "og:title" });
    upsertMeta(description, { property: "og:description" });
    upsertMeta(ogImage, { property: "og:image" });
    upsertMeta(pageUrl, { property: "og:url" });
    upsertMeta(SITE_NAME, { property: "og:site_name" });
    upsertMeta(type, { property: "og:type" });
    upsertMeta("en_GB", { property: "og:locale" });
    upsertMeta("1200", { property: "og:image:width" });
    upsertMeta("630", { property: "og:image:height" });
    upsertMeta(SITE_NAME, { property: "og:image:alt" });

    upsertMeta("summary_large_image", { name: "twitter:card" });
    upsertMeta(fullTitle, { name: "twitter:title" });
    upsertMeta(description, { name: "twitter:description" });
    upsertMeta(ogImage, { name: "twitter:image" });
    upsertMeta(SITE_NAME, { name: "twitter:image:alt" });

    upsertLink("canonical", pageUrl);
  }, [fullTitle, description, ogImage, pageUrl, type]);
}
