# Inventory & Order Management Platform

A full-stack GraphQL application for learning modern web development concepts through hands-on implementation.

## Overview

This document provides comprehensive development instructions for building an Inventory & Order Management Platform using GraphQL as the primary API layer.

**Technology Stack:**

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, Apollo Client, React Router |
| Backend | Node.js, TypeScript, Apollo Server |
| Database | PostgreSQL |
| Security | JWT, Role-based Authorization |
| Data Loading | DataLoader |

## Learning Objectives

By completing this project, you will be able to explain and demonstrate:

### Basic Concepts
- GraphQL vs REST
- GraphQL schema (SDL)
- Query operations
- Mutation operations
- Subscription operations
- Over-fetching and under-fetching

### Intermediate Concepts
- Resolvers and their implementation
- Arguments and variables
- Input types
- Fragments
- Nested queries
- Error handling
- Schema-first vs Code-first approaches

### Advanced Concepts
- N+1 problem and DataLoader solution
- Authentication with JWT
- Role-based authorization
- Apollo Client cache
- Cache normalization
- Optimistic UI updates
- Pagination (offset and cursor-based)
- Filtering and sorting
- Real-time subscriptions

### Production Topics
- GraphQL security considerations
- Query complexity analysis
- Rate limiting
- Persisted queries
- Batch loading
- Caching strategies
- Federation concepts
- Production architecture patterns

---

## Development Roadmap

Build this project in **10 phases** over approximately 14 lessons.

| Phase | Topic | Result |
|-------|-------|--------|
| 1 | Project setup | Running React + Node + GraphQL |
| 2 | GraphQL fundamentals | Schema + Query |
| 3 | Resolvers | Database-backed queries |
| 4 | Mutations | Create/update/delete |
| 5 | React + Apollo | Real frontend integration |
| 6 | Fragments + caching | Apollo cache optimization |
| 7 | Authentication | JWT implementation |
| 8 | Authorization | Role-based access control |
| 9 | DataLoader | N+1 problem solution |
| 10 | Subscriptions | Real-time updates |

> **Note:** Start with server-side GraphQL before adding Apollo Client to build foundational understanding.

---

## Architecture

```
┌──────────────────────────────┐
│      React App               │
│   TypeScript + Vite          │
└──────────────┬───────────────┘
               │
        Apollo Client
               │
        GraphQL Query
               │
               ▼
┌──────────────────────────────┐
│    Apollo Server             │
│   Node.js + TypeScript       │
└──────────────┬───────────────┘
               │
    ┌──────────┴───────────┐
    │                      │
Resolvers              DataLoader
    │                      │
    └──────────┬───────────┘
               │
               ▼
┌──────────────────────────────┐
│     PostgreSQL               │
└──────────────────────────────┘
```

---

## Project Structure (Monorepo)

```
graphql-inventory/
│
├── apps/
│   │
│   ├── api/                         # Backend API
│   │   ├── src/
│   │   │   ├── graphql/             # Schema definitions
│   │   │   │   └── *.graphql
│   │   │   ├── resolvers/           # Resolver implementations
│   │   │   ├── services/            # Business logic
│   │   │   ├── loaders/             # DataLoader instances
│   │   │   ├── middleware/          # Auth, error handling
│   │   │   ├── db/                  # Database connection
│   │   │   │   ├── connection.ts
│   │   │   │   └── models/
│   │   │   └── server.ts
│   │   │
│   │   ├── tests/
│   │   └── package.json
│   │
│   └── web/                         # React frontend
│       ├── src/
│       │   ├── components/          # Reusable components
│       │   ├── pages/               # Page components
│       │   ├── graphql/             # GraphQL queries/mutations
│       │   │   └── *.graphql
│       │   ├── hooks/               # Custom React hooks
│       │   ├── apollo/              # Apollo Client config
│       │   └── main.tsx
│       │
│       └── package.json
│
├── packages/                         # Shared code
│   └── shared/
│       ├── types/                   # TypeScript types
│       └── utils/
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Phase 1: Project Setup

### Step 1.1: Initialize Monorepo

```bash
# Create project structure
mkdir -p graphql-inventory/apps/api/src
mkdir -p graphql-inventory/apps/web/src
mkdir -p graphql-inventory/packages/shared

# Initialize root package.json
cd graphql-inventory
npm init -y
```

### Step 1.2: Configure Package.json (Root)

```json
{
  "name": "graphql-inventory",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "api": "npm run dev --workspace=api",
    "web": "npm run dev --workspace=web",
    "dev": "concurrently \"npm run api\" \"npm run web\""
  }
}
```

### Step 1.3: API Setup (`apps/api/package.json`)

```json
{
  "name": "api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@apollo/server": "^4.9.0",
    "graphql": "^16.8.0",
    "pg": "^8.11.0",
    "dotenv": "^16.3.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/cors": "^2.8.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Step 1.4: Web Setup (`apps/web/package.json`)

```json
{
  "name": "web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@apollo/client": "^3.9.0",
    "graphql": "^16.8.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Step 1.5: TypeScript Configuration

**`apps/api/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**`apps/web/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Step 1.6: Database Setup

**`apps/api/src/db/connection.ts`:**
```typescript
import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'inventory',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});
```

---

## Phase 2: GraphQL Schema Foundation

### Step 2.1: Create Schema Directory

```bash
mkdir -p apps/api/src/graphql
```

### Step 2.2: Base Schema (`apps/api/src/graphql/index.graphql`)

```graphql
type Query {
  products: [Product!]!
  product(id: ID!): Product
  categories: [Category!]!
  category(id: ID!): Category
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createProduct(input: CreateProductInput!): Product!
  updateProduct(id: ID!, input: UpdateProductInput!): Product!
  deleteProduct(id: ID!): Boolean!

  createCategory(input: CreateCategoryInput!): Category!
  updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
  deleteCategory(id: ID!): Boolean!

  createUser(input: CreateUserInput!): User!
}

type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
  stock: Int!
  category: Category
}

type Category {
  id: ID!
  name: String!
  products: [Product!]!
}

type User {
  id: ID!
  name: String!
  email: String!
  role: UserRole!
}

enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

input CreateProductInput {
  name: String!
  description: String
  price: Float!
  stock: Int!
  categoryId: ID!
}

input UpdateProductInput {
  name: String
  description: String
  price: Float
  stock: Int
  categoryId: ID
}

input CreateCategoryInput {
  name: String!
}

input UpdateCategoryInput {
  name: String
}

input CreateUserInput {
  name: String!
  email: String!
  password: String!
  role: UserRole
}
```

---

## Phase 3: Resolvers

### Step 3.1: Resolver Structure

**`apps/api/src/resolvers/index.ts`:**
```typescript
import { Query } from './Query';
import { Mutation } from './Mutation';
import { Product } from './Product';
import { Category } from './Category';
import { User } from './User';

export const resolvers = {
  Query,
  Mutation,
  Product,
  Category,
  User,
};
```

### Step 3.2: Query Resolvers (`apps/api/src/resolvers/Query.ts`)

```typescript
import { QueryResolvers } from '../types/resolvers';

export const Query: QueryResolvers = {
  products: async (_, __, { db }) => {
    return db.query('SELECT * FROM products');
  },

  product: async (_, { id }, { db }) => {
    const result = await db.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  categories: async (_, __, { db }) => {
    return db.query('SELECT * FROM categories');
  },

  category: async (_, { id }, { db }) => {
    const result = await db.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  users: async (_, __, { db }) => {
    return db.query('SELECT * FROM users');
  },

  user: async (_, { id }, { db }) => {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },
};
```

### Step 3.3: Product Resolver with Category (`apps/api/src/resolvers/Product.ts`)

```typescript
import { ProductResolvers } from '../types/resolvers';

export const Product: ProductResolvers = {
  category: async (product, _, { loaders }) => {
    return loaders.category.load(product.category_id);
  },
};
```

---

## Phase 4: Database Setup

### Step 4.1: Database Schema (`apps/api/src/db/schema.sql`)

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  total DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

### Step 4.2: Database Service Layer

**`apps/api/src/db/index.ts`:**
```typescript
import { pool } from './connection';

export interface Db {
  query: (text: string, params?: any[]) => Promise<any>;
}

export const createDb = (): Db => ({
  query: (text: string, params?: any[]) => pool.query(text, params),
});
```

---

## Phase 5: React + Apollo Client Integration

### Step 5.1: Apollo Client Setup

**`apps/web/src/apollo/client.ts`:**
```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
  }),
});

export default client;
```

### Step 5.2: App Entry Point

**`apps/web/src/main.tsx`:**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import client from './apollo/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
```

### Step 5.3: Product List Component

**`apps/web/src/components/ProductList.tsx`:**
```typescript
import { gql, useQuery } from '@apollo/client';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      stock
      category {
        id
        name
      }
    }
  }
`;

export const ProductList = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {data.products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>Category: {product.category?.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## Phase 6: Apollo Cache & Fragments

### Step 6.1: Define Fragments

**`apps/web/src/graphql/fragments.ts`:**
```typescript
import { gql } from '@apollo/client';

export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    id
    name
    description
    price
    stock
  }
`;

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    name
  }
`;
```

### Step 6.2: Use Fragments in Queries

```typescript
import { PRODUCT_FIELDS } from '../graphql/fragments';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      ...ProductFields
      category {
        ...CategoryFields
      }
    }
  }
  ${PRODUCT_FIELDS}
  ${CATEGORY_FIELDS}
`;
```

### Step 6.3: Cache Updates with updateQuery

```typescript
const { data, refetch } = useQuery(GET_PRODUCTS);

await mutate({
  variables: { id, input },
  update: (cache, { data: mutateData }) => {
    const existing = cache.readQuery({
      query: GET_PRODUCTS,
    });

    if (existing) {
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          products: existing.products.map((p: any) =>
            p.id === id ? { ...p, ...mutateData.updateProduct } : p
          ),
        },
      });
    }
  },
});
```

---

## Phase 7: Authentication (JWT)

### Step 7.1: JWT Utility

**`apps/api/src/middleware/jwt.ts`:**
```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};
```

### Step 7.2: Login Mutation

**`apps/api/src/resolvers/Mutation.ts`:**
```typescript
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/jwt';

export const Mutation = {
  login: async (_, { email, password }, { db }) => {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      userId: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
};
```

### Step 7.3: Apollo Client Auth Setup

```typescript
import { setContext } from '@apollo/client/link/context';
import { HttpLink } from '@apollo/client/link/http';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

---

## Phase 8: Authorization (RBAC)

### Step 8.1: Authorization Middleware

**`apps/api/src/middleware/auth.ts`:**
```typescript
import { AuthenticationError, ForbiddenError } from 'apollo-server-errors';

export const requireAuth = (context: { user?: any }) => {
  if (!context.user) {
    throw new AuthenticationError('You must be logged in');
  }
  return context.user;
};

export const requireRole = (allowedRoles: string[]) => {
  return (context: { user?: any }) => {
    const user = requireAuth(context);
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError(
        `Access denied. Required role: ${allowedRoles.join(' or ')}`
      );
    }
    return user;
  };
};
```

### Step 8.2: Protected Resolvers

```typescript
import { requireRole } from '../middleware/auth';

export const Mutation = {
  createProduct: async (_, { input }, { db, user }) => {
    const admin = requireRole(['ADMIN', 'SUPER_ADMIN'])({ user });

    return db.query(
      `INSERT INTO products (name, description, price, stock, category_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [input.name, input.description, input.price, input.stock, input.categoryId]
    );
  },

  deleteProduct: async (_, { id }, { db, user }) => {
    const admin = requireRole(['ADMIN', 'SUPER_ADMIN'])({ user });

    await db.query('DELETE FROM products WHERE id = $1', [id]);
    return true;
  },
};
```

---

## Phase 9: DataLoader (N+1 Solution)

### Step 9.1: DataLoader Setup

**`apps/api/src/loaders/index.ts`:**
```typescript
import DataLoader from 'dataloader';
import { pool } from '../db/connection';

export interface Loaders {
  category: DataLoader<string, any>;
  product: DataLoader<string, any>;
  user: DataLoader<string, any>;
}

export const createLoaders = (): Loaders => ({
  category: new DataLoader(async (categoryIds: readonly string[]) => {
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = ANY($1::int[])',
      [Array.from(categoryIds)]
    );
    const categories = result.rows;
    return categoryIds.map(
      (id) => categories.find((c) => c.id === parseInt(id)) || null
    );
  }),

  product: new DataLoader(async (productIds: readonly string[]) => {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = ANY($1::int[])',
      [Array.from(productIds)]
    );
    const products = result.rows;
    return productIds.map(
      (id) => products.find((p) => p.id === parseInt(id)) || null
    );
  }),

  user: new DataLoader(async (userIds: readonly string[]) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = ANY($1::int[])',
      [Array.from(userIds)]
    );
    const users = result.rows;
    return userIds.map(
      (id) => users.find((u) => u.id === parseInt(id)) || null
    );
  }),
});
```

### Step 9.2: Resolver Using DataLoader

```typescript
import { Loaders } from '../loaders';

export const Product = {
  category: async (product: any, _, { loaders }: { loaders: Loaders }) => {
    return loaders.category.load(product.category_id);
  },
};

export const Order = {
  user: async (order: any, _, { loaders }: { loaders: Loaders }) => {
    return loaders.user.load(order.user_id);
  },

  items: async (order: any, _, { db }: { db: any }) => {
    const result = await db.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [order.id]
    );
    return result.rows;
  },
};
```

---

## Phase 10: Pagination, Filtering, and Sorting

### Step 10.1: Extend Schema

```graphql
type Query {
  products(
    page: Int
    limit: Int
    search: String
    categoryId: ID
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
    sortBy: ProductSortField
    sortOrder: SortDirection
  ): ProductPage!

  categories: [Category!]!
}

type ProductPage {
  products: [Product!]!
  pagination: PaginationInfo!
}

type PaginationInfo {
  total: Int!
  page: Int!
  limit: Int!
  totalPages: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

enum ProductSortField {
  NAME
  PRICE
  STOCK
  CREATED_AT
}

enum SortDirection {
  ASC
  DESC
}

input ProductFilter {
  search: String
  categoryId: ID
  minPrice: Float
  maxPrice: Float
  inStock: Boolean
}

input ProductSort {
  field: ProductSortField!
  direction: SortDirection!
}
```

### Step 10.2: Paginated Resolver

```typescript
export const Query = {
  products: async (
    _,
    {
      page = 1,
      limit = 10,
      search,
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'NAME',
      sortOrder = 'ASC',
    }
  ) => {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (categoryId) {
      whereClause += ` AND category_id = $${paramIndex}`;
      params.push(categoryId);
      paramIndex++;
    }

    if (minPrice !== undefined) {
      whereClause += ` AND price >= $${paramIndex}`;
      params.push(minPrice);
      paramIndex++;
    }

    if (maxPrice !== undefined) {
      whereClause += ` AND price <= $${paramIndex}`;
      params.push(maxPrice);
      paramIndex++;
    }

    if (inStock) {
      whereClause += ` AND stock > 0`;
    }

    const sortField = sortBy === 'NAME' ? 'name' : sortBy === 'PRICE' ? 'price' : 'created_at';
    const direction = sortOrder === 'DESC' ? 'DESC' : 'ASC';

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get products
    const productsResult = await db.query(
      `SELECT * FROM products ${whereClause} ORDER BY ${sortField} ${direction} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      products: productsResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  },
};
```

---

## Phase 11: Subscriptions

### Step 11.1: Subscription Schema

```graphql
type Subscription {
  productStockUpdated: Product!
  orderStatusChanged: Order!
}
```

### Step 11.2: Pub/Sub Implementation

**`apps/api/src/subscriptions/pubSub.ts`:**
```typescript
import { PubSub } from 'graphql-subscriptions';

export const pubSub = new PubSub();
export const EVENTS = {
  PRODUCT_STOCK_UPDATED: 'PRODUCT_STOCK_UPDATED',
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
};
```

### Step 11.3: Resolver with Subscription

```typescript
import { pubSub, EVENTS } from '../subscriptions/pubSub';

export const Mutation = {
  updateProductStock: async (_, { id, stock }, { db }) => {
    const result = await db.query(
      `UPDATE products SET stock = $1 WHERE id = $2 RETURNING *`,
      [stock, id]
    );

    const product = result.rows[0];
    pubSub.publish(EVENTS.PRODUCT_STOCK_UPDATED, {
      productStockUpdated: product,
    });

    return product;
  },
};

export const Subscription = {
  productStockUpdated: {
    subscribe: () => pubSub.asyncIterator(EVENTS.PRODUCT_STOCK_UPDATED),
  },
};
```

### Step 11.4: React Subscription Hook

```typescript
import { gql, useSubscription } from '@apollo/client';

const PRODUCT_STOCK_UPDATED = gql`
  subscription ProductStockUpdated {
    productStockUpdated {
      id
      name
      stock
    }
  }
`;

export const StockMonitor = () => {
  const { data, loading, error } = useSubscription(PRODUCT_STOCK_UPDATED);

  if (loading) return <p>Subscribing...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Stock Updates (Real-time)</h2>
      <p>Product: {data.productStockUpdated.name}</p>
      <p>Current Stock: {data.productStockUpdated.stock}</p>
    </div>
  );
};
```

---

## Testing Strategy

### Unit Tests

| Test Target | File |
|-------------|------|
| ProductService | `apps/api/tests/services/product.service.test.ts` |
| UserService | `apps/api/tests/services/user.service.test.ts` |
| DataLoader | `apps/api/tests/loaders/index.test.ts` |
| Authorization | `apps/api/tests/middleware/auth.test.ts` |

### Integration Tests

| Test Target | File |
|-------------|------|
| GraphQL Query | `apps/api/tests/graphql/query.test.ts` |
| GraphQL Mutation | `apps/api/tests/graphql/mutation.test.ts` |

### Frontend Tests

| Test Target | File |
|-------------|------|
| useQuery hook | `apps/web/tests/components/ProductList.test.tsx` |
| useMutation hook | `apps/web/tests/components/ProductForm.test.tsx` |
| Cache updates | `apps/web/tests/apollo/cache.test.ts` |

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### Setup

```bash
# Clone and navigate
cd graphql-inventory

# Install dependencies
npm install

# Setup database
psql -U postgres -c "CREATE DATABASE inventory;"
psql -U postgres -d inventory -f apps/api/src/db/schema.sql

# Start development servers
npm run dev
```

API runs on `http://localhost:4000/graphql`  
Web runs on `http://localhost:5173`

---

## Interview Question Mapping

| Question | Implementation |
|----------|----------------|
| What is GraphQL? | Complete API implementation |
| GraphQL vs REST | REST comparison in Phase 5 |
| GraphQL schema | `.graphql` files in `apps/api/src/graphql/` |
| Query | Product queries in Phase 2 |
| Mutation | Product mutations in Phase 4 |
| Subscription | Stock updates in Phase 11 |
| Over-fetching | REST vs GraphQL demo |
| Under-fetching | Nested GraphQL queries |
| Resolvers | `apps/api/src/resolvers/` |
| Fragments | `apps/web/src/graphql/fragments.ts` |
| Error handling | `apps/api/src/middleware/errors.ts` |
| Schema-first | Primary implementation approach |
| Code-first | Can be added later |
| N+1 problem | Implemented intentionally, then solved |
| DataLoader | `apps/api/src/loaders/index.ts` |
| Authentication | JWT in Phase 7 |
| Authorization | RBAC in Phase 8 |
| Apollo cache | InMemoryCache in Phase 6 |
| Pagination | Phase 10 |
| Filtering/Sorting | Phase 10 |

---

## Next Steps

1. **Phase 1-2**: Set up project and create initial schema
2. **Phase 3-4**: Implement resolvers and database integration
3. **Phase 5-6**: Connect React frontend and implement caching
4. **Phase 7-8**: Add authentication and authorization
5. **Phase 9**: Solve N+1 with DataLoader
6. **Phase 10**: Add advanced features (pagination, filtering, sorting)
7. **Phase 11**: Implement subscriptions for real-time updates
8. **Phase 12**: Write tests for all components

---

*Last updated: August 2026*
