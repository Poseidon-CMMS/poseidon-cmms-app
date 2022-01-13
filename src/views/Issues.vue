<template>
    <div class="grid mt-3">
      <div class="col-12 flex flex-row justify-content-between">
        <Button label="Nuevo" icon="pi pi-plus" class="p-button-success align-self-start" @click="setIsCreationModalOpen" />
        
        <Button label="Ver Issues Cerrados" icon="pi pi-eye" class="p-button-warning align-self-start" @click="showClosedIssues = true" />
      </div>
      <div class="col-12">
        <div class="grid text-sm">
          <div class="col-6 lg:col-3">
            <draggable-list title="In field" :list='inFieldList' :log='inFieldLog' :clickElement='setSelectedIssue' :loading='loading' :selectedIssue="selectedIssue"/>
          </div>
          <div class="col-6 lg:col-3">
            <draggable-list title="Assigned" :list='assignedList' :log='assignedLog' :clickElement='setSelectedIssue' :loading='loading' :selectedIssue="selectedIssue"/>
          </div>
          <div class="col-6 lg:col-3">
            <draggable-list title="Repaired" :list='repairedList' :log='repairedLog' :clickElement='setSelectedIssue' :loading='loading' :selectedIssue="selectedIssue"/>
          </div>
          <div class="col-6 lg:col-3">
            <draggable-list title="Out of field" :list='outOfFieldList' :log='outOfFieldLog' :clickElement='setSelectedIssue'  :loading='loading' :selectedIssue="selectedIssue"/>
          </div>
        </div>
      </div>
      <div class="col-12">
        <issue-detail  v-if="selectedIssue" v-model:selectedIssue="selectedIssue" :clickIrrigator="clickIrrigator" @openAssignationDialog="handleIsOpenAssignation" @openRepairDialog='handleIsOpenRepairUpdated' @openAutopsyDialog='handleIsOpenAutopsy'/>
      </div>
    </div>
      
    <HdwIssueCreationDialog :isOpen="!!isCreationModalOpen" :selectedIrrigatorId="selectedCreateIssueIrrigatorId" @updateIsOpen="setIsCreationModalOpen" />
    <assignation-form :isOpen="showAssignedDialog" :selectedIssue="selectedIssue" @issueUpdated="handleIssueUpdated" @updateIsOpenAssignation="handleIsOpenAssignation"></assignation-form>

    <repair-form :isOpen="showRepairForm" :selectedIssue="selectedIssue" @issueUpdated="handleIssueUpdated" @updateIsOpen="handleIsOpenRepairUpdated"></repair-form>

    
  <autopsy-form :isOpen="showAutopsyForm" :selectedIssue="selectedIssue" @updateIsOpen="handleIsOpenAutopsy"></autopsy-form>

  <irrigator-details-dialog :isOpen="displayIrrigatorDialog" :irrigator="selectedIrrigator" @updateIsOpen="handleIsOpenChange"></irrigator-details-dialog>
  <Sidebar v-model:visible="showClosedIssues" :baseZIndex="1000" position="right">
    <h2>Issues cerrados</h2>
    <closed-issues-list :fetchData="showClosedIssues" :clickElement="setSelectedIssue"></closed-issues-list>
  </Sidebar>
</template>

<script>
import DraggableList from '../components/Issues/DraggableList';
import HdwIssueCreationDialog from '../components/Issues/Forms/HdwIssueCreationForm.vue';
import IrrigatorDetailsDialog from '../components/Irrigators/IrrigatorDetailsDialog.vue';
import ClosedIssuesList from '../components/Issues/ClosedIssuesList.vue';
import IssueDetail from '../components/Issues/Details/IssueDetail.vue';
import AssignationForm from '../components/Issues/Forms/AssignationForm.vue';
import { getHdwIssuesQuery } from '../api/apiRequests';
import RepairForm from "../components/Issues/Forms/RepairForm.vue";
import AutopsyForm from '../components/Issues/Forms/AutopsyForm.vue';
import Sidebar from 'primevue/sidebar';

export default {
  name: 'Issues',
  components: {
    DraggableList,
    HdwIssueCreationDialog,
    IrrigatorDetailsDialog,
    IssueDetail,
    AssignationForm,
    RepairForm,
    AutopsyForm,
    Sidebar,
    ClosedIssuesList
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
    handleIssueUpdated: function(updatedIssue) {
      const allOtherIssues = this.issues.filter(issue => issue.id !== updatedIssue.id);
      this.issues = [...allOtherIssues, updatedIssue];
      if(this.selectedIssue.id === updatedIssue.id){
        this.selectedIssue = updatedIssue;
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
      if(evt?.added?.element && !evt.added.element.user && evt?.added?.element.status === 'in-field') {
        this.showAssignedDialog = true;
        this.setSelectedIssue(evt.added.element);
      }
    },
    repairedLog: function(evt) {
      if(evt?.added?.element && evt?.added?.element.status === 'assigned') {
        this.setSelectedIssue(evt.added.element);
        this.showRepairForm = true;
      }
      console.log('Repaired: ' + evt);
    },
    outOfFieldLog: function(evt) {
      console.log('Out of field: ' + evt);
    },
    setSelectedIssue: async function(evt) {
      if(evt?.id !== this?.selectedIssue?.id){ //fix rapido porque a veces apollo cachea las queries a estados pre-update y genera problemas. ej. asignar tecnico => clickear el mismo issue
        this.selectedIssue = evt;
        this.showClosedIssues = false;
      }
    },
    setIsCreationModalOpen(val) {
      this.isCreationModalOpen = val;
      if(!val) this.selectedCreateIssueIrrigatorId = null; //reset select on modal close
    },
    handleIsOpenRepairUpdated(val) {
      this.showRepairForm = val;
    },
    handleIsOpenAutopsy(val) {
      this.showAutopsyForm = val;
    }
  },
  data() {
    return {
      loading: true,
      displayIrrigatorDialog: false,
      showAssignedDialog: false,
      selectedTechnician: null,
      selectedIrrigator: null,
      isCreationModalOpen: false,
      issues: [],
      selectedIssue: null,
      selectedCreateIssueIrrigatorId: null,
      showRepairForm: false,
      showAutopsyForm: false,
      showClosedIssues: false,
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
