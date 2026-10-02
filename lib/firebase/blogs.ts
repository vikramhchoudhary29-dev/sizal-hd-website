import { prisma } from "@/lib/prisma";
import { BlogPost } from "@/types/blog";

export async function getBlogs(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({ where: { status: "active" }, orderBy: { createdAt: "desc" } });
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  return prisma.blogPost.findFirst({ where: { id, status: "active" } });
}
