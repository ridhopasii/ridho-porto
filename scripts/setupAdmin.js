const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function setupAdminTable() {
  try {
    console.log('Setting up admin table and RLS policies...');
    
    const sqlPath = path.join(__dirname, '../supabase_admin_setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    const supabase = getSupabase();
    
    // Execute the SQL in parts to avoid timeout issues
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          query: statement.trim() 
        });
        
        if (error) {
          console.error('Error executing statement:', error);
          throw error;
        }
      } catch (err) {
        // If rpc doesn't exist, try direct query
        try {
          const { error } = await supabase.rpc('execute_sql', { 
            sql: statement.trim() 
          });
          
          if (error) {
            console.error('Error executing statement:', error);
            throw error;
          }
        } catch (fallbackErr) {
          console.log('Note: Could not execute SQL via RPC. Please run the SQL manually in Supabase dashboard.');
          console.log('SQL file created at:', sqlPath);
          return;
        }
      }
    }
    
    console.log('✅ Admin table and RLS policies setup complete!');
  } catch (error) {
    console.error('❌ Error setting up admin table:', error);
    console.log('Please run the SQL file manually in Supabase dashboard:');
    console.log('File:', path.join(__dirname, '../supabase_admin_setup.sql'));
  }
}

// Run if called directly
if (require.main === module) {
  setupAdminTable();
}

module.exports = { setupAdminTable };