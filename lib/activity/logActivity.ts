import { prisma } from "@/lib/prisma";

type LogParams = {
  action: string;
  performedBy: string;
  performedByEmail: string;
  message: string;
  targetUid?: string;
  targetEmail?: string;
};

export async function logActivity({ action, performedBy, performedByEmail, message, targetUid, targetEmail }: LogParams) {
  await prisma.activityLog.create({
    data: { action, message, performedBy, performedByEmail, targetUid: targetUid || null, targetEmail: targetEmail || null },
  });
}
