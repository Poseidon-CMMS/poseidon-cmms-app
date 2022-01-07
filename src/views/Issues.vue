<template>
    <div class="grid mt-3">
      <div class="col-12 flex flex-row">
        <Button label="Nuevo" icon="pi pi-plus" class="p-button-success align-self-start" @click="setIsCreationModalOpen" />
      </div>
      <div class="col-12">
        <div class="grid text-sm">
          <div class="col-6 lg:col-3">
            <draggable-list title="In field" :list='inFieldList' :log='inFieldLog' :clickElement='clickElement' :loading='loading'/>
          </div>
          <div class="col-6 lg:col-3">
            <draggable-list title="Assigned" :list='assignedList' :log='assignedLog' :clickElement='clickElement' :loading='loading'/>
          </div>
          <div class="col-6 lg:col-3">
            <draggable-list title="Repaired" :list='repairedList' :log='repairedLog' :clickElement='clickElement' :loading='loading'/>
          </div>
          <div class="col-6 lg:col-3">
            <draggable-list title="Out of field" :list='outOfFieldList' :log='outOfFieldLog' :clickElement='clickElement' :loading='loading'/>
          </div>
        </div>
      </div>
      <div class="col-12">
        <issue-detail v-model:selectedIssue="selectedIssue" :clickIrrigator="clickIrrigator" :technicianChange="technicianChange" :loading='loading_details' @openAssignationDialog="handleIsOpenAssignation"/>
      </div>
    </div>
      
    <HdwIssueCreationDialog :isOpen="!!isCreationModalOpen" :selectedIrrigatorId="selectedCreateIssueIrrigatorId" @updateIsOpen="setIsCreationModalOpen" />
    <assignation-form :isOpen="showAssignedDialog" :selectedIssue="selectedIssue" @issueUpdated="handleIssueHasBeenUpdated" @updateIsOpenAssignation="handleIsOpenAssignation"></assignation-form>

    <irrigator-details-dialog :isOpen="displayIrrigatorDialog" :irrigator="selectedIrrigator" @updateIsOpen="handleIsOpenChange"></irrigator-details-dialog>
</template>

<script>
import DraggableList from '../components/Issues/DraggableList';
import HdwIssueCreationDialog from '../components/Issues/Forms/HdwIssueCreationForm.vue';
import IrrigatorDetailsDialog from '../components/Irrigators/IrrigatorDetailsDialog.vue';
import IssueDetail from '../components/Issues/Details/IssueDetail.vue';
import AssignationForm from '../components/Issues/Forms/AssignationForm.vue';
import { getHdwIssuesSummaryQuery, getHdwIssueDetailsQuery } from '../api/apiRequests';

export default {
  name: 'Issues',
  components: {
    DraggableList,
    HdwIssueCreationDialog,
    IrrigatorDetailsDialog,
    IssueDetail,
    AssignationForm,
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
      if(this.selectedIssue.id === updatedIssue.id){
        this.selectedIssue = {...this.selectedIssue, assigned_technician: updatedIssue.assigned_technician};
      }

      // this.selectedIssue = this.issues.find(issue => issue.id === this.selectedIssue.id);
    },
    clickIrrigator: function() {
      this.selectedIrrigator = this.selectedIssue.irrigator;
      this.displayIrrigatorDialog = true;
    },
    inFieldLog: function(evt) {
      console.log('In field: ' + evt);
    },
    assignedLog: function(evt) {
      if(evt?.added?.element && !evt.added.element.user) {
        this.showAssignedDialog = true;
        this.clickElement(evt.added.element);
      }
    },
    repairedLog: function(evt) {
      console.log('Repaired: ' + evt);
    },
    outOfFieldLog: function(evt) {
      console.log('Out of field: ' + evt);
    },
    clickElement: async function(evt) {
      this.loading_details = true;
      const detailedIssue = (await getHdwIssueDetailsQuery(evt.id)).data.hdw_issue; //todo caso error
      this.selectedIssue = detailedIssue;
      this.loading_details = false;
    },
    setIsCreationModalOpen(val) {
      this.isCreationModalOpen = val;
      if(!val) this.selectedCreateIssueIrrigatorId = null; //reset select on modal close
    },
  },
  data() {
    return {
      loading: true,
      loading_details: false,
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
    const result = await getHdwIssuesSummaryQuery();
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
