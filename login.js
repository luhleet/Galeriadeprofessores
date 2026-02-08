// Substitua pelos seus dados do Supabase
const SUPABASE_URL = 'COLOQUE_SUA_SUPABASE_URL_AQUI';
const SUPABASE_KEY = 'COLOQUE_SUA_SUPABASE_KEY_AQUI';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.querySelector('#loginForm input[type="email"]').value;
  const senha = document.querySelector('#loginForm input[type="password"]').value;

  // Criptografa a senha usando SHA-256
  async function hashSenha(senha) {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const senhaHash = await hashSenha(senha);

  // Busca usuário pelo email e senha criptografada
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('senha', senhaHash)
    .single();

  if (error || !data) {
    alert('Email ou senha incorretos!');
  } else {
    // Salva o email do usuário logado para uso em outras páginas
    localStorage.setItem('usuario_email', email);
    alert('Login realizado com sucesso!');
    // Redirecionar para painel interno
    window.location.href = 'painel.html';
  }
});