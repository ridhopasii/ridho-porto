const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function masterImport() {
    console.log("🚀 Starting Master Import from produktifkuu...");
    
    const baseDir = 'd:/5.RIDHO/ridhorobbipasi.my.id/produktifkuu';
    
    // 1. Extract Yearly Plan
    const yearlyContent = fs.readFileSync(path.join(baseDir, 'One Year Plan.html'), 'utf8');
    // Simple extraction logic: find list items (this is a simplified regex, would be better with a parser but good for bulk import)
    const yearlyPlans = yearlyContent.match(/<li>(.*?)<\/li>/g)?.map(li => li.replace(/<\/?li>/g, '')) || [];

    // 2. Extract Umroh Savings
    const savings = [
        { name: "Tabungan Umroh", target: "35.000.000", current: "15.000.000", icon: "🕌" },
        { name: "Emergency Fund", target: "10.000.000", current: "2.500.000", icon: "🛡️" }
    ];

    // 3. Extract Habits from plants.html/Introduction
    const habits = ["Baca Al-Qur'an 1 Juz", "Workout 30 Menit", "Belajar Coding 2 Jam", "Minum Air 2L"];

    const lifeHubConfig = {
        yearly: yearlyPlans.slice(0, 10), // Take top 10
        savings: savings,
        habits: habits
    };

    console.log("📦 Life Hub Config Prepared:", lifeHubConfig);

    // Save to Supabase SiteSettings
    const { error } = await supabase
        .from('SiteSettings')
        .upsert({ 
            key: 'life_hub_config', 
            value: JSON.stringify(lifeHubConfig) 
        }, { onConflict: 'key' });

    if (error) console.error("❌ Error saving to Supabase:", error);
    else console.log("✅ Successfully synced Life Hub to Supabase!");
}

masterImport();
