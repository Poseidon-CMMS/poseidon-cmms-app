<template>
    <div class="grid mt-3">
      <div class="col-12 flex flex-row">
        <Button label="Nuevo" icon="pi pi-plus" class="p-button-success align-self-start" @click="setIsCreationModalOpen" />
      </div>
      <div class="col-12">
        <div class="grid text-sm">
          <div class="col-6 lg:col-3">
            <draggable-list title="In field" :list='inFieldList' :log='inFieldLog' :clickElement='clickElement'/>
          </div>
          <div class="col-6 lg:col-3">
            <draggable-list title="Assigned" :list='assignedList' :log='assignedLog' :clickElement='clickElement'/>
          </div>
          <div class="col-6 lg:col-3">
            <draggable-list title="Repaired" :list='repairedList' :log='repairedLog' :clickElement='clickElement'/>
          </div>
          <div class="col-6 lg:col-3">
            <draggable-list title="Out of field" :list='outOfFieldList' :log='outOfFieldLog' :clickElement='clickElement'/>
          </div>
        </div>
      </div>
      <div class="col-12">
        <issue-detail v-model:selectedIssue="selectedIssue" :clickIrrigator="clickIrrigator" :technicianChange="technicianChange"/>
      </div>
    </div>
      
    <HdwIssueCreationDialog :isOpen="!!isCreationModalOpen" :selectedIrrigatorId="selectedCreateIssueIrrigatorId" @updateIsOpen="setIsCreationModalOpen" />
    <assignation-dialog :isOpen="showAssignedDialog" :selectedIssue="selectedIssue" @issueUpdated="handleIssueHasBeenUpdated" @updateIsOpenAssignation="handleIsOpenAssignation"></assignation-dialog>

    <irrigator-details-dialog :isOpen="displayIrrigatorDialog" :irrigator="selectedIrrigator" @updateIsOpen="handleIsOpenChange"></irrigator-details-dialog>
</template>

<script>
import DraggableList from '../components/Issues/DraggableList';
import HdwIssueCreationDialog from '../components/Issues/Forms/HdwIssueCreationForm.vue';
import IrrigatorDetailsDialog from '../components/IrrigatorDetailsDialog.vue';
import IssueDetail from '../components/Issues/IssueDetail.vue';
import AssignationDialog from '../components/Issues/AssignationDialog.vue';
import { getHdwIssuesQuery, getInspectionsQuery } from '../api/apiRequests';

export default {
  name: 'Issues',
  components: {
    DraggableList,
    HdwIssueCreationDialog,
    IrrigatorDetailsDialog,
    IssueDetail,
    AssignationDialog
  },
  methods: {
    hasDevice: function(value) {
      console.log(value);
      return ( typeof value.gateway !== undefined || typeof value.gpsNode !== undefined || typeof value.pressureSensor !== undefined );
    },
    handleIsOpenChange: function(value) {
      this.displayIrrigatorDialog = value;
    },
    handleIsOpenAssignation: function(value) {
      this.showAssignedDialog = value;
    },
    handleIssueHasBeenUpdated: function(updatedIssue) {
      const allOtherIssues = this.issues.filter(issue => issue.id !== updatedIssue.id);
      this.issues = [...allOtherIssues, updatedIssue];
      this.selectedIssue = this.issues.find(issue => issue.id === this.selectedIssue.id);
    },
    clickIrrigator: function() {
      this.selectedIrrigator = this.selectedIssue.irrigator;
      this.displayIrrigatorDialog = true;
    },
    technicianChange: function(evt){
      this.selectedTechnician = evt.value;
      if(this.selectedTechnician) {
        this.selectedIssue.assigned_technician = evt.value;
      }
    },
    inFieldLog: function(evt) {
      console.log('In field: ' + evt);
    },
    assignedLog: function(evt) {
      if(evt?.added?.element && !evt.added.element.user) {
        this.showAssignedDialog = true;
        this.selectedIssue = evt.added.element;
      }
    },
    repairedLog: function(evt) {
      console.log('Repaired: ' + evt);
    },
    outOfFieldLog: function(evt) {
      console.log('Out of field: ' + evt);
    },
    clickElement: async function(evt) {// todo mostrar un loading
      this.selectedIssue = evt;
      const issueInspections = (await getInspectionsQuery(this.selectedIssue.id)).data.inspections; //todo caso error
      this.selectedIssue = {...this.selectedIssue, inspections: issueInspections};
    },
    setIsCreationModalOpen(val) {
      this.isCreationModalOpen = val;
      if(!val) this.selectedCreateIssueIrrigatorId = null; //reset select on modal close
    },
  },
  data() {
    return {
      loading: false,
      displayIrrigatorDialog: false,
      showAssignedDialog: false,
      selectedTechnician: null,
      selectedIrrigator: null,
      isCreationModalOpen: false,
      issues: [],
      selectedIssue: null,
      selectedCreateIssueIrrigatorId: null,
    }
  },
  computed: {
    inFieldList: {
      get(){
        return this.issues.filter(i => i.status ==='in-field');
      }
    },
    assignedList: {
      get(){
        return this.issues.filter(i => i.status ==='assigned');
      }
    },
    repairedList: {
      get(){
        return this.issues.filter(i => i.status ==='repaired');
      }
    },
    outOfFieldList: {
      get(){
        return this.issues.filter(i => i.status ==='out-of-field');
      }
    },
  },
  async beforeMount() {
    //traer hdw issues todo: manejo de errores
    const result = await getHdwIssuesQuery();
    this.issues = result.data.hdwIssues;

    const irrigatorId = this.$route.params.irrigatorId;
    this.loading = false;
    if(irrigatorId){
      this.selectedCreateIssueIrrigatorId = irrigatorId;
      this.setIsCreationModalOpen(true);
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pointer {
	cursor: pointer;
}
</style>
