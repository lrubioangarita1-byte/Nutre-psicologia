import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PACKS } from "@/lib/packs";

export default function sitemap(): MetadataRoute.Sitemap {
  const packs = Object.values(PACKS)
    .filter((p) => p.status === "disponible")
    .map((p) => ({ url: `${SITE_URL}/packs/${p.id}`, changeFrequency: "monthly" as const, priority: 0.8 }));
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...packs,
    ...["terminos", "privacidad", "consentimiento"].map((d) => ({ url: `${SITE_URL}/legal/${d}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
