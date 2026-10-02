import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { AdminRole, Permission, hasPermission } from "./permissions";

export type VerifiedAdmin = {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  status: "active" | "disabled";
};

/**
 * Verify the Firebase ID token and resolve the matching Neon admin profile.
 *
 * Admin profiles migrated from Firestore keep their old Firebase UID. If the
 * Firebase Auth user was intentionally deleted and recreated with the same
 * email address, the new Firebase account receives a new UID. In that case we
 * safely re-link the existing Neon admin profile by its verified email.
 */
export async function verifyAdminRequest(
  request: Request
): Promise<{ admin: VerifiedAdmin } | { error: NextResponse }> {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return {
        error: NextResponse.json(
          { error: "Unauthorized request" },
          { status: 401 }
        ),
      };
    }

    const decodedToken = await adminAuth.verifyIdToken(
      authHeader.slice(7)
    );

    const tokenEmail = decodedToken.email
      ?.trim()
      .toLowerCase();

    if (!tokenEmail) {
      return {
        error: NextResponse.json(
          {
            error:
              "Authenticated account has no email address",
          },
          { status: 403 }
        ),
      };
    }

    let admin = await prisma.admin.findUnique({
      where: {
        uid: decodedToken.uid,
      },
    });

    // The admin may have been migrated from Firestore before
    // the Firebase Auth user was recreated. Re-link by the
    // verified Firebase email once.
    if (!admin) {
      const adminByEmail = await prisma.admin.findUnique({
        where: {
          email: tokenEmail,
        },
      });

      if (adminByEmail) {
        admin = await prisma.admin.update({
          where: {
            uid: adminByEmail.uid,
          },
          data: {
            uid: decodedToken.uid,
          },
        });
      }
    }

    if (!admin) {
      return {
        error: NextResponse.json(
          {
            error:
              "Admin profile not found for this account",
          },
          { status: 403 }
        ),
      };
    }

    if (admin.status !== "active") {
      return {
        error: NextResponse.json(
          {
            error: "Admin account disabled",
          },
          { status: 403 }
        ),
      };
    }

    return {
      admin: {
        uid: admin.uid,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        status: admin.status,
      },
    };
  } catch (error) {
    console.error(
      "Admin authentication failed:",
      error
    );

    return {
      error: NextResponse.json(
        {
          error: "Authentication failed",
        },
        { status: 401 }
      ),
    };
  }
}

export async function requirePermission(
  request: Request,
  permission: Permission
) {
  const verified = await verifyAdminRequest(request);

  /*
   * TypeScript narrowing:
   *
   * verifyAdminRequest() returns either:
   * { admin: VerifiedAdmin }
   * OR
   * { error: NextResponse }
   *
   * Checking with "in" safely narrows the union.
   */
  if ("error" in verified) {
    return verified;
  }

  if (
    !hasPermission(
      verified.admin.role,
      permission
    )
  ) {
    return {
      error: NextResponse.json(
        {
          error: `Permission denied for role: ${verified.admin.role}`,
        },
        { status: 403 }
      ),
    };
  }

  return verified;
}