console.log('Testing DB connection...');
const { createClient } = require('@supabase/supabase-js');

// Simulate Next.js loading env vars?
// Usually they are loaded by Next.js, here we might need dotenv if running plain node
// But let's check what we see natively
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

console.log(`Using URL: ${url}`);
try {
    const supabase = createClient(url, key);
    console.log('Client created.');

    supabase.from('productos').select('id', { count: 'exact', head: true }).then(res => {
        console.log('Request finished.');
        console.log('Error:', res.error);
        console.log('Status:', res.status);
    }).catch(e => {
        console.error('Request crashed:', e);
    });
} catch (e) {
    console.error('Client creation crashed:', e);
}
