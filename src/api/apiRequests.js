import {
  ApolloClient,
  InMemoryCache,
  // ApolloProvider,
  // useQuery,
  gql,
} from "@apollo/client/core";

const client = new ApolloClient({
  uri: process.env.VUE_APP_BACKEND_URL,
  cache: new InMemoryCache(),
  fetchOptions: {
    mode: 'no-cors',
  },
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
          hdwIssueCount
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

const getDiagnosticTypesQuery = async function (id) {
  return await client.query({
    query: gql`
      query getDiagnosticTypes {
        diagnosticTypes {
          id
          name
          type
        }
      }
    `,
    variables: {
      id,
    },
  });
};

const createHdwIssueMutation = async function (
  creationDate,
  diagnosticDate,
  irrigatorId,
  diagnosticId,
  grafanaLink,
  observations
) {
  return await client.mutate({
    mutation: gql`
      mutation ($data: HdwIssueCreateInput!) {
        createHdwIssue: createHdwIssue(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        creationDate: creationDate.toISOString(),
        diagnosticDate: diagnosticDate.toISOString(),

        irrigator: {
          connect: {
            id: irrigatorId
          }
        },
        diagnosticType: {
          connect: {
            id: diagnosticId
          }
        },
        grafanaLink,
        observations,
      },
    },
  });
};

export {
  loginQuery,
  getIrrigatorsQuery,
  getGatewaysQuery,
  getDiagnosticTypesQuery,
  createHdwIssueMutation,
};
