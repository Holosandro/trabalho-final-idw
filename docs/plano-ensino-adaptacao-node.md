# Roteiro de Implementacao do Projeto Ate o CRUD

Este documento foi escrito para orientar voces na leitura do projeto modelo e na implementacao gradual das mudancas necessarias ate a entrega de um CRUD completo de usuarios.

O projeto base nao foi construido em PHP. Ele usa:

- `Node.js`
- `Express`
- `MySQL`
- `Docker Compose`

Por isso, neste roteiro, voces vao atingir os mesmos objetivos do plano de ensino usando a linguagem atual do projeto.

## Branch de trabalho

Para organizar esta atividade, foi criada a branch:

`plano-ensino-node-crud`

## 1. Entendendo o projeto modelo

Antes de implementar qualquer mudanca, voces precisam entender o que o projeto já faz.

### Tecnologias usadas

- `Docker Compose` para orquestracao
- `MySQL 8` como banco de dados
- `Node.js + Express` como backend
- `mysql2` para conexao com o banco

### Estrutura atual

```text
lab-mysql-docker/
├── docker-compose.yml
├── db/init.sql
└── app/
    ├── Dockerfile
    ├── index.js
    └── package.json
```

### O que o projeto ja entrega

- um container do MySQL com volume persistente
- um script SQL inicial
- uma API com rota `GET /usuarios`
- uma conexao entre backend e banco de dados

### O que voces ainda precisam construir

- front-end HTML do projeto
- estilos CSS
- responsividade
- formulario de cadastro
- servidor NGINX para servir arquivos estaticos
- integracao entre front-end e backend
- CRUD completo
- validacao de entrada
- sessao e autenticacao simples

## 2. Relacao com o plano de ensino

O plano de ensino foi pensado em uma sequencia que passa por:

- HTML
- CSS
- responsividade
- Docker Compose
- servidor web
- programacao no servidor
- banco de dados
- CRUD

Neste projeto, voces nao vao trocar a stack para PHP. Em vez disso, vao aplicar os mesmos conceitos usando `Node.js` e `Express`.

### Equivalencias importantes

Quando o plano mencionar PHP, usem os equivalentes abaixo:

- variaveis e sintaxe: `JavaScript no Node.js`
- `$_GET`: `req.query`
- `$_POST`: `req.body`
- sessao: `express-session`
- conexao com MySQL: `mysql2` ou `mysql2/promise`

O objetivo continua o mesmo:

- receber dados de formularios
- processar esses dados no servidor
- gravar no banco
- listar registros
- editar registros
- remover registros

## 3. Ordem recomendada de implementacao

Sigam esta ordem para construir o projeto com mais seguranca:

1. Criar `frontend/index.html` com estrutura semantica.
2. Criar `frontend/styles.css` com layout responsivo.
3. Adicionar o servico `nginx` no `docker-compose.yml`.
4. Refatorar o backend para a estrutura `server.js`, `routes`, `controllers` e `services`.
5. Criar `frontend/app.js` para integrar formulario e API.
6. Implementar `GET`, `POST`, `PUT` e `DELETE`.
7. Adicionar validacoes.
8. Evoluir para sessao e autenticacao simples.
9. Revisar a documentacao do projeto.

## 4. Estrutura final esperada

Ao final da implementacao, a estrutura do projeto pode ficar assim:

```text
lab-mysql-docker/
├── docker-compose.yml
├── db/
│   └── init.sql
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── nginx/
│   └── default.conf
└── app/
    ├── Dockerfile
    ├── package.json
    ├── server.js
    ├── db.js
    ├── routes/
    │   ├── usuarios.js
    │   └── auth.js
    ├── controllers/
    │   └── usuariosController.js
    ├── services/
    │   └── usuariosService.js
    └── middlewares/
        └── auth.js
```

## 5. Comandos para criar a estrutura base

Executem estes comandos para criar os diretorios e arquivos principais:

```bash
mkdir -p lab-mysql-docker/frontend
mkdir -p lab-mysql-docker/nginx
mkdir -p lab-mysql-docker/app/routes
mkdir -p lab-mysql-docker/app/controllers
mkdir -p lab-mysql-docker/app/services
mkdir -p lab-mysql-docker/app/middlewares

touch lab-mysql-docker/frontend/index.html
touch lab-mysql-docker/frontend/styles.css
touch lab-mysql-docker/frontend/app.js

touch lab-mysql-docker/nginx/default.conf

touch lab-mysql-docker/app/server.js
touch lab-mysql-docker/app/db.js
touch lab-mysql-docker/app/routes/usuarios.js
touch lab-mysql-docker/app/routes/auth.js
touch lab-mysql-docker/app/controllers/usuariosController.js
touch lab-mysql-docker/app/services/usuariosService.js
touch lab-mysql-docker/app/middlewares/auth.js
```

Se voces quiserem preservar o arquivo antigo `index.js`, uma opcao simples e:

```bash
mv lab-mysql-docker/app/index.js lab-mysql-docker/app/index.js.bak
```

Se preferirem copiar a base atual para o novo ponto de entrada:

```bash
cp lab-mysql-docker/app/index.js lab-mysql-docker/app/server.js
```

## 6. Roteiro por aula

### Aula 2 - HTML

Nesta etapa, voces vao criar a pagina principal do projeto.

Comandos:

```bash
mkdir -p lab-mysql-docker/frontend
touch lab-mysql-docker/frontend/index.html
```

Copiem este conteudo para `lab-mysql-docker/frontend/index.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Laboratorio CRUD de Usuarios</title>
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <header class="site-header">
    <h1>Laboratorio CRUD de Usuarios</h1>
    <p>Projeto didatico com HTML, CSS, Docker, Node.js e MySQL.</p>
  </header>

  <main class="layout">
    <section class="panel">
      <h2>Cadastro de Usuario</h2>

      <form id="usuario-form">
        <input type="hidden" id="usuario-id" name="id" />

        <div class="field">
          <label for="nome">Nome</label>
          <input type="text" id="nome" name="nome" required />
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div class="actions">
          <button type="submit">Salvar</button>
          <button type="button" id="cancelar-edicao">Cancelar edicao</button>
        </div>
      </form>

      <p id="mensagem" class="mensagem" aria-live="polite"></p>
    </section>

    <section class="panel">
      <h2>Usuarios cadastrados</h2>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody id="usuarios-tabela"></tbody>
        </table>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <small>Disciplina de desenvolvimento web com containers</small>
  </footer>

  <script src="./app.js"></script>
</body>
</html>
```

O que deve acontecer ao final desta etapa:

- a pagina principal ja existe
- a estrutura semantica ja esta pronta
- o formulario e a tabela ja aparecem no HTML

### Aula 3 e 4 - CSS e responsividade

Agora voces vao aplicar estilos e organizar o layout para desktop e mobile.

Comando:

```bash
touch lab-mysql-docker/frontend/styles.css
```

Copiem este conteudo para `lab-mysql-docker/frontend/styles.css`:

```css
:root {
  --bg: #f4f1ea;
  --panel: #fffdf8;
  --line: #d7cfc2;
  --text: #2f2a24;
  --muted: #6b6257;
  --accent: #0f766e;
  --accent-dark: #0b5b55;
  --danger: #b42318;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Segoe UI", sans-serif;
  background: linear-gradient(180deg, #f6f1e8 0%, #ebe3d3 100%);
  color: var(--text);
}

.site-header,
.site-footer {
  padding: 24px;
  text-align: center;
}

.layout {
  width: min(1100px, calc(100% - 32px));
  margin: 0 auto 32px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.panel {
  flex: 1;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(40, 30, 20, 0.08);
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.field input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  font-size: 16px;
}

.actions {
  display: flex;
  gap: 12px;
}

button {
  border: 0;
  border-radius: 10px;
  padding: 12px 16px;
  cursor: pointer;
  background: var(--accent);
  color: white;
  font-weight: 600;
}

button:hover {
  background: var(--accent-dark);
}

#cancelar-edicao {
  background: #8a8175;
}

.mensagem {
  min-height: 24px;
  color: var(--accent-dark);
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 12px;
  text-align: left;
}

td .acao {
  margin-right: 8px;
}

.btn-excluir {
  background: var(--danger);
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
}
```

O que deve acontecer ao final desta etapa:

- a pagina deixa de ser apenas estrutural
- o formulario e a tabela ficam organizados visualmente
- o layout responde melhor em telas menores

### Aula 5 - NGINX e Docker Compose

Nesta etapa, voces vao servir o front-end com NGINX.

Comandos:

```bash
mkdir -p lab-mysql-docker/nginx
touch lab-mysql-docker/nginx/default.conf
```

Copiem este conteudo para `lab-mysql-docker/nginx/default.conf`:

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Atualizem `lab-mysql-docker/docker-compose.yml` para esta estrutura:

```yaml
version: '3.9'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql_lab
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: lab_db
      MYSQL_USER: user
      MYSQL_PASSWORD: user123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql

  app:
    build: ./app
    container_name: app_lab
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - mysql

  nginx:
    image: nginx:alpine
    container_name: nginx_lab
    restart: always
    ports:
      - "8080:80"
    volumes:
      - ./frontend:/usr/share/nginx/html
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app

volumes:
  mysql_data:
```

O que deve acontecer ao final desta etapa:

- o front-end passa a ser servido pelo NGINX
- o backend continua separado como API
- o banco continua no container MySQL

### Aula 6 - Estruturar o backend

Aqui voces vao sair de um arquivo unico e organizar melhor a aplicacao.

Comandos:

```bash
mkdir -p lab-mysql-docker/app/routes
mkdir -p lab-mysql-docker/app/controllers
mkdir -p lab-mysql-docker/app/services
touch lab-mysql-docker/app/server.js
touch lab-mysql-docker/app/db.js
touch lab-mysql-docker/app/routes/usuarios.js
touch lab-mysql-docker/app/controllers/usuariosController.js
touch lab-mysql-docker/app/services/usuariosService.js
```

Copiem este conteudo para `lab-mysql-docker/app/server.js`:

```js
const express = require('express');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/usuarios', usuariosRoutes);

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});
```

Copiem este conteudo para `lab-mysql-docker/app/db.js`:

```js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql',
  user: 'user',
  password: 'user123',
  database: 'lab_db',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
```

Copiem este conteudo para `lab-mysql-docker/app/routes/usuarios.js`:

```js
const express = require('express');
const controller = require('../controllers/usuariosController');

const router = express.Router();

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;
```

O que voces devem entender nesta etapa:

- `server.js` inicializa o Express
- `db.js` concentra a conexao com o banco
- `routes/usuarios.js` define as rotas

### Aula 7 e Aula 10 - Implementar o CRUD

Agora voces vao concluir a parte principal do projeto.

Copiem este conteudo para `lab-mysql-docker/app/controllers/usuariosController.js`:

```js
const service = require('../services/usuariosService');

async function listar(req, res) {
  const usuarios = await service.listar();
  res.json(usuarios);
}

async function buscarPorId(req, res) {
  const usuario = await service.buscarPorId(req.params.id);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuario nao encontrado' });
  }

  return res.json(usuario);
}

async function criar(req, res) {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email sao obrigatorios' });
  }

  const usuario = await service.criar({ nome, email });
  return res.status(201).json(usuario);
}

async function atualizar(req, res) {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email sao obrigatorios' });
  }

  const usuario = await service.atualizar(req.params.id, { nome, email });

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuario nao encontrado' });
  }

  return res.json(usuario);
}

async function remover(req, res) {
  const removido = await service.remover(req.params.id);

  if (!removido) {
    return res.status(404).json({ erro: 'Usuario nao encontrado' });
  }

  return res.status(204).send();
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};
```

Copiem este conteudo para `lab-mysql-docker/app/services/usuariosService.js`:

```js
const db = require('../db');

async function listar() {
  const [rows] = await db.query('SELECT id, nome, email FROM usuarios ORDER BY id DESC');
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await db.query(
    'SELECT id, nome, email FROM usuarios WHERE id = ?',
    [id]
  );

  return rows[0] || null;
}

async function criar({ nome, email }) {
  const [result] = await db.query(
    'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
    [nome, email]
  );

  return buscarPorId(result.insertId);
}

async function atualizar(id, { nome, email }) {
  const [result] = await db.query(
    'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
    [nome, email, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return buscarPorId(id);
}

async function remover(id) {
  const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};
```

Comando:

```bash
touch lab-mysql-docker/frontend/app.js
```

Copiem este conteudo para `lab-mysql-docker/frontend/app.js`:

```js
const form = document.getElementById('usuario-form');
const idInput = document.getElementById('usuario-id');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const tabela = document.getElementById('usuarios-tabela');
const mensagem = document.getElementById('mensagem');
const cancelarEdicaoBtn = document.getElementById('cancelar-edicao');

const API_URL = 'http://localhost:3000/usuarios';

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.style.color = erro ? '#b42318' : '#0b5b55';
}

function limparFormulario() {
  idInput.value = '';
  nomeInput.value = '';
  emailInput.value = '';
}

async function carregarUsuarios() {
  const resposta = await fetch(API_URL);
  const usuarios = await resposta.json();

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
  const url = id ? `${API_URL}/${id}` : API_URL;

  const resposta = await fetch(url, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json'
    },
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

  if (!confirmar) {
    return;
  }

  const resposta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!resposta.ok) {
    mostrarMensagem('Falha ao excluir usuario', true);
    return;
  }

  mostrarMensagem('Usuario excluido com sucesso');
  carregarUsuarios();
}

async function editarUsuario(id) {
  const resposta = await fetch(`${API_URL}/${id}`);
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

  if (editarId) {
    editarUsuario(editarId);
  }

  if (excluirId) {
    excluirUsuario(excluirId);
  }
});

carregarUsuarios();
```

O que deve funcionar ao final desta etapa:

- cadastrar usuario
- listar usuarios
- editar usuario
- excluir usuario

### Aula 8 - Sessao e autenticacao simples

Esta etapa pode ser implementada depois que o CRUD principal estiver funcionando.

Comandos:

```bash
mkdir -p lab-mysql-docker/app/middlewares
touch lab-mysql-docker/app/routes/auth.js
touch lab-mysql-docker/app/middlewares/auth.js
```

Quando chegarem nesta etapa, atualizem `lab-mysql-docker/app/package.json` para incluir:

```json
{
  "name": "app",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.18.0",
    "mysql2": "^3.6.0"
  }
}
```

Copiem este conteudo para `lab-mysql-docker/app/routes/auth.js`:

```js
const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === 'admin' && senha === '123456') {
    req.session.usuario = { nome: 'admin' };
    return res.json({ mensagem: 'Login realizado com sucesso' });
  }

  return res.status(401).json({ erro: 'Credenciais invalidas' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ mensagem: 'Logout realizado com sucesso' });
  });
});

module.exports = router;
```

Copiem este conteudo para `lab-mysql-docker/app/middlewares/auth.js`:

```js
function exigirLogin(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ erro: 'Acesso nao autorizado' });
  }

  return next();
}

module.exports = exigirLogin;
```

Quando voces chegarem nesta aula, `lab-mysql-docker/app/server.js` pode evoluir para esta versao:

```js
const express = require('express');
const session = require('express-session');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'segredo-lab',
    resave: false,
    saveUninitialized: false
  })
);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});
```

### Aula 9 - Banco de dados

Nesta etapa, voces vao consolidar a tabela usada pelo CRUD.

Comando:

```bash
touch lab-mysql-docker/db/init.sql
```

Copiem este conteudo para `lab-mysql-docker/db/init.sql`:

```sql
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome, email)
VALUES
    ('Ana Silva', 'ana@email.com'),
    ('Carlos Souza', 'carlos@email.com')
ON DUPLICATE KEY UPDATE
    nome = VALUES(nome),
    email = VALUES(email);
```

## 7. Ajustes importantes em arquivos existentes

### `lab-mysql-docker/app/Dockerfile`

Usem este conteudo:

```dockerfile
FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### `lab-mysql-docker/docker-compose.yml`

Este arquivo deve refletir a separacao entre:

- `nginx` para front-end
- `app` para API
- `mysql` para banco

## 8. Como executar o projeto

Depois de preparar os arquivos, subam o ambiente com:

```bash
cd lab-mysql-docker
docker compose up --build -d
```

## 9. O que deve funcionar ao final

Ao final da implementacao, voces devem conseguir:

- abrir o front-end em `http://localhost:8080`
- acessar a API em `http://localhost:3000`
- testar a rota `http://localhost:3000/health`
- cadastrar usuarios
- listar usuarios
- editar usuarios
- excluir usuarios
- confirmar que os dados foram gravados no MySQL

## 10. Escopo minimo da entrega

Se a meta da turma for chegar ate a parte equivalente a "PHP e MySQL", mas usando a stack atual, o escopo minimo da entrega deve ser:

- front-end HTML/CSS
- NGINX servindo os arquivos estaticos
- API Node.js recebendo dados de formulario
- MySQL persistindo usuarios
- `Create` e `Read` funcionando primeiro
- depois `Update` e `Delete`

Em termos didaticos, voces estarao substituindo:

- formularios em PHP
- conexao PHP com MySQL
- CRUD basico em PHP

Por:

- formularios HTML com JavaScript
- backend em Node.js/Express
- CRUD com MySQL na stack atual

## 11. Fechamento

Este projeto nao precisa ser migrado para PHP para atender ao plano de ensino. O mais coerente e implementar os mesmos objetivos usando a stack atual, porque:

- a base do projeto ja esta pronta em Node.js
- Docker e MySQL ja estao integrados
- a migracao de linguagem aumentaria o trabalho sem necessidade
- os objetivos pedagogicos continuam sendo atendidos

Se voces seguirem este roteiro por etapas, o projeto evolui de um laboratorio simples de API para uma entrega completa com:

- HTML
- CSS
- responsividade
- NGINX
- Docker Compose
- backend server-side
- sessao
- CRUD com MySQL
