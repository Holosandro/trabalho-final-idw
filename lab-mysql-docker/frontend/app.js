const loginForm = document.getElementById('login-form');
const loginMensagem = document.getElementById('login-mensagem');
const logoutBtn = document.getElementById('logout-btn');

const loginView = document.getElementById('login-view');
const crudView = document.getElementById('crud-view');

const form = document.getElementById('usuario-form');
const idInput = document.getElementById('usuario-id');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const tabela = document.getElementById('usuarios-tabela');
const mensagem = document.getElementById('mensagem');
const cancelarEdicaoBtn = document.getElementById('cancelar-edicao');

const API_URL = 'http://localhost:3000';

function alternarViews(logado) {
  if (logado) {
    loginView.style.display = 'none';
    crudView.style.display = 'flex';
    logoutBtn.style.display = 'block';
  } else {
    loginView.style.display = 'flex';
    crudView.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
}

function mostrarMensagem(texto, erro = false, elemento = mensagem) {
  elemento.textContent = texto;
  elemento.style.color = erro ? '#b42318' : '#0b5b55';
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const usuario = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();

  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ usuario, senha })
  });

  const data = await resposta.json();
  if (!resposta.ok) {
    mostrarMensagem(data.erro || 'Falha no login', true, loginMensagem);
    return;
  }
  
  mostrarMensagem(data.mensagem, false, loginMensagem);
  alternarViews(true);
  carregarUsuarios();
});

logoutBtn.addEventListener('click', async () => {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  alternarViews(false);
  document.getElementById('usuario').value = '';
  document.getElementById('senha').value = '';
  loginMensagem.textContent = '';
});

function limparFormulario() {
  idInput.value = '';
  nomeInput.value = '';
  emailInput.value = '';
}

async function carregarUsuarios() {
  const resposta = await fetch(`${API_URL}/usuarios`, { credentials: 'include' });
  
  if (!resposta.ok) {
     if (resposta.status === 401) alternarViews(false);
     return;
  }
  
  const usuarios = await resposta.json();
  alternarViews(true);
  tabela.innerHTML = '';

  usuarios.forEach((usuario) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nome}</td>
      <td>${usuario.email}</td>
      <td>
        <button class="acao" data-editar="${usuario.id}">Editar</button>
        <button class="acao btn-excluir" data-excluir="${usuario.id}">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

async function salvarUsuario(event) {
  event.preventDefault();

  const id = idInput.value;
  const payload = {
    nome: nomeInput.value.trim(),
    email: emailInput.value.trim()
  };

  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/usuarios/${id}` : `${API_URL}/usuarios`;

  const resposta = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    mostrarMensagem(erro.erro || 'Falha ao salvar usuario', true);
    return;
  }

  mostrarMensagem(id ? 'Usuario atualizado com sucesso' : 'Usuario criado com sucesso');
  limparFormulario();
  carregarUsuarios();
}

async function excluirUsuario(id) {
  const confirmar = window.confirm('Deseja excluir este usuario?');
  if (!confirmar) return;

  const resposta = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!resposta.ok) {
    mostrarMensagem('Falha ao excluir usuario', true);
    return;
  }

  mostrarMensagem('Usuario excluido com sucesso');
  carregarUsuarios();
}

async function editarUsuario(id) {
  const resposta = await fetch(`${API_URL}/usuarios/${id}`, { credentials: 'include' });
  if (!resposta.ok) return;
  
  const usuario = await resposta.json();

  idInput.value = usuario.id;
  nomeInput.value = usuario.nome;
  emailInput.value = usuario.email;
}

form.addEventListener('submit', salvarUsuario);

cancelarEdicaoBtn.addEventListener('click', () => {
  limparFormulario();
  mostrarMensagem('Edicao cancelada');
});

tabela.addEventListener('click', (event) => {
  const editarId = event.target.getAttribute('data-editar');
  const excluirId = event.target.getAttribute('data-excluir');

  if (editarId) editarUsuario(editarId);
  if (excluirId) excluirUsuario(excluirId);
});

carregarUsuarios();
