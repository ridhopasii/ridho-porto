const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function testAdminLogin(email, password) {
  try {
    console.log('Testing admin login...');
    
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    // Try to login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login failed:', error.message);
      return false;
    }
    
    console.log('✅ Login successful!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    
    // Check if user has admin role
    const { data: adminData, error: adminError } = await supabase
      .from('admin')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
    
    if (adminError || !adminData) {
      console.log('⚠️  User is not in admin table');
      console.log('Note: You need to run the SQL setup to create admin table');
    } else {
      console.log('✅ User is admin:', adminData);
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
  console.log('Usage: node testAdminLogin.js <email> <password>');
  process.exit(1);
}

testAdminLogin(email, password).then(success => {
  process.exit(success ? 0 : 1);
});