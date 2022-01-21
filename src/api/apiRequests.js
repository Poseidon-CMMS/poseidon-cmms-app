import {
  ApolloClient,
  InMemoryCache,
  // ApolloProvider,
  // useQuery,
  ApolloLink,
  gql,
} from "@apollo/client/core";
import { HttpLink } from "@apollo/client/link/http";
import { createUploadLink } from "apollo-upload-client";
import { logout } from "../utils/logout";

const httpOptions = {
  uri: process.env.VUE_APP_BACKEND_URL,
  credentials: "include",
};

const detectSessionTimeout = new ApolloLink((operation, forward) => {
  if (operation.query.definitions[0].operation === "query") {
    operation.query.definitions[0].selectionSet.selections.push({
      kind: "Field",
      name: {
        kind: "Name",
        value: "keystone",
      },
      arguments: [],
      directives: [],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "adminMeta",
            },
            arguments: [],
            directives: [],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: {
                    kind: "Name",
                    value: "__typename",
                  },
                  arguments: [],
                  directives: [],
                },
              ],
            },
          },
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "__typename",
            },
            arguments: [],
            directives: [],
          },
        ],
      },
    });
  }

  //Called before the request is sent
  return forward(operation).map((data) => {
    // Called after server responds
    if (data?.errors?.find((e) => e.message.includes("Access denied"))) {
      console.log("Session expired");
      logout();
    }
    return data;
  });
});

// 2-mode http link:
// - Mode 1: File upload mode
// - Mode 2: Default link mode
const httpLink = ApolloLink.split(
  (operation) => operation.getContext().hasUpload,
  createUploadLink(httpOptions),
  new HttpLink(httpOptions)
);

//final client creation
const client = new ApolloClient({
  cache: new InMemoryCache(),
  fetchOptions: {
    mode: "no-cors",
  },
  link: ApolloLink.from([
    // ...
    detectSessionTimeout,
    httpLink,
  ]),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
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
              integration_id
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
            integration_id
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
            integration_id
          }
          satellite_antenna {
            id
            integration_id
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
          gateway_satellite_power
          angles
          packet_202_count
          battery_2to3
          positions
          lost_packets
          node_to_gateway_distance_in_meters
          gateway_first_data_transmission_date
          height_difference_in_meters
          from_hour
          to_hour
          packet_203_count
          pressure_difference
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

const assignRequestMutation = async function (requestId, technicianId) {
  return await client.mutate({
    mutation: gql`
      mutation (
        $where: install_uninstall_requestWhereUniqueInput!
        $data: install_uninstall_requestUpdateInput!
      ) {
        updateinstall_uninstall_request: updateinstall_uninstall_request(
          where: $where
          data: $data
        ) {
          id
          creation_date
          completion_date
          close_date
          irrigator {
            integration_id
            name
            field {
              name
            }
          }
          gateway {
            id
            integration_id
          }
          gps_node {
            id
            integration_id
          }
          pressure_sensor {
            id
            integration_id
          }
          request_type
          status
          work_order {
            id
            work_date
            km_traveled
            comment
            install_uninstall_requestCount
            repairCount
            technician {
              id
              name
            }
          }
          gtw_image {
            id
            url
          }
          node_gps_image {
            id
            url
          }
          pressure_sensor_image {
            id
            url
          }
          log {
            url
          }
          assigned_technician {
            id
            name
          }
        }
      }
    `,
    variables: {
      where: {
        id: requestId,
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

const clearAssignHdwIssueMutation = async function (hdwIssueId) {
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
          disconnect: true,
        },
      },
    },
  });
};

const clearAssignRequestMutation = async function (requestId) {
  return await client.mutate({
    mutation: gql`
      mutation (
        $where: install_uninstall_requestWhereUniqueInput!
        $data: install_uninstall_requestUpdateInput!
      ) {
        updateinstall_uninstall_request: updateinstall_uninstall_request(
          where: $where
          data: $data
        ) {
          id
          creation_date
          completion_date
          close_date
          irrigator {
            integration_id
            name
            field {
              name
            }
          }
          gateway {
            id
            integration_id
          }
          gps_node {
            id
            integration_id
          }
          pressure_sensor {
            id
            integration_id
          }
          request_type
          status
          work_order {
            id
            work_date
            km_traveled
            comment
            install_uninstall_requestCount
            repairCount
            technician {
              id
              name
            }
          }
          gtw_image {
            id
            url
          }
          node_gps_image {
            id
            url
          }
          pressure_sensor_image {
            id
            url
          }
          log {
            url
          }
          assigned_technician {
            id
            name
          }
        }
      }
    `,
    variables: {
      where: {
        id: requestId,
      },
      data: {
        assigned_technician: {
          disconnect: true,
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
  comments,
  angles,
  gateway_satellite_power,
  packet_202_count,
  packet_203_count,
  battery_2to3,
  positions,
  lost_packets,
  node_to_gateway_distance_in_meters,
  gateway_first_data_transmission_date,
  height_difference_in_meters,
  to_hour,
  from_hour,
  pressure_difference,
  altimetry_image
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
            // optionals
            angles: angles === null ? undefined : angles,
            gateway_satellite_power:
              gateway_satellite_power === null
                ? undefined
                : gateway_satellite_power,
            packet_202_count:
              packet_202_count === null ? undefined : packet_202_count,
            packet_203_count:
              packet_203_count === null ? undefined : packet_203_count,
            battery_2to3: battery_2to3 === null ? undefined : battery_2to3,
            positions: positions === null ? undefined : positions,
            lost_packets: lost_packets === null ? undefined : lost_packets,
            node_to_gateway_distance_in_meters:
              node_to_gateway_distance_in_meters === null
                ? undefined
                : node_to_gateway_distance_in_meters,
            gateway_first_data_transmission_date:
              gateway_first_data_transmission_date === null
                ? undefined
                : gateway_first_data_transmission_date,
            height_difference_in_meters:
              height_difference_in_meters === null
                ? undefined
                : height_difference_in_meters,
            to_hour: to_hour === null ? undefined : to_hour,
            from_hour: from_hour === null ? undefined : from_hour,
            pressure_difference:
              pressure_difference === null ? undefined : pressure_difference,
            altimetry_image: altimetry_image
            ? {
                upload: altimetry_image,
              }
            : null,
          },
        },
        irrigator: {
          connect: {
            id: irrigatorId,
          },
        },
      },
    },
    context: {
      hasUpload: !!altimetry_image,
    },
  });
};

const getWorkOrdersQuery = async function (id) {
  return await client.query({
    query: gql`
      query getWorkOrders($id: ID) {
        workOrders(where: { technician: { id: { equals: $id } } }) {
          work_date
          id
          km_traveled
          comment
        }
      }
    `,
    variables: {
      id: id,
    },
  });
};

const createWorkOrderMutation = async function (
  creationDate,
  distance_in_kilometers,
  comments,
  user_id
) {
  const _variables = {
    data: {
      work_date: creationDate,
      km_traveled: distance_in_kilometers,
      comment: comments,
      technician: {
        connect: {
          id: user_id,
        },
      },
    },
  };

  return await client.mutate({
    mutation: gql`
      mutation ($data: work_orderCreateInput!) {
        creatework_order: creatework_order(data: $data) {
          id
          work_date
          km_traveled
          comment
        }
      }
    `,
    variables: _variables,
  });
};

const createRepairMutation = async function (
  date,
  hdw_issue_id,
  repair_type_id,
  replaced_asset_type_id,
  new_gateway_id,
  new_gps_node_id,
  new_pressure_sensor_id,
  work_order_id,
  comments,
  log,
  selected_solution_type_id
) {
  const _variables = {
    data: {
      date,
      hdw_issue: {
        connect: {
          id: hdw_issue_id,
        },
      },
      repair_type: {
        connect: {
          id: repair_type_id,
        },
      },
      replaced_asset_type: replaced_asset_type_id
        ? {
            connect: {
              id: replaced_asset_type_id,
            },
          }
        : null,
      work_order: {
        connect: {
          id: work_order_id,
        },
      },
      new_gateway: new_gateway_id
        ? {
            connect: {
              id: new_gateway_id,
            },
          }
        : null,
      new_gps_node: new_gps_node_id
        ? {
            connect: {
              id: new_gps_node_id,
            },
          }
        : null,
      new_pressure_sensor: new_pressure_sensor_id
        ? {
            connect: {
              id: new_pressure_sensor_id,
            },
          }
        : null,
      comments,
      //repair type-dependents
      log: log
        ? {
            upload: log,
          }
        : null,
      solution_type: selected_solution_type_id
        ? {
            connect: { id: selected_solution_type_id },
          }
        : null,
    },
  };

  return await client.mutate({
    mutation: gql`
      mutation ($data: repairCreateInput!) {
        createrepair: createrepair(data: $data) {
          id
          date
          work_order {
            install_uninstall_requestCount
            repairCount
            technician {
              name
              email
            }
          }
          repair_type {
            id
            name
            value
          }
          solution_type {
            id
            name
          }
          replaced_asset_type {
            id
            name
          }
          new_gateway {
            id
            integration_id
          }
          new_gps_node {
            id
            integration_id
          }
          new_pressure_sensor {
            id
            integration_id
          }
          comments
          log {
            url
            filename
          }
        }
      }
    `,
    variables: _variables,
    context: {
      hasUpload: !!log,
    },
  });
};

const createAutopsyMutation = async function (
  date,
  user_id,
  hdw_issue_id,
  comments,
  pressure_log,
  self_diagnostic_file,
  autopsy_type_id
) {
  const _variables = {
    data: {
      date,
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
      autopsy_type: {
        connect: {
          id: autopsy_type_id,
        },
      },
      comments,
      self_diagnostic_file: self_diagnostic_file
        ? {
            upload: self_diagnostic_file,
          }
        : null,
      pressure_log: pressure_log
        ? {
            upload: pressure_log,
          }
        : null,
    },
  };

  return await client.mutate({
    mutation: gql`
      mutation ($data: autopsyCreateInput!) {
        createautopsy: createautopsy(data: $data) {
          id
          date
          self_diagnostic_file {
            filename
            url
          }
          pressure_log {
            filename
            url
          }
          comments
          autopsy_type {
            id
            name
            asset_type {
              id
              name
            }
            component {
              id
              name
            }
            root {
              id
              name
            }
          }
          user {
            name
            email
          }
        }
      }
    `,
    variables: _variables,
    context: {
      hasUpload: !!(self_diagnostic_file || pressure_log),
    },
  });
};

const createInspectionMutation = async function (
  date,
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
  const _variables = {
    data: {
      date,
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
      picture: picture
        ? {
            upload: picture,
          }
        : null,
      log: log
        ? {
            upload: log,
          }
        : null,
      satellite_power,
      gateway_battery_voltage,
      lora_power,
      gps_node_battery_voltage,
      pressure_sensor_signal,
    },
  };

  return await client.mutate({
    mutation: gql`
      mutation ($data: inspectionCreateInput!) {
        createinspection: createinspection(data: $data) {
          id
            date
            user {
              name
              email
            }
            comments
            satellite_power
            gateway_battery_voltage
            lora_power
            gps_node_battery_voltage
            pressure_sensor_signal
            picture {
              url
            }
            log {
              filename
              url
            }
            inspection_type {
              id
              name
              type {
                id
                name
              }
              pot_sat
              gateway_battery_voltage
              gps_node_battery_voltage
              lora_power
              pressure_sensor_signal
            }
        }
      }
    `,
    variables: _variables,
    context: {
      hasUpload: !!(log || picture),
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

const getAutopsyTypesQuery = async function () {
  return await client.query({
    query: gql`
      query getAutopsyTypes {
        autopsyTypes {
          id
          name
        }
      }
    `,
  });
};

const getRepairTypesQuery = async function () {
  return await client.query({
    query: gql`
      query getRepairTypes {
        repairTypes {
          id
          name
          value
        }
      }
    `,
  });
};

const getSolutionTypesQuery = async function () {
  return await client.query({
    query: gql`
      query getSolutionTypes {
        solutionTypes {
          id
          name
        }
      }
    `,
  });
};

const getTechniciansGatewaysQuery = async function () {
  return await client.query({
    query: gql`
      query getGateways {
        gateways {
          id
          integration_id
        }
      }
    `,
  });
};

const getTechniciansPressureSensorsQuery = async function () {
  return await client.query({
    query: gql`
      query getPressureSensor {
        pressureSensors {
          id
          integration_id
        }
      }
    `,
  });
};

const getTechniciansGpsNodesQuery = async function () {
  return await client.query({
    query: gql`
      query getGpsNodes {
        gpsNodes {
          id
          integration_id
        }
      }
    `,
  });
};

const getHdwIssuesQuery = async function (status) {
  return await client.query({
    query: gql`
      query getHdwIssues($status: String) {
        hdwIssues(where: { status: { equals: $status } }) {
          id
          creation_date
          close_date
          time_to_repair_hours
          time_to_diagnostic_hours
          time_from_removal_to_autopsy_hours
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
              gateway_satellite_power
              angles
              packet_202_count
              battery_2to3
              positions
              lost_packets
              node_to_gateway_distance_in_meters
              gateway_first_data_transmission_date
              height_difference_in_meters
              from_hour
              to_hour
              packet_203_count
              pressure_difference
            }
            comments
            gateway_satellite_power
            angles
            packet_202_count
            battery_2to3
            positions
            lost_packets
            node_to_gateway_distance_in_meters
            gateway_first_data_transmission_date
            height_difference_in_meters
            from_hour
            to_hour
            packet_203_count
            pressure_difference
            grafana_link
            altimetry_image {
              id
              url
            }
          }
          inspection {
            id
            date
            user {
              name
              email
            }
            comments
            satellite_power
            gateway_battery_voltage
            lora_power
            gps_node_battery_voltage
            pressure_sensor_signal
            picture {
              url
            }
            log {
              filename
              url
            }
            inspection_type {
              id
              name
              type {
                id
                name
              }
              pot_sat
              gateway_battery_voltage
              gps_node_battery_voltage
              lora_power
              pressure_sensor_signal
            }
          }
          repair {
            id
            date
            work_order {
              technician {
                name
                email
              }
            }
            repair_type {
              id
              name
              value
            }
            solution_type {
              id
              name
            }
            replaced_asset_type {
              id
              name
            }
            new_gateway {
              id
              integration_id
            }
            new_gps_node {
              id
              integration_id
            }
            new_pressure_sensor {
              id
              integration_id
            }
            comments
            log {
              url
              filename
            }
          }
          autopsy {
            id
            date
            self_diagnostic_file {
              filename
              url
            }
            pressure_log {
              filename
              url
            }
            comments
            autopsy_type {
              id
              name
              asset_type {
                id
                name
              }
              component {
                id
                name
              }
              root {
                id
                name
              }
            }
            user {
              name
              email
            }
          }
        }
      }
    `,
    variables: {
      status,
    },
  });
};

const getInstallUninstallRequestsQuery = async function () {
  return await client.query({
    query: gql`
      query getInstallUninstallRequests {
        installUninstallRequests {
          id
          creation_date
          completion_date
          close_date
          irrigator {
            integration_id
            name
            field {
              name
            }
          }
          gateway {
            id
            integration_id
          }
          gps_node {
            id
            integration_id
          }
          pressure_sensor {
            id
            integration_id
          }
          request_type
          status
          work_order {
            id
            work_date
            km_traveled
            comment
            install_uninstall_requestCount
            repairCount
            technician {
              id
              name
            }
          }
          gtw_image {
            id
            url
          }
          node_gps_image {
            id
            url
          }
          pressure_sensor_image {
            id
            url
          }
          log {
            url
            filename
          }
          assigned_technician {
            id
            name
          }
        }
      }
    `,
  });
};

const updateHdwIssueStatusMutation = async function (hdwIssueId, status) {
  return await client.mutate({
    mutation: gql`
      mutation (
        $where: hdw_issueWhereUniqueInput!
        $data: hdw_issueUpdateInput!
      ) {
        updatehdw_issue: updatehdw_issue(where: $where, data: $data) {
          id
          creation_date
          close_date
          time_to_repair_hours
          time_to_diagnostic_hours
          time_from_removal_to_autopsy_hours
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
              gateway_satellite_power
              angles
              packet_202_count
              battery_2to3
              positions
              lost_packets
              node_to_gateway_distance_in_meters
              gateway_first_data_transmission_date
              height_difference_in_meters
              from_hour
              to_hour
              packet_203_count
              pressure_difference
            }
            comments
            gateway_satellite_power
            angles
            packet_202_count
            battery_2to3
            positions
            lost_packets
            node_to_gateway_distance_in_meters
            gateway_first_data_transmission_date
            height_difference_in_meters
            from_hour
            to_hour
            packet_203_count
            pressure_difference
            grafana_link
            altimetry_image {
              id
              url
            }
          }
          inspection {
            id
            date
            user {
              name
              email
            }
            comments
            satellite_power
            gateway_battery_voltage
            lora_power
            gps_node_battery_voltage
            pressure_sensor_signal
            picture {
              url
            }
            log {
              filename
              url
            }
            inspection_type {
              id
              name
              type {
                id
                name
              }
              pot_sat
              gateway_battery_voltage
              gps_node_battery_voltage
              lora_power
              pressure_sensor_signal
            }
          }
          repair {
            id
            date
            work_order {
              technician {
                name
                email
              }
            }
            repair_type {
              id
              name
              value
            }
            solution_type {
              id
              name
            }
            replaced_asset_type {
              id
              name
            }
            new_gateway {
              id
              integration_id
            }
            new_gps_node {
              id
              integration_id
            }
            new_pressure_sensor {
              id
              integration_id
            }
            comments
            log {
              url
              filename
            }
          }
          autopsy {
            id
            date
            self_diagnostic_file {
              filename
              url
            }
            pressure_log {
              filename
              url
            }
            comments
            autopsy_type {
              id
              name
              asset_type {
                id
                name
              }
              component {
                id
                name
              }
              root {
                id
                name
              }
            }
            user {
              name
              email
            }
          }
        }
      }
    `,
    variables: {
      where: {
        id: hdwIssueId,
      },
      data: {
        status,
      },
    },
  });
};

const rejectRepairedHdwIssueMutation = async function (hdwIssueId) {
  return await client.mutate({
    mutation: gql`
      mutation (
        $where: hdw_issueWhereUniqueInput!
        $data: hdw_issueUpdateInput!
      ) {
        updatehdw_issue: updatehdw_issue(where: $where, data: $data) {
          id
          creation_date
          close_date
          time_to_repair_hours
          time_to_diagnostic_hours
          time_from_removal_to_autopsy_hours
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
              gateway_satellite_power
              angles
              packet_202_count
              battery_2to3
              positions
              lost_packets
              node_to_gateway_distance_in_meters
              gateway_first_data_transmission_date
              height_difference_in_meters
              from_hour
              to_hour
              packet_203_count
              pressure_difference
            }
            comments
            gateway_satellite_power
            angles
            packet_202_count
            battery_2to3
            positions
            lost_packets
            node_to_gateway_distance_in_meters
            gateway_first_data_transmission_date
            height_difference_in_meters
            from_hour
            to_hour
            packet_203_count
            pressure_difference
            grafana_link
            altimetry_image {
              id
              url
            }
          }
          inspection {
            id
            date
            user {
              name
              email
            }
            comments
            satellite_power
            gateway_battery_voltage
            lora_power
            gps_node_battery_voltage
            pressure_sensor_signal
            picture {
              url
            }
            log {
              filename
              url
            }
            inspection_type {
              id
              name
              type {
                id
                name
              }
              pot_sat
              gateway_battery_voltage
              gps_node_battery_voltage
              lora_power
              pressure_sensor_signal
            }
          }
          repair {
            id
            date
            work_order {
              technician {
                name
                email
              }
            }
            repair_type {
              id
              name
              value
            }
            solution_type {
              id
              name
            }
            replaced_asset_type {
              id
              name
            }
            new_gateway {
              id
              integration_id
            }
            new_gps_node {
              id
              integration_id
            }
            new_pressure_sensor {
              id
              integration_id
            }
            comments
            log {
              url
              filename
            }
          }
          autopsy {
            id
            date
            self_diagnostic_file {
              filename
              url
            }
            pressure_log {
              filename
              url
            }
            comments
            autopsy_type {
              id
              name
              asset_type {
                id
                name
              }
              component {
                id
                name
              }
              root {
                id
                name
              }
            }
            user {
              name
              email
            }
          }
        }
      }
    `,
    variables: {
      where: {
        id: hdwIssueId,
      },
      data: {
        status: "in-field",
          assigned_technician: {
            disconnect: true,
          },
      },
    },
  });
};

const updateRequestStatusMutation = async function (requestId, status) {
  return await client.mutate({
    mutation: gql`
      mutation (
        $where: install_uninstall_requestWhereUniqueInput!
        $data: install_uninstall_requestUpdateInput!
      ) {
        updateinstall_uninstall_request: updateinstall_uninstall_request(where: $where, data: $data) {
          id
          creation_date
          completion_date
          close_date
          irrigator {
            integration_id
            name
            field {
              name
            }
          }
          gateway {
            id
            integration_id
          }
          gps_node {
            id
            integration_id
          }
          pressure_sensor {
            id
            integration_id
          }
          request_type
          status
          work_order {
            id
            work_date
            km_traveled
            comment
            install_uninstall_requestCount
            repairCount
            technician {
              id
              name
            }
          }
          gtw_image {
            id
            url
          }
          node_gps_image {
            id
            url
          }
          pressure_sensor_image {
            id
            url
          }
          log {
            url
          }
          assigned_technician {
            id
            name
          }
        }
      }
    `,
    variables: {
      where: {
        id: requestId,
      },
      data: {
        status,
      },
    },
  });
};

const rejectDoneRequestMutation =async function (requestId) {
  return await client.mutate({
    mutation: gql`
      mutation (
        $where: install_uninstall_requestWhereUniqueInput!
        $data: install_uninstall_requestUpdateInput!
      ) {
        updateinstall_uninstall_request: updateinstall_uninstall_request(where: $where, data: $data) {
          id
          creation_date
          completion_date
          close_date
          irrigator {
            integration_id
            name
            field {
              name
            }
          }
          gateway {
            id
            integration_id
          }
          gps_node {
            id
            integration_id
          }
          pressure_sensor {
            id
            integration_id
          }
          request_type
          status
          work_order {
            id
            work_date
            km_traveled
            comment
            install_uninstall_requestCount
            repairCount
            technician {
              id
              name
            }
          }
          gtw_image {
            id
            url
          }
          node_gps_image {
            id
            url
          }
          pressure_sensor_image {
            id
            url
          }
          log {
            url
          }
          assigned_technician {
            id
            name
          }
        }
      }
    `,
    variables: {
      where: {
        id: requestId,
      },
      data: {
        status: "open",
        assigned_technician: {
          disconnect: true,
        },
        completion_date: null,
        close_date: null,
        gateway: {
          disconnect: true,
        },
        gps_node: {
          disconnect: true,
        },
        pressure_sensor: {
          disconnect: true,
        },
        work_order : {
          disconnect: true,
        },
        gtw_image : null,
        node_gps_image : null,
        pressure_sensor_image: null,
        log : null
      },
    },
  });
};

const createInstallUninstallRequestMutation = async function (
  creationDate,
  irrigatorId,
  requestType
) {
  return await client.mutate({
    mutation: gql`
      mutation ($data: install_uninstall_requestCreateInput!) {
        createinstall_uninstall_request: createinstall_uninstall_request(
          data: $data
        ) {
          id
          creation_date
          irrigator {
            id
            integration_id
            name
          }
          request_type
          status
        }
      }
    `,
    variables: {
      data: {
        creation_date: creationDate.toISOString(),
        irrigator: {
          connect: {
            id: irrigatorId,
          },
        },
        request_type: requestType,
        status: "open",
      },
    },
  });
};

const doInstallRequestMutation = async function (
  completionDate,
  requestId,
  gatewayId,
  gpsNodeId,
  pressureSensorId,
  workOrderId,
  log_file,
  gtw_image,
  gps_node_image,
  pressure_sensor_image
) {
  return await client.mutate({
    mutation: gql`
      mutation (
        $where: install_uninstall_requestWhereUniqueInput!
        $data: install_uninstall_requestUpdateInput!
      ) {
        updateinstall_uninstall_request: updateinstall_uninstall_request(
          where: $where
          data: $data
        ) {
          id
          creation_date
          completion_date
          close_date
          irrigator {
            integration_id
            name
            field {
              name
            }
          }
          gateway {
            id
            integration_id
          }
          gps_node {
            id
            integration_id
          }
          pressure_sensor {
            id
            integration_id
          }
          request_type
          status
          work_order {
            id
            work_date
            km_traveled
            comment
            install_uninstall_requestCount
            repairCount
            technician {
              id
              name
            }
          }
          gtw_image {
            id
            url
          }
          node_gps_image {
            id
            url
          }
          pressure_sensor_image {
            id
            url
          }
          log {
            url
          }
          assigned_technician {
            id
            name
          }
        }
      }
    `,
    variables: {
      where: {
        id: requestId,
      },
      data: {
        completion_date: completionDate.toISOString(),
        gateway: {
          connect: {
            id: gatewayId,
          },
        },
        gps_node: {
          connect: {
            id: gpsNodeId,
          },
        },
        pressure_sensor: {
          connect: {
            id: pressureSensorId,
          },
        },
        work_order: {
          connect: {
            id: workOrderId,
          },
        },
        log: log_file
          ? {
              upload: log_file,
            }
          : null,
        gtw_image: gtw_image
          ? {
              upload: gtw_image,
            }
          : null,
        node_gps_image: gps_node_image
          ? {
              upload: gps_node_image,
            }
          : null,
        pressure_sensor_image: pressure_sensor_image
          ? {
              upload: pressure_sensor_image,
            }
          : null,
      },
    },
    context: {
      hasUpload:
        !!log_file ||
        !!pressure_sensor_image ||
        !!gps_node_image ||
        !!gtw_image,
    },
  });
};
const doUninstallRequestMutation = async function (
  completionDate,
  requestId,
  workOrderId
) {
  return await client.mutate({
    mutation: gql`
      mutation (
        $where: install_uninstall_requestWhereUniqueInput!
        $data: install_uninstall_requestUpdateInput!
      ) {
        updateinstall_uninstall_request: updateinstall_uninstall_request(
          where: $where
          data: $data
        ) {
          id
          creation_date
          completion_date
          close_date
          irrigator {
            integration_id
            name
            field {
              name
            }
          }
          gateway {
            id
            integration_id
          }
          gps_node {
            id
            integration_id
          }
          pressure_sensor {
            id
            integration_id
          }
          request_type
          status
          work_order {
            id
            work_date
            km_traveled
            comment
            install_uninstall_requestCount
            repairCount
            technician {
              id
              name
            }
          }
          gtw_image {
            id
            url
          }
          node_gps_image {
            id
            url
          }
          pressure_sensor_image {
            id
            url
          }
          log {
            url
          }
          assigned_technician {
            id
            name
          }
        }
      }
    `,
    variables: {
      where: {
        id: requestId,
      },
      data: {
        completion_date: completionDate.toISOString(),
      },
      work_order: {
        connect: {
          id: workOrderId,
        },
      },
    },
  });
};

export {
  loginQuery,
  getIrrigatorsQuery,
  getTechniciansQuery,
  getGatewaysQuery,
  getAssetTypesQuery,
  //hdw issue
  getHdwIssuesQuery,
  getDiagnosticTypesQuery,
  createHdwIssueMutation,
  assignHdwIssueMutation,
  clearAssignHdwIssueMutation,
  updateHdwIssueStatusMutation,
  rejectRepairedHdwIssueMutation,
  //inspection
  createInspectionMutation,
  getInspectionTypesQuery,
  //repair
  createRepairMutation,
  getRepairTypesQuery,
  getSolutionTypesQuery,
  //autopsy
  createAutopsyMutation,
  getAutopsyTypesQuery,
  //work order
  createWorkOrderMutation,
  getWorkOrdersQuery,
  getTechniciansGatewaysQuery,
  getTechniciansPressureSensorsQuery,
  getTechniciansGpsNodesQuery,
  //install uninstall request
  getInstallUninstallRequestsQuery,
  createInstallUninstallRequestMutation,
  doInstallRequestMutation,
  doUninstallRequestMutation,
  assignRequestMutation,
  clearAssignRequestMutation,
  updateRequestStatusMutation,
  rejectDoneRequestMutation
};
