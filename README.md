# Vertus Burger | Menu CMS

Painel administrativo (CMS) do cardápio digital do restaurante Vertus Burger. Permite que a equipe gerencie categorias, produtos e mesas e acompanhe as comandas abertas e o status dos pedidos.

O CMS consome a API NestJS desenvolvida no primeiro bimestre ([menu-backend](https://github.com/RoochJJ/menu-backend)). Nenhum dado fica fixo no código: tudo é lido e gravado pela API.

## Funcionalidades

- **Início:** apresentação do restaurante, atalhos com a quantidade de registros de cada área, comandas abertas e resumo do cardápio.
- **Categorias:** listar (nome, ícone, ordem de exibição e situação), cadastrar, editar e excluir com confirmação.
- **Produtos:** listar (imagem, nome, categoria, preço em reais e indicadores de vegetariano e novidade), filtrar por categoria, cadastrar, editar e excluir com confirmação.
- **Mesas:** listar, cadastrar, editar e excluir com confirmação.
- **Comandas:** listar as comandas abertas (mesa, data de abertura e total acumulado) e abrir o detalhe de cada uma.
- **Pedidos:** ver os itens de cada pedido (produto, quantidade, preço unitário e subtotal) e o total, e alterar o status (Novo, Em preparo, Pronto, Entregue).
- Estados de carregamento, erro e lista vazia em todas as telas, mensagens de sucesso e erro (toast) e validação dos formulários.

## Requisitos

- Node.js 20.19 ou superior
- Backend `menu-backend` rodando

## Como instalar e executar

```bash
npm install
copy .env.example .env   # no Linux/Mac: cp .env.example .env
npm run dev
```

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `VITE_API_URL` | URL base da API NestJS (menu-backend) |

## Stack

Vite, React, TypeScript, Tailwind CSS, shadcn/ui, Axios e TanStack Query.

- **Axios:** uma única instância em `src/lib/axios.ts`, com a `baseURL` lida do `.env`.
- **TanStack Query:** leituras com `useQuery` e gravações com `useMutation`, invalidando as consultas afetadas (`invalidateQueries`) após o sucesso.

## Dependências fora da stack obrigatória

| Dependência | Justificativa |
| --- | --- |
| `react-router-dom` | Navegação entre as áreas do CMS e filtro de produtos na URL. É a mesma biblioteca usada no menu-frontend. |
| `sonner` | Mensagens de sucesso e erro (toast). É o componente de toast oficial do shadcn/ui. |
| `lucide-react` | Ícones da interface. É a biblioteca de ícones padrão do shadcn/ui. |
| `@base-ui/react`, `class-variance-authority`, `cn`, `tw-animate-css`, `shadcn` | Instaladas pelo shadcn/ui; são a base dos componentes em `src/components/ui`. |
| `@tailwindcss/vite` | Plugin oficial do Tailwind CSS para o Vite. |
| `@fontsource-variable/manrope` | Fonte da interface servida localmente, sem depender de CDN (o menu-frontend usa o mesmo tipo de pacote, `@fontsource`). |
| `@fontsource-variable/bricolage-grotesque` | Fonte do nome "Vertus Burger" na página inicial, servida localmente. |

## Rotas da API utilizadas

| Área | Rotas |
| --- | --- |
| Categorias | `GET /categories`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id` |
| Produtos | `GET /products?categoryId=`, `POST /products`, `PATCH /products/:id`, `DELETE /products/:id` |
| Mesas | `GET /spots`, `POST /spots`, `PATCH /spots/:id`, `DELETE /spots/:id` |
| Comandas | `GET /guest-checks?status=OPENED`, `GET /guest-checks/:id` |
| Pedidos | `PATCH /orders/:id/status` |

## Estrutura

```
src/
  cases/<área>/        dtos, services (acesso à API), hooks (TanStack Query) e componentes de cada área
  components/layout/   estrutura da página e menu lateral
  components/pages/    páginas do CMS
  components/shared/   componentes reutilizáveis (título, estados de tela, confirmação de exclusão)
  components/ui/       componentes do shadcn/ui
  lib/                 cliente da API (axios), mensagens de erro, formatação e junção de classes
```
