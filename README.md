# Lab CRUD

Cadastro de usuarios com nome e email. Trabalho da disciplina.

HTML, CSS, JS no front. Node e Express na API. MySQL no banco. Docker sobe tudo.

Entrar na pasta e rodar:

```
cd lab-mysql-docker
docker compose up --build -d
```

Site: http://localhost:8080  
API: http://localhost:3000

Apagar dados do banco: `docker compose down -v`

Rotas: `/usuarios` (CRUD) e `/auth/login`. Precisa logar pra usar usuarios.

Codigo em `lab-mysql-docker/`. Docs das aulas na pasta `docs/`.
