import { graphql } from '~/client/graphql';

export const ProductFragment = graphql(`
  fragment ProductFragment on Product {
    sku
    name
    path
    brand {
      name
      path
    }
    categories {
      edges {
        node {
          name
          path
        }
      }
    }
  }
`);
