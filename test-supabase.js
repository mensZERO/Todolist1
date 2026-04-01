// Test koneksi Supabase
// Jalankan dengan: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pueaeklmjyebplutvyvz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZWFla2xtanllYnBsdXR2eXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTA2ODUsImV4cCI6MjA5MDYyNjY4NX0.gq8gAtDS4dRfjsULo15TLvC4ZL6c-N3cg2aTFzC-0-8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...\n');
  
  try {
    // Test 1: Fetch todos
    console.log('1. Fetching todos...');
    const { data, error } = await supabase
      .from('todos')
      .select('*');
    
    if (error) {
      console.error('❌ Error:', error.message);
      console.error('Details:', error);
    } else {
      console.log('✅ Success! Found', data.length, 'todos');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
