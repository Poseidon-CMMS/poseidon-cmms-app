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
    mode: "no-cors",
  },
  credentials: "include",
});

const loginQuery = async function (email, password) {
  return await client.mutate({
    mutation: gql`
      mutation ($identity: String!, $secret: String!) {
        authenticate: authenticateuserWithPassword(
          email: $identity
          password: $secret
        ) {
          ... on userAuthenticationWithPasswordSuccess {
            item {
              id
              name
              type
              __typename
            }
            sessionToken
            __typename
          }
          ... on userAuthenticationWithPasswordFailure {
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

const getTechniciansQuery = async function (id) {
  return await client.query({
    query: gql`
      query getTechniciansQuery {
        users(where: { type: { equals: "technician" } }) {
          id
          name
          email
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

const getDiagnosticTypesQuery = async function () {
  return await client.query({
    query: gql`
      query getDiagnosticTypes {
        diagnosticTypes {
          id
          name
          type {
            name
            id
          }
        }
      }
    `,
  });
};

const getHdwIssuesQuery = async function () {
  return await client.query({
    query: gql`
      query getIssues {
        hdwIssues {
          id
          creation_date
          close_date
          time_to_repair_hours
          comments
          status
          assigned_technician {
            id
            name
          }
          irrigator {
            integration_id
            name
            field {
              name
            }
          }
          diagnostic {
            id
            date
            user {
              id
              name
              email
            }
            diagnostic_type {
              name
              type {
                name
              }
            }
            comments
            angles
            height_diff
            battery2to3
            time_start
            time_end
            gps_positions
            packets_lost
            distance_to_irrigator_center_in_meters
            initial_snr
            pressure_sensor_packets
            grafana_link
          }
        }
      }
    `,
  });
};

const assignHdwIssueMutation = async function (hdwIssueId, technicianId) {
  return await client.mutate({
    mutation: gql`
      mutation (
        $where: hdw_issueWhereUniqueInput!
        $data: hdw_issueUpdateInput!
      ) {
        updatehdw_issue: updatehdw_issue(where: $where, data: $data) {
          id
        }
      }
    `,
    variables: {
      where: {
        id: hdwIssueId,
      },
      data: {
        assigned_technician: {
          connect: {
            id: technicianId,
          },
        },
      },
    },
  });
};

const createHdwIssueMutation = async function (
  creationDate,
  diagnosticDate,
  irrigatorId,
  diagnosticId,
  grafanaLink,
  comments
) {
  return await client.mutate({
    mutation: gql`
      mutation ($data: hdw_issueCreateInput!) {
        createHdwIssue: createhdw_issue(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        creation_date: creationDate.toISOString(),
        status: "in-field",
        diagnostic: {
          create: {
            date: diagnosticDate.toISOString(),
            diagnostic_type: {
              connect: {
                id: diagnosticId,
              },
            },
            grafana_link: grafanaLink,
            comments: comments,
          },
        },
        irrigator: {
          connect: {
            id: irrigatorId,
          },
        },
      },
    },
  });
};

const createInspectionMutation = async function (
  date,
  led_gtw,
  jumper_wifi,
  user_id,
  hdw_issue_id,
  inspection_type_id,
  comments,
  picture,
  log,
  satellite_power = null,
  gateway_battery_voltage = null,
  lora_power = null,
  gps_node_battery_voltage = null,
  pressure_sensor_signal = null
) {
  console.log('aeiou')
  return await client.mutate({
    mutation: gql`
      mutation ($data: inspectionCreateInput!) {
        createinspection: createinspection(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        date,
        led_gtw,
        jumper_wifi,
        user: {
          connect: {
            id: user_id,
          },
        },
        hdw_issue: {
          connect: {
            id: hdw_issue_id,
          },
        },
        inspection_type: {
          connect: {
            id: inspection_type_id,
          },
        },
        comments,
        //inspection type-dependents
        picture: {
          upload: picture
        },
        log: null,
        satellite_power,
        gateway_battery_voltage,
        lora_power,
        gps_node_battery_voltage,
        pressure_sensor_signal,
      },
    },
  });
};

const getAssetTypesQuery = async function () {
  return await client.query({
    query: gql`
      query getAssetTypes {
        assetTypes {
          id
          name
        }
      }
    `,
  });
};

const getInspectionsQuery = async function (hwd_issue_id) {
  return await client.query({
    query: gql`
      query getInspections($where: inspectionWhereInput) {
        inspections(where: $where) {
          id
          date
          comments
          led_gtw
          jumper_wifi
          satellite_power
          gateway_battery_voltage
          lora_power
          gps_node_battery_voltage
          pressure_sensor_signal
          picture {
            url
          }
          log {
            url
          }
          user {
            id
            name
          }
          inspection_type {
            name
            id
          }
        }
      }
    `,
    variables: {
      where: {
        hdw_issue: {
          id: {
            equals: hwd_issue_id,
          },
        },
      },
    },
  });
};

const getInspectionTypesQuery = async function () {
  return await client.query({
    query: gql`
      query getInspectionTypes {
        inspectionTypes {
          id
          type {
            name
          }
          lora_power
          pot_sat
          gateway_battery_voltage
          gps_node_battery_voltage
          pressure_sensor_signal
          name
        }
      }
    `,
  });
};

export {
  loginQuery,
  getIrrigatorsQuery,
  getHdwIssuesQuery,
  getTechniciansQuery,
  getGatewaysQuery,
  getDiagnosticTypesQuery,
  createHdwIssueMutation,
  assignHdwIssueMutation,
  getAssetTypesQuery,
  getInspectionTypesQuery,
  createInspectionMutation,
  getInspectionsQuery,
};
