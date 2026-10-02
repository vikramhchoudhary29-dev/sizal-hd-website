export type WebsiteSettings = {
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;

  primaryButtonText: string;
  primaryButtonUrl: string;

  secondaryButtonText: string;
  secondaryButtonUrl: string;

  galleryHeroTitle: string;
  galleryHeroHighlight: string;
  galleryHeroSubtitle: string;

  companyPhone: string;
  whatsappNumber: string;
  companyEmail: string;
  companyAddress: string;

  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;

  seoTitle: string;
  seoDescription: string;

  updatedAt?: string | Date;
};