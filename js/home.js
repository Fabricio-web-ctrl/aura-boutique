/* ============================================
   RF01 · Login e Cadastro com Axios
   ============================================ */

// ===== Alternância de abas =====
const tabs = document.querySelector('.tabs');
const tabButtons = document.querySelectorAll('.tab');
const formLogin = document.getElementById('formLogin');
const formCadastro = document.getElementById('formCadastro');

function switchTab(target) {
  tabs.dataset.active = target;
  tabButtons.forEach((b) => b.classList.toggle('active', b.dataset.tab === target));
  formLogin.classList.toggle('active', target === 'login');
  formCadastro.classList.toggle('active', target === 'cadastro');
  document.getElementById('feedbackLogin').className = 'feedback';
  document.getElementById('feedbackCadastro').className = 'feedback';
}
tabButtons.forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.tab)));
document.querySelectorAll('[data-switch]').forEach((l) =>
  l.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab(l.dataset.switch);
  })
);

// ===== Mostrar/ocultar senha =====
document.querySelectorAll('.toggle-eye').forEach((btn) => {
  btn.addEventListener('click', () => {
    const inp = document.getElementById(btn.dataset.target);
    const isPass = inp.type === 'password';
    inp.type = isPass ? 'text' : 'password';
    btn.textContent = isPass ? '🙈' : '👁';
  });
});

// ===== Máscaras =====
const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = v;
});

const telInput = document.getElementById('telefone');
telInput.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  e.target.value = v;
});

// ============================================
// LOGIN
// ============================================
const feedbackLogin = document.getElementById('feedbackLogin');
const btnLogin = document.getElementById('btnLogin');

if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedbackLogin.className = 'feedback';

    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
      feedbackLogin.className = 'feedback erro';
      feedbackLogin.textContent = '⚠ Preencha e-mail e senha.';
      return;
    }

    btnLogin.disabled = true;
    btnLogin.textContent = 'Entrando...';

    try {
      const resposta = await axios.post('http://localhost:3000/login', {
        email,
        senha,
      });

      alert(`Bem-vindo(a), ${resposta.data.usuario.nome}!`);

      localStorage.setItem('usuarioLogado', resposta.data.usuario.email);
      window.location.href = 'inicio.html';

    } catch (erro) {
      console.error('Erro ao logar:', erro);
      const msgErro = erro.response?.data?.erro || 'E-mail ou senha incorretos.';

      feedbackLogin.className = 'feedback erro';
      feedbackLogin.textContent = '⚠ ' + msgErro;
    } finally {
      btnLogin.disabled = false;
      btnLogin.textContent = 'Entrar';
    }
  });
}

// ============================================
// CADASTRO
// ============================================
const feedbackCadastro = document.getElementById('feedbackCadastro');
const btnCadastro = document.getElementById('btnCadastro');

if (formCadastro) {
  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedbackCadastro.className = 'feedback';

    const nome = document.getElementById('nome').value.trim();
    const cpf = cpfInput.value.trim();
    const telefone = telInput.value.trim();
    const email = document.getElementById('emailCadastro').value.trim().toLowerCase();
    const senha = document.getElementById('senhaCadastro').value;
    const confirma = document.getElementById('confirma').value;
    const estilo = formCadastro.querySelector('input[name="estilo"]:checked');

    const falhar = (msg) => {
      feedbackCadastro.className = 'feedback erro';
      feedbackCadastro.textContent = '⚠ ' + msg;
    };

    if (nome.length < 3) return falhar('Informe o nome completo.');
    if (cpf.replace(/\D/g, '').length !== 11) return falhar('CPF inválido.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return falhar('E-mail inválido.');
    if (senha.length < 6) return falhar('Senha mínima de 6 caracteres.');
    if (senha !== confirma) return falhar('As senhas não conferem.');
    if (!estilo) return falhar('Selecione um estilo preferido.');

    btnCadastro.disabled = true;
    btnCadastro.textContent = 'Cadastrando...';

    try {
      const resposta = await axios.post('http://localhost:3000/clientes', {
        nome,
        cpf: cpf.replace(/\D/g, ''),
        telefone: telefone.replace(/\D/g, ''),
        email,
        senha,
        estilo: estilo.value,
      });

      alert(`Conta criada com sucesso!\nBem-vindo(a), ${resposta.data.nome || nome}!`);

      localStorage.setItem('usuarioLogado', resposta.data.email || email);
      window.location.href = 'inicio.html';

    } catch (erro) {
      console.error('Erro ao cadastrar:', erro);
      const msgErro = erro.response?.data?.erro || 'Não foi possível criar a conta.';
      feedbackCadastro.className = 'feedback erro';
      feedbackCadastro.textContent = '⚠ ' + msgErro;
    } finally {
      btnCadastro.disabled = false;
      btnCadastro.textContent = 'Criar conta';
    }
  });
}