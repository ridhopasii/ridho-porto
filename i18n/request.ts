import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { supabaseServer } from "@/common/libs/supabase-server";

// Helper to set nested properties
function setNestedProperty(obj: any, path: string, value: any) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Load default static messages
  const messages = (await import(`../messages/${locale}.json`)).default;
  
  // Clone messages to avoid mutating cached static imports
  const dynamicMessages = JSON.parse(JSON.stringify(messages));

  try {
    // Fetch dynamic content overrides from Supabase
    const { data: pageContents } = await supabaseServer
      .from("PageContent")
      .select("page, key, value")
      .eq("locale", locale);

    if (pageContents && pageContents.length > 0) {
      pageContents.forEach((item) => {
        // Construct the path, e.g., "HomePage.intro" or "AboutPage.resume.paragraph_1"
        // In the DB, page might be 'home' -> we map it to 'HomePage'
        // If they enter 'HomePage' directly, we use it.
        const pageKey = item.page.toLowerCase() === 'home' ? 'HomePage' : 
                        item.page.toLowerCase() === 'about' ? 'AboutPage' : 
                        item.page;
        
        const fullPath = `${pageKey}.${item.key}`;
        setNestedProperty(dynamicMessages, fullPath, item.value);
      });
    }
  } catch (error) {
    console.error("Error fetching dynamic i18n content from Supabase:", error);
  }

  return {
    locale,
    messages: dynamicMessages,
  };
});
