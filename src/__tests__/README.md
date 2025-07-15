# Testes do Sistema de Gerenciamento de Tarefas

Este diretório contém os testes unitários para os principais componentes do sistema de autenticação.

## 📝 Estrutura dos Testes

```
src/__tests__/
├── components/
│   ├── LoginForm.test.tsx     # Testes do formulário de login
│   ├── RegisterForm.test.tsx  # Testes do formulário de registro
│   └── AuthPage.test.tsx      # Testes da página de autenticação
├── services/
│   └── authService.test.ts    # Testes do serviço de autenticação
└── README.md                  # Este arquivo
```

## 🧪 Tecnologias Utilizadas

- **Vitest** - Framework de testes rápido e moderno
- **@testing-library/react** - Biblioteca para testar componentes React
- **@testing-library/jest-dom** - Matchers customizados para Jest
- **jsdom** - Simulação do ambiente DOM para testes

## 🚀 Como Executar os Testes

### Executar todos os testes:

```bash
yarn test
```

### Executar testes em modo watch:

```bash
yarn test --watch
```

### Executar testes com interface gráfica:

```bash
yarn test:ui
```

### Executar testes com relatório de cobertura:

```bash
yarn test:coverage
```

## 📋 Casos de Teste Implementados

### LoginForm.test.tsx

- ✅ Renderização correta do formulário
- ✅ Validação de campos obrigatórios
- ✅ Estados de loading
- ✅ Exibição de mensagens de erro
- ✅ Funcionalidade de troca para registro

### RegisterForm.test.tsx

- ✅ Renderização correta do formulário
- ✅ Validação de campos obrigatórios
- ✅ Estados de loading
- ✅ Exibição de mensagens de erro
- ✅ Funcionalidade de troca para login

### AuthPage.test.tsx

- ✅ Renderização da página de autenticação
- ✅ Alternância entre formulários de login e registro
- ✅ Exibição de título e descrição

### authService.test.ts

- ✅ Login com credenciais válidas
- ✅ Tratamento de erros de login
- ✅ Registro de novos usuários
- ✅ Validação de email duplicado
- ✅ Métodos de localStorage

## 🔧 Configuração

Os testes utilizam mocks para:

- **Zustand store** - Para simular o estado de autenticação
- **Axios** - Para simular chamadas à API
- **localStorage** - Para testes de persistência

## 📊 Cobertura de Testes

Os testes cobrem:

- Componentes de UI principais
- Lógica de autenticação
- Validação de formulários
- Tratamento de erros
- Persistência de dados

## 🐛 Problemas Conhecidos

- Dependência `@testing-library/dom` requer Node.js >= 20
- Alguns testes podem falhar se a versão do Node.js não for compatível
- Para executar em Node.js 18, pode ser necessário usar `--ignore-engines`

## 🚀 Próximos Passos

- Adicionar testes de integração
- Implementar testes para componentes de gerenciamento de tarefas
- Adicionar testes para o dashboard analítico
- Configurar CI/CD para executar testes automaticamente
