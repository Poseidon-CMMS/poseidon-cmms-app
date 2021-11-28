import {
  ApolloClient,
  InMemoryCache,
  // ApolloProvider,
  // useQuery,
  gql,
} from "@apollo/client/core";

const client = new ApolloClient({
  uri: "http://localhost:3000/api/graphql",
  cache: new InMemoryCache(),
});

const loginQuery = async function (email, password) {
  return await client.mutate({
    mutation: gql`
      mutation ($identity: String!, $secret: String!) {
        authenticate: authenticateUserWithPassword(
          email: $identity
          password: $secret
        ) {
          ... on UserAuthenticationWithPasswordSuccess {
            item {
              id
              name
              __typename
            }
            sessionToken
            __typename
          }
          ... on UserAuthenticationWithPasswordFailure {
            message
            __typename
          }
          __typename
        }
      }
    `,
    variables: {
      identity: email,
      secret: password,
    },
  });
};

const getIrrigatorsQuery = async function () {
  return await client.query({
    query: gql`
      query getIrrigatorsQuery {
        irrigators {
          id
          integrationID
          name
          lat
          long
          status
          enabled
          transmissionStatus
          comment
          gateway {
            integrationId
            satelliteModem {
              manufacturerId
            }
          }
          gpsNode {
            integrationId
          }
          field {
            client {
              name
            }
            name
            province {
              name
            }
            city {
              name
            }
            zone {
              name
            }
          }
          installUninstallRequest {
            id
          }
          hdwIssue {
            id
          }
          pressureSensor {
            manufacturerId
          }
        }
      }
    `,
  });
};

export { loginQuery, getIrrigatorsQuery };
