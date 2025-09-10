### Visão Geral do Projeto

# **CONTROL-FINANCE**

O **CONTROL-FINANCE** é um sistema robusto para controle financeiro pessoal, projetado para substituir planilhas complexas por uma plataforma ágil, automatizada e segura. Permite gerenciar inserção de dados, relatórios, histórico de transações e toda a lógica de negócio do planejamento financeiro.

---

### Tecnologias

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express.js**: Framework web para criação de APIs RESTful.
- **MongoDB**: Banco de dados NoSQL flexível e escalável.
- **Mongoose**: ODM para modelagem de dados no MongoDB.
- **Docker**: Empacotamento da aplicação e banco de dados em contêineres.
- **Jest**: Framework para testes automatizados.
- **Docker Compose**: Orquestração dos serviços em contêineres.

---

### Instalação e Execução

Siga os passos abaixo para rodar o projeto localmente.

#### **Pré-requisitos**

- **Node.js** e **npm** instalados.
- **Docker** e **Docker Compose** instalados e em execução.

#### **Passo 1: Clonar o Repositório**

```bash
git clone https://github.com/silvaadrian/project-control-finance.git
cd project-control-finance
```

#### **Passo 2: Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
MONGO_URI=mongodb://localhost:27017/control-finance
PORT=5000
```

#### **Passo 3: Instalar Dependências**

```bash
npm install
```

#### **Passo 4: Iniciar o Banco de Dados com Docker**

```bash
docker-compose up -d
```

Esse comando baixa a imagem do MongoDB e inicia o contêiner em segundo plano.

#### **Passo 5: Iniciar a Aplicação**

```bash
npm run dev
```

O servidor será iniciado na porta 5000. Você verá a mensagem "Conexão com o MongoDB estabelecida com sucesso!" no terminal.

---

### Testes Automatizados

O projeto utiliza **Jest** para testes automatizados. Para rodar os testes:

```bash
npm test
```

Os testes cobrem as principais funcionalidades da API, garantindo maior confiabilidade e facilitando a manutenção.

---

O projeto utiliza o **Swagger** para documentar todas as rotas da API de forma interativa e acessível. Com o Swagger, é possível visualizar, testar e entender cada endpoint diretamente pelo navegador, facilitando o desenvolvimento e a integração com outros sistemas.

A documentação é atualizada conforme novas rotas são implementadas, garantindo que todas as funcionalidades estejam descritas de maneira clara e padronizada.

---

### Endpoints da API

Abaixo estão os principais endpoints disponíveis na API do **CONTROL-FINANCE**:

#### **Despesas**

- `POST /api/expenses` — Cria uma nova despesa.
- `GET /api/expenses` — Lista todas as despesas.
- `GET /api/expenses/:id` — Obtém detalhes de uma despesa específica.
- `PUT /api/expenses/:id` — Atualiza uma despesa existente.
- `DELETE /api/expenses/:id` — Remove uma despesa.

#### **Receitas**

- `POST /api/revenues` — Cria uma nova receita.
- `GET /api/revenues` — Lista todas as receitas.
- `GET /api/revenues/:id` — Obtém detalhes de uma receita específica.
- `PUT /api/revenues/:id` — Atualiza uma receita existente.
- `DELETE /api/revenues/:id` — Remove uma receita.

#### **Usuários**

- `POST /api/register` — Registra um novo usuário.
- `POST /api/login` — Realiza login do usuário.

#### **Relatórios**

- `GET /api/reports/summary` — Retorna um resumo financeiro (despesas, receitas, saldo).
- `GET /api/reports/expenses-by-category` — Lista despesas agrupadas por categoria.

#### **Dívidas**

- `POST /api/debts` — Cria uma nova dívida.
- `GET /api/debts` — Lista todas as dívidas.
- `GET /api/debts/:id` — Obtém detalhes de uma dívida específica.
- `PUT /api/debts/:id` — Atualiza uma dívida existente.
- `DELETE /api/debts/:id` — Remove uma dívida.

> Para detalhes completos de cada endpoint, consulte a documentação da API ou o código-fonte.

---

### Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

### Licença

Este projeto está sob a licença MIT.
