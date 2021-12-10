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
          integration_id
          name
          lat
          long
          status
          enabled
          transmission_status
          comment
          gateway {
            id
            integration_id
            satellite_modem {
              manufacturer_id
            }
          }
          gps_node {
            id
            integration_id
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
          install_uninstall_request {
            id
          }
          hdw_issueCount
          pressure_sensor {
            id
            manufacturer_id
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
          fabrication_date
          integration_id
          irrigator {
            id
            integration_id
          }
          housing_type {
            id
            name
          }
          satellite_modem {
            id
            manufacturer_id
          }
          satellite_antenna {
            id
            manufacturer_id
          }

          pcb_gateway {
            id
            integration_id
          }
          lora_antenna_type {
            id
            name
          }
          storage_location {
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
        diagnostic_types {
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
        creation_date: creationDate.toISOString(),
        diagnostic_date: diagnosticDate.toISOString(),

        irrigator: {
          connect: {
            id: irrigatorId
          }
        },
        diagnostic_type: {
          connect: {
            id: diagnosticId
          }
        },
        grafana_link,
        comments,
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
