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

const getIrrigatorsQuery = async function (id) {
  return await client.query({
    query: gql`
      query getIrrigatorsQuery($id: ID) {
        irrigators(where: { id: { equals: $id } }) {
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
            id
            integrationId
            satelliteModem {
              manufacturerId
            }
          }
          gpsNode {
            id
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
            id
            manufacturerId
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};

const getGatewaysQuery = async function (id) {
  return await client.query({
    query: gql`
      query getGateway($id: ID) {
        gateways(where: { id: { equals: $id } }) {
          id
          fabricationDate
          integrationId
          irrigator {
            id
            integrationID
          }
          housingType {
            id
            name
          }
          satelliteModem {
            id
            manufacturerId
          }
          satelliteAntenna {
            id
            manufacturerId
          }

          pcbGateway {
            id
            integrationId
          }
          loraAntennaType {
            id
            name
          }
          storageLocation {
            id
            name
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};

export { loginQuery, getIrrigatorsQuery, getGatewaysQuery };
