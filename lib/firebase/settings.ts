import { prisma } from "@/lib/prisma";
import { WebsiteSettings } from "@/types/settings";

export async function getWebsiteSettings(): Promise<WebsiteSettings | null> {
  const settings = await prisma.websiteSettings.findUnique({
    where: { id: "website" },
  });

  if (!settings) {
    return null;
  }

  return {
    ...settings,

    // Gallery hero fields are not currently stored in the Prisma
    // WebsiteSettings model, so provide safe defaults here.
    galleryHeroTitle: "",
    galleryHeroHighlight: "",
    galleryHeroSubtitle: "",
  };
}