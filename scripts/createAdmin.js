const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createFirstAdmin(email, password) {
  try {
    console.log('Creating first admin user...');
    
    // Use service role key for admin operations
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }
    
    console.log('✅ Auth user created:', authData.user.id);
    
    // Add to admin table
    const { error: adminError } = await supabaseAdmin
      .from('admin')
      .insert([
        {
          user_id: authData.user.id,
          email: email,
          role: 'admin'
        }
      ]);
    
    if (adminError) {
      console.error('Error adding to admin table:', adminError);
      // Try to clean up auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return;
    }
    
    console.log('✅ Admin record created');
    console.log('🎉 First admin created successfully!');
    console.log('Email:', email);
    console.log('You can now login at /admin/login');
    
  } catch (error) {
    console.error('❌ Error creating first admin:', error);
  }
}

// Run if called with arguments
if (process.argv.length >= 4) {
  const email = process.argv[2];
  const password = process.argv[3];
  createFirstAdmin(email, password);
} else {
  console.log('Usage: node createAdmin.js <email> <password>');
}

module.exports = { createFirstAdmin };