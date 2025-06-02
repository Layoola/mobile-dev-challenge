import { gql } from "@apollo/client";

export const GET_NOODLES = gql`
  query GetNoodles {
    instantNoodles {
      id
      name
      spicinessLevel
      originCountry
      rating
    }
  }
`;
