require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Erro ao conectar ao Supabase:', error.message);
  } else {
    console.log('Conexão bem-sucedida! Dados:', data);
  }
}

testConnection();