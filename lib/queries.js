import { gql } from '@apollo/client';

export const GET_POSTS_WITH_IMAGES = gql`
  query GetPostsWithImages {
    posts(first: 15) {
      nodes {
        id
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;