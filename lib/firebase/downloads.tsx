import { prisma } from "@/lib/prisma";
import { DownloadItem } from "@/types/download";

export async function getDownloads(): Promise<DownloadItem[]> {
  return prisma.download.findMany({ where: { status: "active" }, orderBy: { createdAt: "desc" } });
}
