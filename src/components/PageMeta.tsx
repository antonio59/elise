import { useEffect } from "react";

interface PageMetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function usePageMeta({
  title,
  description,
  image,
  url,
}: PageMetaProps = {}) {
  const fullTitle = title ? `${title} — Elise Reads` : "Elise Reads";

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content?: string, property?: string) => {
      if (!content) return;
      const selector = property
        ? `meta[property="${property}"]`
        : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        if (property) el.setAttribute("property", property);
        else el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", fullTitle, "og:title");
    setMeta("og:description", description, "og:description");
    setMeta("og:image", image, "og:image");
    setMeta("og:url", url, "og:url");
    setMeta("twitter:card", "summary_large_image", "twitter:card");
  }, [fullTitle, description, image, url]);
}

export const PageMeta: React.FC<PageMetaProps> = (props) => {
  usePageMeta(props);
  return null;
};

export default PageMeta;
