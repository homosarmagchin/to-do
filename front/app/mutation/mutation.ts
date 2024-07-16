// graphql/mutations.ts
import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $description: String!, $status: String!) {
    createPost(title: $title, description: $description, status: $status) {
      title
      description
      status
    }
  }
`;
