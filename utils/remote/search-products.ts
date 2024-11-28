import { graphql } from '@bigcommerce/catalyst-core/client/graphql';
import { ProductFragment } from './fragments/product';
import { Page } from '@playwright/test';
import getClient from './get-client';

const SearchProductsQuery = graphql(
  `
    query SearchProducts($filters: SearchProductsFiltersInput!) {
      site {
        search {
          searchProducts(filters: $filters) {
            products {
              edges {
                node {
                  ...ProductFragment
                }
              }
            }
          }
        }
      }
    }
  `,
  [ProductFragment]
);

const searchProducts = async (page: Page, filters: any) => {
  const client = await getClient(page);
  const { data } = await client.fetch({
    document: SearchProductsQuery,
    variables: {
      filters,
    },
  });

  return data.site.search.searchProducts.products.edges.map(({ node }) => node);
};

export default searchProducts;
