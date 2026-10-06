import fs from "node:fs";
import path from "node:path";

const jsonPath = process.argv[2];

if (!jsonPath) {
  console.error('Usage: node scripts/setup-firebase-admin-env.mjs "service-account.json"');
  process.exit(1);
}

const resolvedJson = path.resolve(process.cwd(), jsonPath);

if (!fs.existsSync(resolvedJson)) {
  console.error(`Service-account file not found: ${resolvedJson}`);
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync(resolvedJson, "utf8"));
} catch (error) {
  console.error("Could not read the Firebase service-account JSON.");
  console.error(error);
  process.exit(1);
}

const { project_id: projectId, client_email: clientEmail, private_key: privateKey } = serviceAccount;

if (!projectId || !clientEmail || !privateKey) {
  console.error("The JSON is missing project_id, client_email or private_key.");
  process.exit(1);
}

const envPath = path.resolve(process.cwd(), ".env");
const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

const values = {
  FIREBASE_ADMIN_PROJECT_ID: String(projectId),
  FIREBASE_ADMIN_CLIENT_EMAIL: String(clientEmail),
  FIREBASE_ADMIN_PRIVATE_KEY: String(privateKey).replace(/\r?\n/g, "\\n"),
};

let output = existing;

for (const [key, value] of Object.entries(values)) {
  const line = `${key}="${value.replace(/"/g, '\"')}"`;
  const pattern = new RegExp(`^${key}=.*$`, "m");

  if (pattern.test(output)) {
    output = output.replace(pattern, line);
  } else {
    output = `${output.trimEnd()}\n${line}\n`;
  }
}

fs.writeFileSync(envPath, output, "utf8");

console.log("");
console.log("Firebase Admin environment configured successfully.");
console.log("");
console.log(`Project: ${projectId}`);
console.log(`Client:  ${clientEmail}`);
console.log(`File:    ${envPath}`);
console.log("");
console.log("The private key was written to .env.");
console.log("Keep .env private and never commit it to Git.");
console.log("Restart your Next.js development server after this.");
