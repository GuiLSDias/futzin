const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  const { data: users, error } = await supabase.from('users').select('*');
  const { data: auth, error: authErr } = await supabase.auth.admin.listUsers();
  
  if (error || authErr) {
    console.error('Error:', error, authErr);
  } else {
    console.log('Public users count:', users.length, 'Auth users count:', auth.users.length);
    console.log('Public Users IDs:', users.map(u => u.id));
    console.log('Auth Users IDs:', auth.users.map(u => u.id));
  }
}
test();
