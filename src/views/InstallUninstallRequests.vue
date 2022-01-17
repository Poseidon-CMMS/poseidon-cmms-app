<template>
    <div class="grid mt-3">
      <div class="col-12">
        <div class="grid text-sm">
          <div class="col-6 lg:col-3">
            <request-draggable-list title="Abiertas" :list='openList' :log='openLog' :clickElement='setSelectedRequest' :loading='loading' :selectedRequest="selectedRequest"/>
          </div>
          <div class="col-6 lg:col-3">
            <request-draggable-list title="Asignadas" :list='assignedList' :log='assignedLog' :clickElement='setSelectedRequest' :loading='loading' :selectedRequest="selectedRequest"/>
          </div>
          <div class="col-6 lg:col-3">
            <request-draggable-list title="Realizadas" :list='doneList' :log='doneLog' :clickElement='setSelectedRequest' :loading='loading' :selectedRequest="selectedRequest"/>
          </div>
          <div class="col-6 lg:col-3">
            <request-draggable-list title="Completadas" :list='completedList' :log='completedLog' :clickElement='setSelectedRequest'  :loading='loading' :selectedRequest="selectedRequest"/>
          </div>
        </div>
      </div>
      <div class="col-12">
        <request-detail  v-if="selectedRequest" v-model:selectedRequest="selectedRequest" :clickRequest="clickRequest" @openAssignationDialog="handleIsOpenAssignation"/>
      </div>
    </div>
    
    <assignation-form :isOpen="showAssignedDialog" :selectedInstallUninstallRequest="selectedRequest" @requestUpdated="handleRequestUpdated" @updateIsOpenAssignation="handleIsOpenAssignation"></assignation-form>
    <irrigator-details-dialog :isOpen="displayIrrigatorDialog" :irrigator="selectedIrrigator" @updateIsOpen="handleIsOpenChange"></irrigator-details-dialog>
</template>

<script>
import RequestDraggableList from '../components/InstallUninstallRequests/RequestDraggableList';
import IrrigatorDetailsDialog from '../components/Irrigators/IrrigatorDetailsDialog.vue';
import RequestDetail from '../components/InstallUninstallRequests/RequestDetail.vue';
import AssignationForm from '../components/Issues/Forms/AssignationForm.vue';
import { getInstallUninstallRequestsQuery } from '../api/apiRequests';

export default {
  name: 'InstallUninstallRequests',
  components: {
    RequestDraggableList,
    IrrigatorDetailsDialog,
    RequestDetail,
    AssignationForm
  },
  methods: {
    handleIsOpenChange: function(value) {
      this.displayIrrigatorDialog = value;
    },
    handleIsOpenAssignation: function(value) {
      this.showAssignedDialog = value;
    },
    handleRequestUpdated: function(updatedRequest) {
      const allOtherRequest = this.requests.filter(request => request.id !== updatedRequest.id);
      this.requests = [...allOtherRequest, updatedRequest];
      if(this.updatedRequest.id === updatedRequest.id){
        this.updatedRequest = updatedRequest;
      }

    },
    clickRequest: function() {
      this.selectedIrrigator = this.selectedRequest.irrigator;
      this.displayIrrigatorDialog = true;
    },
    openLog: function(evt) {
      console.log('Open: ' + evt);
    },
    assignedLog: function(evt) {
      if(evt?.added?.element && !evt.added.element.user && evt?.added?.element.status === 'open') {
        this.showAssignedDialog = true;
        this.setSelectedRequest(evt.added.element);
      }
    },
    doneLog: function(evt) {
      if(evt?.added?.element && evt?.added?.element.status === 'assigned') {
        this.setSelectedRequest(evt.added.element);
      }
      console.log('Done: ' + evt);
    },
    completedLog: function(evt) {
      console.log('Completed: ' + evt);
    },
    setSelectedRequest: async function(evt) {
      if(evt?.id !== this?.selectedRequest?.id){
        this.selectedRequest = evt;
      }
    },
    setIsCreationModalOpen(val) {
      this.isCreationModalOpen = val;
      if(!val) this.selectedCreateRequestIrrigatorId = null; //reset select on modal close
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
    }
  },
  computed: {
    openList: {
      get(){
        return this.requests.filter(i => i.status ==='open');
      }
    },
    assignedList: {
      get(){
        return this.requests.filter(i => i.status ==='assigned');
      }
    },
    doneList: {
      get(){
        return this.requests.filter(i => i.status ==='done');
      }
    },
    completedList: {
      get(){
        return this.requests.filter(i => i.status ==='completed');
      }
    },
  },
  async mounted() {
    //traer install uninstall requests
    console.log('MOUNTED')
    const result = await getInstallUninstallRequestsQuery();
    console.log('Y EL DE MOUNTED');
    console.error(result);
    this.requests = result.data.installUninstallRequests;
    this.loading = false;
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pointer {
	cursor: pointer;
}
</style>
