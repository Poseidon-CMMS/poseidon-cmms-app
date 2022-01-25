<template>
  <div class="grid fadein animation-duration-1000">
    <div class="col-12">
      <Panel :header="title">
        <ProgressSpinner v-if="this.loading" />
        <ScrollPanel v-else style="width: 100%; height: 600px">
          <div
              class="list-group"
            >
              <div class="list-group-item" v-for="(element, index) in list" v-bind:key="index">
                <Card
                  class="hover:bg-blue-300 hover:text-white border-round"
                  @click="clickElement(element)"
                >
                  <template #title>
                    {{
                      (element.irrigator?.field?.name ?? "Campo desconocido") +
                      " | " +
                      element.irrigator?.name +
                      " (" +
                      element.irrigator?.integration_id +
                      ")"
                    }}
                  </template>
                  <template #subtitle>
                    {{ dateFormatter(element.creation_date, false) }}
                  </template>
                  <template #content>
                    {{
                      element.request_type === "install"
                        ? "Instalación"
                        : element.request_type === "uninstall"
                        ? "Desinstalación"
                        : element.request_type || "Desconocido"
                    }}
                  </template>
                  <template #footer>
                    <Avatar
                       v-if="element?.assigned_technician"
                      :label="element.assigned_technician.name.charAt(0)"
                      size="large"
                      style="background-color: #2196f3; color: #ffffff"
                      shape="circle"
                    />
                    <span
                      class="p-buttonset m-2"
                      v-if="element.status === 'done'"
                    >
                      <Button
                        icon="pi pi-check"
                        class="p-button-success"
                        @click="clickButtonOk(element)"
                      />
                      <Button
                        icon="pi pi-times"
                        class="p-button-danger"
                        @click="clickButtonWrong(element)"
                      />
                    </span>
                    <span class="p-buttonset m-2">
                      <Button
                        v-if="element.status === 'assigned'"
                        icon="pi pi-cloud-upload"
                        class="p-button-success"
                        @click="clickButtonAddInstallData(element)"
                      />
                      <Button
                        v-if="this.isAdmin && (element.status === 'assigned' || element.status === 'open')"
                        class="mr-1 p-button-warning"
                        icon="pi pi-user"
                        @click="handleTechnicianEdit"
                      />
                    </span>
                  </template>
                </Card>
              </div>
          </div>
        </ScrollPanel>
      </Panel>
    </div>
  </div>
</template>

<script>
import ProgressSpinner from "primevue/progressspinner";
import ScrollPanel from "primevue/scrollpanel";
import Panel from "primevue/panel";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Card from "primevue/card";
// import { updateHdwIssueStatusMutation } from '../../api/apiRequests';
import { dateFormatter } from "../../utils/dateFormatter";
import { acceptDoneRequestMutation, rejectDoneRequestMutation } from "../../api/apiRequests";

export default {
  name: "RequestsList",
  components: {
    ProgressSpinner,
    Card,
    ScrollPanel,
    Panel,
    Avatar,
    Button,
  },
  data() {
    return {
      selectedRequest: null,
    };
  },
  emits: [
    "updateRequestFormOpen",
    "updateUninstallFormOpen",
    "updateAssignationFormOpen",
    "requestUpdated",
  ],
  props: ["title", "list", "log", "clickElement", "loading"],
  methods: {
    dateFormatter,
    async clickButtonAddInstallData(request) {
      await this.clickElement(request);
      if (request.request_type === "install") {
        this.$emit("updateRequestFormOpen", true);
      } else {
        this.$emit("updateUninstallFormOpen", true);
      }
    },
    confirmDialog(message, toastMessage, onAccept) {
      this.$confirm.require({
        message: message,
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          await onAccept();
          this.$toast.add({
            severity: "info",
            summary: "Confirmado",
            detail: toastMessage,
            life: 3000,
          });
        },
        reject: () => {
          this.$toast.add({
            severity: "warn",
            summary: "Cancelada",
            detail: "Acción cancelada",
            life: 3000,
          });
        },
      });
    },
    async clickButtonOk(request) {
      this.selectedRequest = request;
      const message =
        "¿Está seguro de que desea marcar esta Solicitud como completada?";
      this.confirmDialog(
        message,
        "Solicitud completada",
        this.onRequestCompleted
      );
    },
    async onRequestCompleted() {
      //todo loading
      const resultData = await acceptDoneRequestMutation(
        this.selectedRequest.id,
        new Date()
      );
      const newRequest = resultData.data.updateinstall_uninstall_request;
      this.$emit("requestUpdated", newRequest);
    },
    async onRequestDeclined() {
      const resultData = await rejectDoneRequestMutation(
        this.selectedRequest.id
      );
      const newRequest = resultData.data.updateinstall_uninstall_request;
      this.$emit("requestUpdated", newRequest);
    },
    async clickButtonWrong(request) {
      this.selectedRequest = request;
      const message =
        "¿Está seguro de que desea marcar esta Solicitud como no completada? Será devuelta al estado Abierta";
      this.confirmDialog(
        message,
        "Solicitud devuelta al estado: Abierta",
        this.onRequestDeclined
      );
    },
    handleTechnicianEdit() {
      this.$emit("updateAssignationFormOpen", true);
    },
  },
  computed: {
    isAdmin() {
      return this.$store.state?.user?.type === 'admin';
  }
  },
};
</script>

<style scoped>
</style>
