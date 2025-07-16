# 📋 Sistema de Gerenciamento de Tarefas

Sistema completo de gerenciamento de tarefas com autenticação, dashboard analítico e interface moderna.

## 🚀 Pré-requisitos

### Node.js 20.19

Este projeto foi desenvolvido e testado com **Node.js 20.19**. É **obrigatório** usar esta versão para evitar problemas de compatibilidade.

#### Instalação e Configuração

1. **Instale o NVM (Node Version Manager)**:

```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Windows
# Use nvm-windows: https://github.com/coreybutler/nvm-windows
```

2. **Instale e use Node.js 20.19**:

```bash
nvm install 20.19
nvm use 20.19
```

3. **Verifique a versão**:

```bash
node --version  # deve mostrar v20.19.x
```

#### Configuração Automática

O projeto possui um arquivo `.nvmrc` que especifica a versão do Node.js. Para usar automaticamente:

```bash
# Ative a versão correta automaticamente
nvm use
```

## 📦 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd task-manager

# Certifique-se de usar Node.js 20.19
nvm use 20.19

# Instale as dependências
yarn install
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
yarn dev

# Inicie a API mock (terminal separado)
yarn mock-api
```

O projeto estará disponível em `http://localhost:5173` e a API mock em `http://localhost:3001`.

### Testes

```bash
# Execute todos os testes
yarn test

# Execute testes com interface visual
yarn test:ui

# Execute testes com watch
yarn test:watch

# Execute testes com coverage
yarn test:coverage
```

### Build

```bash
# Gere build de produção
yarn build

# Preview do build
yarn preview
```

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 19** com TypeScript
- **Vite** como bundler e dev server
- **Zustand** para gerenciamento de estado
- **Tailwind CSS** para estilização responsiva
- **Recharts** para gráficos e visualizações

### Desenvolvimento

- **Vitest** para testes unitários
- **Testing Library** para testes de componentes
- **ESLint** para linting
- **TypeScript** para tipagem estática

### API

- **JSON Server** para API mock RESTful
- **Axios** para requisições HTTP

## 🏗️ Arquitetura

```
src/
├── components/        # Componentes reutilizáveis
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── TaskForm.tsx
│   ├── TaskList.tsx
│   ├── TaskFilters.tsx
│   ├── TaskStatsCards.tsx
│   ├── TaskStatusChart.tsx
│   └── TaskCategoryChart.tsx
├── pages/            # Páginas da aplicação
│   ├── AuthPage.tsx
│   ├── DashboardPage.tsx
│   └── TasksPage.tsx
├── services/         # Serviços de API
│   ├── authService.ts
│   └── taskService.ts
├── stores/           # Stores Zustand
│   ├── authStore.ts
│   └── taskStore.ts
├── types/            # Tipos TypeScript
│   ├── auth.ts
│   └── task.ts
├── hooks/            # Hooks personalizados
├── utils/            # Utilitários
└── __tests__/        # Testes unitários
```

## 🔧 Scripts Disponíveis

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:watch": "vitest --watch",
  "test:coverage": "vitest --coverage",
  "mock-api": "json-server --watch mock-api/db.json --port 3001"
}
```

## 📋 Funcionalidades

### ✅ Funcionalidades Implementadas

#### 🔐 Autenticação

- [x] Sistema de login e registro
- [x] Persistência de sessão via localStorage
- [x] Validação de formulários
- [x] Estados de loading e erro

#### 📝 Gerenciamento de Tarefas

- [x] CRUD completo de tarefas (Criar, Ler, Atualizar, Deletar)
- [x] Formulário de criação/edição com validação
- [x] Lista de tarefas ordenável
- [x] Campos: título, descrição, categoria, prioridade, status

#### 🔍 Filtros e Busca

- [x] Filtro por status (pendente, em progresso, concluída)
- [x] Filtro por categoria (trabalho, pessoal, estudos, outros)
- [x] Filtro por prioridade (baixa, média, alta)
- [x] Busca por texto (título e descrição)
- [x] Combinação de múltiplos filtros

#### 📊 Dashboard Analítico

- [x] Cards de estatísticas (total, por status, por prioridade)
- [x] Gráfico de distribuição por status (pizza)
- [x] Gráfico de distribuição por categoria (barras)
- [x] Visualizações interativas com Recharts
- [x] Estado vazio para usuários sem tarefas

#### 🎨 Interface e UX

- [x] Interface responsiva (desktop e mobile)
- [x] Design moderno com Tailwind CSS
- [x] Estados de loading em todas as operações
- [x] Tratamento de erros com feedback visual

#### 🧪 Qualidade

- [x] Testes unitários abrangentes com 99.44% de cobertura
- [x] Suite de testes robusta para todos os componentes
- [x] Cobertura de código com Vitest e relatórios detalhados
- [x] Tipagem TypeScript completa
- [x] Linting com ESLint
- [x] Arquitetura componentizada

## 🎯 Como Usar

### 1. Primeira Execução

```bash
# Instalar dependências
yarn install

# Iniciar API mock
yarn mock-api

# Iniciar aplicação (novo terminal)
yarn dev
```

### 2. Criar Conta

- Acesse `http://localhost:5173`
- Clique em "Criar Conta"
- Preencha os dados e registre-se

### 3. Gerenciar Tarefas

- Acesse "Gerenciar Tarefas" no dashboard
- Crie tarefas com título, descrição, categoria e prioridade
- Use os filtros para organizar suas tarefas
- Visualize suas estatísticas no dashboard

## 🧪 Testes

O projeto possui cobertura de testes para:

- ✅ Componentes de autenticação
- ✅ Componentes de gerenciamento de tarefas
- ✅ Componentes de filtros e busca
- ✅ Componentes de dashboard e gráficos
- ✅ Serviços de API
- ✅ Stores de estado
- ✅ Validações de formulário

### 📊 Cobertura de Código

O projeto mantém uma excelente cobertura de testes com **99.44%** de statements cobertos:

```
File                    % Stmts   % Branch   % Funcs   % Lines   Uncovered Line #s
------------------------|---------|----------|---------|---------|------------------
ALL files               |  99.44  |   95.75  |   94.5  |  99.44  |
 src                    |   100   |    100   |   100   |   100   |
  App.tsx               |   100   |    100   |   100   |   100   |
 src/components         |  99.36  |   95.69  |  88.09  |  99.36  |
  LoginForm.tsx         |  98.21  |     96   |   100   |  98.21  | 24-25
  RegisterForm.tsx      |  98.8   |   97.29  |   100   |  98.8   | 34-35
  TaskCategoryChart.tsx |   100   |   88.88  |  66.66  |   100   | 71
  TaskFilters.tsx       |   100   |    100   |   100   |   100   |
  TaskForm.tsx          |  99.64  |   96.49  |    75   |  99.64  | 121
  TaskList.tsx          |  98.51  |     90   |   100   |  98.51  | 42,55
  TaskStatsCards.tsx    |   100   |    100   |   100   |   100   |
  TaskStatusChart.tsx   |   100   |     90   |  66.66  |   100   | 61
 src/pages              |   100   |    100   |   100   |   100   |
  AuthPage.tsx          |   100   |    100   |   100   |   100   |
  DashboardPage.tsx     |   100   |    100   |   100   |   100   |
  TasksPage.tsx         |   100   |    100   |   100   |   100   |
 src/services           |  98.03  |   96.96  |   100   |  98.03  |
  authService.ts        |  94.59  |   88.23  |   100   |  94.59  | 46-47,80-81
  taskService.ts        |   100   |    100   |   100   |   100   |
 src/stores             |   100   |   90.38  |   100   |   100   |
  authStore.ts          |   100   |    100   |   100   |   100   |
  taskStore.ts          |   100   |   85.29  |   100   |   100   | 68,87,104,121,138
```

**Métricas de Qualidade:**

- 📈 **99.44%** de cobertura de statements
- 🌿 **95.75%** de cobertura de branches
- ⚡ **94.5%** de cobertura de funções
- 📋 **99.44%** de cobertura de linhas

```bash
# Rodar todos os testes
yarn test

# Interface visual de testes
yarn test:ui

# Cobertura de código
yarn test:coverage
```

## 🚨 Problemas Conhecidos

- **Versão do Node.js**: Use obrigatoriamente Node.js 20.19
- **Porta da API**: Certifique-se que a porta 3001 está livre
- **Dados**: Os dados são armazenados localmente via JSON Server

## 🔧 Configuração da API Mock

A API mock utiliza JSON Server e está configurada em `mock-api/db.json`:

```json
{
  "users": [],
  "tasks": []
}
```

### Endpoints Disponíveis:

- `GET/POST /users` - Gerenciamento de usuários
- `GET/POST/PUT/DELETE /tasks` - Gerenciamento de tarefas

## 📞 Suporte

Em caso de problemas:

1. Verifique a versão do Node.js (`node --version`)
2. Execute `nvm use 20.19` se necessário
3. Limpe cache: `yarn cache clean`
4. Reinstale dependências: `rm -rf node_modules && yarn install`
5. Verifique se a API mock está rodando na porta 3001

## 🎨 Capturas de Tela

### Dashboard Principal

- Visão geral com estatísticas
- Gráficos interativos
- Acesso rápido às funcionalidades

### Gerenciamento de Tarefas

- Lista organizada com filtros
- Formulário de criação/edição
- Sistema de busca avançado

### Autenticação

- Telas de login e registro
- Validação em tempo real
- Feedback de erros
