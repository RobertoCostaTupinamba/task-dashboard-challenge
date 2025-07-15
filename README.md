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

### Testes

```bash
# Execute todos os testes
yarn test

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

- **React 18** com TypeScript
- **Vite** como bundler
- **Zustand** para gerenciamento de estado
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Vitest** para testes unitários
- **JSON Server** para API mock

## 🏗️ Arquitetura

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── services/      # Serviços de API
├── stores/        # Stores Zustand
├── types/         # Tipos TypeScript
├── hooks/         # Hooks personalizados
├── utils/         # Utilitários
└── __tests__/     # Testes unitários
```

## 🔧 Scripts Disponíveis

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "test": "vitest",
  "test:watch": "vitest --watch",
  "test:coverage": "vitest --coverage",
  "mock-api": "json-server --watch mock-api/db.json --port 3001"
}
```

## 📋 Funcionalidades

### ✅ Implementadas

- [x] Sistema de autenticação (login/registro)
- [x] Persistência de sessão
- [x] Gerenciamento de estado com Zustand
- [x] Interface responsiva com Tailwind CSS
- [x] Testes unitários (24/24 passando)
- [x] API mock com JSON Server

### 🔄 Em Desenvolvimento

- [ ] CRUD de tarefas
- [ ] Filtros e busca
- [ ] Dashboard analítico
- [ ] Gráficos de métricas

## 🧪 Testes

O projeto possui cobertura de testes para:

- Componentes de autenticação
- Serviços de API
- Stores de estado
- Validações de formulário

Execute `yarn test` para rodar todos os testes.

## 🚨 Problemas Conhecidos

- **Versão do Node.js**: Use obrigatoriamente Node.js 20.19
- **Tailwind CSS**: Projeto usa v3.4.0 por compatibilidade
- **Testes**: Configurados para Node.js 20.19+

## 📞 Suporte

Em caso de problemas:

1. Verifique a versão do Node.js (`node --version`)
2. Execute `nvm use 20.19` se necessário
3. Limpe cache: `yarn cache clean`
4. Reinstale dependências: `rm -rf node_modules && yarn install`
