// Types shared between API and web

// Common input types
export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface SortingInput {
  field: string;
  order: 'ASC' | 'DESC';
}

// Common output types
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface Sorting {
  field: string;
  order: 'ASC' | 'DESC';
}

// User types
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  createdAt: string;
}

// Common error types
export interface GraphQLError {
  message: string;
  path?: string[];
  extensions?: {
    code?: string;
    invalidArgs?: Record<string, unknown>;
    fieldName?: string;
  };
}

export interface GraphQLErrorResponse {
  errors: GraphQLError[];
  data?: Record<string, unknown>;
}
