const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createConfirmedAdmin(email, password) {
  try {
    console.log('Creating confirmed admin user...');
    
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Create auth user with confirmation
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError) {
      console.error('Failed to create auth user:', authError.message);
      return false;
    }
    
    console.log('✅ Auth user created:', authData.user.id);
    
    // Try to add to admin table (will fail if table doesn't exist)
    try {
      const { error: adminError } = await supabaseAdmin
        .from('admin')
        .insert({
          user_id: authData.user.id,
          email: email,
          role: 'admin',
          created_at: new Date().toISOString()
        });
      
      if (adminError) {
        console.log('⚠️  Could not add to admin table:', adminError.message);
        console.log('Note: Admin table may not exist. Run SQL setup first.');
      } else {
        console.log('✅ User added to admin table');
      }
    } catch (err) {
      console.log('⚠️  Admin table issue:', err.message);
    }
    
    return true;
  } catch (err) {
    console.error('Error:', err.message);
    return false;
  }
}

// Get email and password from command line
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node createConfirmedAdmin.js <email> <password>');
  process.exit(1);
}

createConfirmedAdmin(email, password).then(success => {
  if (success) {
    console.log('\n✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nYou can now login at: https://ridhi-porto.vercel.app/admin/login');
  }
  process.exit(success ? 0 : 1);
});