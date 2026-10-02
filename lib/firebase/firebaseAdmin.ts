import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function cleanEnv(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

const projectId = cleanEnv(process.env.FIREBASE_ADMIN_PROJECT_ID);
const clientEmail = cleanEnv(process.env.FIREBASE_ADMIN_CLIENT_EMAIL)?.replace(/,$/, "");
const privateKey = cleanEnv(process.env.FIREBASE_ADMIN_PRIVATE_KEY)
  ?.replace(/\\r/g, "")
  ?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "Missing Firebase Admin environment variables. Run: node scripts/setup-firebase-admin-env.mjs \"your-service-account.json\""
  );
}

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    : getApps()[0];

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
