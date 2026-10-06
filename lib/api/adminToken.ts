import { auth } from "@/firebase/auth";
import { onAuthStateChanged, type User } from "firebase/auth";

async function currentUser(): Promise<User> {
  if (auth.currentUser) return auth.currentUser;
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      unsubscribe();
      reject(new Error("You are not signed in."));
    }, 8000);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      window.clearTimeout(timeout);
      unsubscribe();
      if (user) resolve(user);
      else reject(new Error("You are not signed in."));
    });
  });
}

export async function getAdminAuthHeaders() {
  const user = await currentUser();
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const authHeaders = await getAdminAuthHeaders();
  Object.entries(authHeaders).forEach(([key, value]) => headers.set(key, value));
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(input, { ...init, headers, cache: "no-store" });
}
