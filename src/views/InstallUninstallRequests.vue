<template>
  <div class="grid mt-3">
    <div class="col-12">
      <div class="flex align-items-center justify-content-center bg-green-400 font-bold text-white border-round">
        <p class="text-2xl w-full p-2 m-0">
          Solicitudes de instalación y desinstalación
        </p>
      </div>
    </div>
    <div class="col-12">
      <div class="grid text-sm">
        <div class="col-12 md:col-6 lg:col-3">
          <request-draggable-list
            title="Abiertas"
            :list="openList"
            :log="openLog"
            :clickElement="setSelectedRequest"
            :loading="loading"
            :selectedRequest="selectedRequest"
            @updateAssignationFormOpen="handleIsOpenAssignation"
          />
        </div>
        <div class="col-12 md:col-6 lg:col-3">
          <request-draggable-list
            title="Asignadas"
            :list="assignedList"
            :log="assignedLog"
            :clickElement="setSelectedRequest"
            :loading="loading"
            :selectedRequest="selectedRequest"
            @updateRequestFormOpen="handleIsOpenInstall"
            @updateUninstallFormOpen="handleIsOpenUninstall"
            @updateAssignationFormOpen="handleIsOpenAssignation"
          />
        </div>
        <div class="col-12 md:col-6 lg:col-3">
          <request-draggable-list
            title="Realizadas"
            :list="doneList"
            :log="doneLog"
            :clickElement="setSelectedRequest"
            :loading="loading"
            :selectedRequest="selectedRequest"
            @requestUpdated="handleRequestUpdated"
          />
        </div>
        <div class="col-12 md:col-6 lg:col-3">
          <request-draggable-list
            title="Completadas"
            :list="completedList"
            :log="completedLog"
            :clickElement="setSelectedRequest"
            :loading="loading"
            :selectedRequest="selectedRequest"
          />
        </div>
      </div>
    </div>
    <div class="col-12">
      <request-detail
        v-if="selectedRequest"
        v-model:selectedRequest="selectedRequest"
        :clickRequest="clickRequest"
        @openAssignationDialog="handleIsOpenAssignation"
      />
    </div>
  </div>

  <assignation-form
    :isOpen="showAssignedDialog"
    :selectedInstallUninstallRequest="selectedRequest"
    :selectedRequest="selectedRequest"
    @requestUpdated="handleRequestUpdated"
    @updateIsOpenAssignation="handleIsOpenAssignation"
  ></assignation-form>
  <irrigator-details-dialog
    :isOpen="displayIrrigatorDialog"
    :irrigator="selectedIrrigator"
    @updateIsOpen="handleIsOpenChange"
  ></irrigator-details-dialog>
  <install-request-form
    :isOpen="showRequestForm"
    :selectedRequest="selectedRequest"
    @requestUpdated="handleRequestUpdated"
    @updateIsOpen="handleIsOpenInstall"
  />
  <uninstall-request-form
    :isOpen="showUninstallForm"
    :selectedRequest="selectedRequest"
    @requestUpdated="handleRequestUpdated"
    @updateIsOpen="handleIsOpenUninstall"
  />
</template>

<script>
import RequestDraggableList from "../components/InstallUninstallRequests/RequestDraggableList";
import IrrigatorDetailsDialog from "../components/Irrigators/IrrigatorDetailsDialog.vue";
import RequestDetail from "../components/InstallUninstallRequests/RequestDetail.vue";
import AssignationForm from "../components/Issues/Forms/AssignationForm.vue";
import { getInstallUninstallRequestsQuery } from "../api/apiRequests";
import InstallRequestForm from "../components/InstallUninstallRequests/InstallRequestForm.vue";
import UninstallRequestForm from "../components/InstallUninstallRequests/UninstallRequestForm.vue";

export default {
  name: "InstallUninstallRequests",
  components: {
    RequestDraggableList,
    IrrigatorDetailsDialog,
    RequestDetail,
    AssignationForm,
    InstallRequestForm,
    UninstallRequestForm
  },
  methods: {
    handleIsOpenChange: function (value) {
      this.displayIrrigatorDialog = value;
    },
    handleIsOpenAssignation: function (value) {
      this.showAssignedDialog = value;
    },
    handleRequestUpdated: function (updatedRequest) {
      const allOtherRequest = this.requests.filter(
        (request) => request.id !== updatedRequest.id
      );
      this.requests = [...allOtherRequest, updatedRequest];
      if (this.selectedRequest.id === updatedRequest.id) {
        this.selectedRequest = updatedRequest;
      }
    },
    clickRequest: function () {
      this.selectedIrrigator = this.selectedRequest.irrigator;
      this.displayIrrigatorDialog = true;
    },
    openLog: function (evt) {
      console.log("Open: " + evt);
    },
    assignedLog: function (evt) {
      if (
        evt?.added?.element &&
        !evt.added.element.user &&
        evt?.added?.element.status === "open"
      ) {
        this.showAssignedDialog = true;
        this.setSelectedRequest(evt.added.element);
      }
    },
    doneLog: function (evt) {
      if (evt?.added?.element && evt?.added?.element.status === "assigned") {
        this.setSelectedRequest(evt.added.element);
      }
      console.log("Done: " + evt);
    },
    completedLog: function (evt) {
      console.log("Completed: " + evt);
    },
    setSelectedRequest: async function (evt) {
      if (evt?.id !== this?.selectedRequest?.id) {
        this.selectedRequest = evt;
      }
    },
    setIsCreationModalOpen(val) {
      this.isCreationModalOpen = val;
      if (!val) this.selectedCreateRequestIrrigatorId = null; //reset select on modal close
    },
    handleIsOpenInstall(val) {
      this.showRequestForm = val;
    },
    handleIsOpenUninstall(val) {
      this.showUninstallForm = val;
    },
  },
  data() {
    return {
      loading: true,
      displayIrrigatorDialog: false,
      showAssignedDialog: false,
      selectedTechnician: null,
      selectedIrrigator: null,
      isCreationModalOpen: false,
      requests: [],
      selectedRequest: null,
      selectedCreateRequestIrrigatorId: null,
      showRequestForm: false,
      showUninstallForm: false,
    };
  },
  computed: {
    openList: {
      get() {
        return this.requests.filter((i) => i.status === "open");
      },
    },
    assignedList: {
      get() {
        return this.requests.filter((i) => i.status === "assigned");
      },
    },
    doneList: {
      get() {
        return this.requests.filter((i) => i.status === "done");
      },
    },
    completedList: {
      get() {
        return this.requests.filter((i) => i.status === "completed");
      },
    },
  },
  async mounted() {
    //traer install uninstall requests
    const result = await getInstallUninstallRequestsQuery();
    this.requests = result.data.installUninstallRequests;
    this.loading = false;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pointer {
  cursor: pointer;
}
</style>
