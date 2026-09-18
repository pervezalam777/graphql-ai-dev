import { gql } from '@apollo/client';
import { PRODUCT_FIELDS, CATEGORY_FIELDS } from './fragments';

export const GET_PRODUCTS = gql`
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

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      ...ProductFields
      category {
        ...CategoryFields
      }
    }
  }
  ${PRODUCT_FIELDS}
  ${CATEGORY_FIELDS}
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...ProductFields
      category {
        ...CategoryFields
      }
    }
  }
  ${PRODUCT_FIELDS}
  ${CATEGORY_FIELDS}
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      ...ProductFields
      category {
        ...CategoryFields
      }
    }
  }
  ${PRODUCT_FIELDS}
  ${CATEGORY_FIELDS}
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

// Cache update helpers for mutations
export const updateCacheAfterCreate = (
  cache: any,
  createProduct: any,
  existingProducts: any[]
) => {
  cache.writeQuery({
    query: GET_PRODUCTS,
    data: { products: [createProduct, ...existingProducts] },
  });
};

export const updateCacheAfterUpdate = (
  cache: any,
  id: string,
  updatedProduct: any,
  existingProducts: any[]
) => {
  cache.writeQuery({
    query: GET_PRODUCTS,
    data: {
      products: existingProducts.map((p) =>
        p.id === id ? { ...p, ...updatedProduct } : p
      ),
    },
  });
};

export const updateCacheAfterDelete = (
  cache: any,
  id: string,
  existingProducts: any[]
) => {
  cache.writeQuery({
    query: GET_PRODUCTS,
    data: { products: existingProducts.filter((p) => p.id !== id) },
  });
};

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;
