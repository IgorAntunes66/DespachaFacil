# Despacha Fácil[cite: 20]

Aplicação web e API desenvolvida em **JavaScript (Node.js/Next.js)** e **PostgreSQL**, estruturada sob princípios de testes contínuos, automação de infraestrutura via Docker e padronização estrita de código[cite: 20].

---

## 🛠️ Tecnologias Utilizadas

- **Runtime & Framework:** Node.js, Next.js e React (JavaScript ES6+)[cite: 20].
- **Banco de Dados & Infra:** PostgreSQL, Docker e Docker Compose[cite: 20].
- **Qualidade & Testes:** Jest (testes de integração com orquestrador próprio), ESLint e Prettier[cite: 20].
- **Controle de Versão & CI:** Git, Husky (hooks de validação e pre-commit), Commitlint (Conventional Commits) e GitHub Actions[cite: 20].

---

## 📁 Estrutura do Projeto

```text
├── .github/workflows/      # Pipelines de CI (linting e testes automatizados)
├── .husky/                 # Git hooks para commitlint e execução de testes
├── infra/
│   ├── compose.yaml        # Definição dos containers do banco de dados
│   ├── database.js         # Camada de conexão e queries do PostgreSQL
│   ├── migrations/         # Arquivos de migração de schema do banco
│   └── scripts/            # Scripts utilitários (espera do banco, códigos de saída)
├── pages/
│   ├── api/v1/
│   │   ├── migrations/     # Endpoint REST para consultar e rodar migrations
│   │   └── status/         # Endpoint de diagnóstico da aplicação e banco
│   └── status/             # Interface visual da página de status
├── tests/
│   ├── integration/        # Testes de integração cobrindo fluxos reais de API
│   └── orchestrator.js     # Utilitário para aguardar banco e serviços antes dos testes
```

[cite: 20]

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** (versão especificada no `.nvmrc`)[cite: 20].
- **Docker** e **Docker Compose**[cite: 20].
- **Git**[cite: 20].

### 1. Clonar o repositório

```bash
git clone https://github.com/igorantunes66/despachafacil.git
cd despachafacil
```

[cite: 20]

### 2. Configurar variáveis de ambiente

Crie o arquivo de ambiente local com base nas configurações de desenvolvimento[cite: 20]:

```bash
cp .env.development .env.local
```

[cite: 20]

### 3. Instalar dependências

```bash
npm install
```

[cite: 20]

### 4. Inicializar os serviços (Banco de Dados)

Suba os containers do PostgreSQL via Docker Compose[cite: 20]:

```bash
docker compose -f infra/compose.yaml up -d
```

[cite: 20]

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

[cite: 20]
Acesse a aplicação em `http://localhost:3000`[cite: 20].

---

## 📡 Endpoints da API

| Método | Endpoint             | Descrição                                                                                   |
| ------ | -------------------- | ------------------------------------------------------------------------------------------- |
| `GET`  | `/api/v1/status`     | Retorna o status operacional do servidor, versão do PostgreSQL e conexões ativas[cite: 20]. |
| `GET`  | `/api/v1/migrations` | Lista as migrações pendentes no PostgreSQL[cite: 20].                                       |
| `POST` | `/api/v1/migrations` | Executa as migrações pendentes no banco de dados[cite: 20].                                 |

---

## 🧪 Testes e Qualidade de Código

- **Executar suíte de testes:** O Jest executa os testes de integração após o `tests/orchestrator.js` confirmar que o PostgreSQL está pronto para aceitar conexões[cite: 20].
  ```bash
  npm test
  ```

[cite: 20]

- **Verificação de código e formatação:** Valida as regras do ESLint e do Prettier.
  ```bash
  npm run lint:eslint:check
  npm run lint:prettier:check
  ```

[cite: 20]

- **Padrão de commits:** O projeto força o padrão Conventional Commits validado via Husky e Commitlint antes de cada confirmação[cite: 20].

---

## 📄 Licença

Este projeto está sob a licença definida no arquivo [LICENSE](LICENSE)[cite: 20].
