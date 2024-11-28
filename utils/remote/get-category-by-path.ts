import { graphql } from '@bigcommerce/catalyst-core/client/graphql';
import { Page } from '@playwright/test';
import getClient from './get-client';

const CategoryByPathQuery = graphql(`
  query CategoryByPath($path: String!) {
    site {
      route(path: $path) {
        node {
          ... on Category {
            entityId
            name
            breadcrumbs(depth: 3) {
              edges {
                node {
                  name
                  path
                }
              }
            }
          }
        }
      }
    }
  }
`);

const getCategoryByPath = async (page: Page, path: string) => {
  const client = await getClient(page);
  const { data } = await client.fetch({
    document: CategoryByPathQuery,
    variables: {
      path,
    },
  });

  return data.site.route.node;
};

export default getCategoryByPath;
