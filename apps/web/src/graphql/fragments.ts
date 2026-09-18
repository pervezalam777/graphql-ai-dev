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
