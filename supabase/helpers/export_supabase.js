const axios = require("axios");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "../../.env");
  if (!fs.existsSync(envPath)) {
    console.log("No .env found at", envPath);
    return {};
  }
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  content.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const parts = trimmed.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
      env[key] = val;
    }
  });
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  console.log("Loaded env keys:", Object.keys(env));
  process.exit(1);
}

// Map remote capitalized or specific names to local lowercase names for migration compatibility
const tableMap = {
  "Profile": "profile",
  "Experience": "experience",
  "Education": "education",
  "Skill": "skill",
  "Project": "project",
  "Service": "service",
  "Article": "article",
  "Social": "social",
  "Award": "award",
  "Testimonial": "testimonial",
  "Message": "message",
  "User": "admin_user",
  "admin": "admin_user",
  "YearlyPlan": "yearly_plan",
  "SiteSettings": "site_settings",
  "Wallets": "wallets",
  "wallets": "wallets",
  "Organization": "organization",
  "HabitConfig": "habit_config",
  "Productivity": "productivity",
  "FinancialTransactions": "financial_transactions",
  "financialtransactions": "financial_transactions",
  "Gallery": "gallery",
  "MonthlyTracker": "monthly_tracker",
  "TabunganUmroh": "tabungan_umroh",
  "Passkeys": "passkeys",
  "Publication": "publication"
};

async function exportAllData() {
  console.log("Fetching schema endpoints from PostgREST...");
  const res = await axios.get(url + "/rest/v1/", {
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`
    }
  });

  const endpoints = Object.keys(res.data.paths)
    .map(p => p.slice(1)) // Remove leading slash
    .filter(p => p && !p.startsWith("rpc") && p !== "/");

  console.log(`Found ${endpoints.length} tables to export.`);

  let sqlContent = `/* Supabase Data Export Generated at ${new Date().toISOString()} */\n\nBEGIN;\n\n`;

  for (const endpoint of endpoints) {
    const localTableName = tableMap[endpoint] || endpoint.toLowerCase();
    console.log(`Fetching data from remote table "${endpoint}" (mapping to "${localTableName}")...`);
    
    try {
      const response = await axios.get(`${url}/rest/v1/${endpoint}`, {
        headers: {
          "apikey": key,
          "Authorization": `Bearer ${key}`,
          "Range-Unit": "items"
        }
      });

      const data = response.data;
      if (!Array.isArray(data) || data.length === 0) {
        console.log(`Table "${endpoint}" is empty. Skipping.`);
        continue;
      }

      sqlContent += `-- Data for table: ${localTableName} (from remote: ${endpoint})\n`;
      sqlContent += `TRUNCATE TABLE "${localTableName}" RESTART IDENTITY CASCADE;\n\n`;

      for (const row of data) {
        const keys = Object.keys(row);
        const values = keys.map(key => {
          const val = row[key];
          if (val === null || val === undefined) {
            return "NULL";
          }
          if (typeof val === "string") {
            return `'${val.replace(/'/g, "''")}'`;
          }
          if (typeof val === "object") {
            return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
          }
          if (typeof val === "boolean") {
            return val ? "true" : "false";
          }
          return val;
        });

        sqlContent += `INSERT INTO "${localTableName}" (${keys.map(k => `"${k}"`).join(", ")}) VALUES (${values.join(", ")});\n`;
      }
      sqlContent += "\n";
    } catch (err) {
      console.warn(`Warning: Failed to export table "${endpoint}":`, err.message);
    }
  }

  sqlContent += "COMMIT;\n";

  const outputPath = path.join(__dirname, "../migrations/002_seed.sql");
  fs.writeFileSync(outputPath, sqlContent, "utf-8");
  console.log(`\nSuccessfully exported all remote database data to ${outputPath}`);
}

exportAllData().catch(err => {
  console.error("Export script failed:", err);
  process.exit(1);
});
