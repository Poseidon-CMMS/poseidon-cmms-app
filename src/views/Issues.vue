<template>
    <div class="grid mt-3">
      <div class="col-12 flex flex-row justify-content-between flex-wrap">
        <Button v-if="this.userType == 'admin'" label="Nuevo" icon="pi pi-plus" class="p-button-success align-self-center mt-2" @click="setIsCreationModalOpen" />
        <div class="hidden md:inline-flex align-items-center justify-content-center bg-green-400 font-bold text-white border-round w-4">
        <p class="text-2xl w-full m-0">
            Hardware Issues
          </p>
        </div>
        <Button v-if="this.userType == 'admin'" label="Ver Issues Cerrados" icon="pi pi-eye" class="p-button-warning align-self-center mt-2" @click="showClosedIssues = true" />
      </div>
      <div class="col-12">
        <div class="grid text-sm">
          <div v-if="this.userType == 'admin'" class="col-12 md:col-6 lg:col-3">
            <issues-list 
              title="In field"
              :list='inFieldList'
              :log='inFieldLog'
              :clickElement='setSelectedIssue'
              :loading='loading'
              :selectedIssue="selectedIssue"
              @updateAssignationFormOpen="handleIsOpenAssignation"
            />
          </div>
          <div :class="'col-12 md:col-6 ' + (this.userType == 'admin' ? 'lg:col-3' : 'lg:col-4')">
            <issues-list 
              title="Asignados"
              :list='assignedList'
              :log='assignedLog'
              :clickElement='setSelectedIssue'
              :loading='loading'
              :selectedIssue="selectedIssue"
              @updateAssignationFormOpen="handleIsOpenAssignation"
              @openRepairDialog='handleIsOpenRepairUpdated'
              @openInspectionDialog='handleIsOpenInspection'
            />
          </div>
          <div v-if="this.userType === 'admin'"  class="col-12 md:col-6 lg:col-3">
            <issues-list title="Reparados" :list='repairedList' :log='repairedLog' :clickElement='setSelectedIssue' :loading='loading' :selectedIssue="selectedIssue" @issueUpdated="handleIssueUpdated"/>
          </div>
          <div v-if="this.userType === 'admin'"  class="col-12 md:col-6 lg:col-3">
            <issues-list title="Out of field" :list='outOfFieldList' :log='outOfFieldLog' :clickElement='setSelectedIssue'  :loading='loading' :selectedIssue="selectedIssue"/>
          </div>

          <div v-if="this.userType !== 'admin'" :class="'col-12 md:col-6'">
          <Accordion>
            <AccordionTab header="Historial">
              <issues-list
                :list="[...repairedList, ...outOfFieldList]"
                :log="completedLog"
                :clickElement="setSelectedIssue"
                :loading="loading"
                :selectedRequest="selectedIssue"
              />
            </AccordionTab>
          </Accordion>
        </div>
        </div>
      </div>
      <div class="col-12">
        <issue-detail  v-if="selectedIssue" :userType="userType" v-model:selectedIssue="selectedIssue" :clickIrrigator="clickIrrigator" @openAssignationDialog="handleIsOpenAssignation" @openRepairDialog='handleIsOpenRepairUpdated' @openAutopsyDialog='handleIsOpenAutopsy' @openInspectionDialog='handleIsOpenInspection'/>
      </div>
    </div>
      
    <HdwIssueCreationDialog v-if="this.userType == 'admin'" :isOpen="!!isCreationModalOpen" :selectedIrrigatorId="selectedCreateIssueIrrigatorId" @updateIsOpen="setIsCreationModalOpen" />
    <assignation-form v-if="this.userType == 'admin'" :isOpen="showAssignedDialog" :selectedIssue="selectedIssue" @issueUpdated="handleIssueUpdated" @updateIsOpenAssignation="handleIsOpenAssignation"></assignation-form>

    <inspection-form :isOpen="showInspectionForm" :selectedIssue="selectedIssue" @issueUpdated="handleIssueUpdated" @updateIsOpen="handleIsOpenInspection"></inspection-form>
    <repair-form :isOpen="showRepairForm" :selectedIssue="selectedIssue" @issueUpdated="handleIssueUpdated" @updateIsOpen="handleIsOpenRepairUpdated"></repair-form>

    
  <autopsy-form v-if="this.userType == 'admin'" :isOpen="showAutopsyForm" :selectedIssue="selectedIssue" @updateIsOpen="handleIsOpenAutopsy" @issueUpdated="handleIssueUpdated"></autopsy-form>

  <irrigator-details-dialog :isOpen="displayIrrigatorDialog" :irrigator="selectedIrrigator" @updateIsOpen="handleIsOpenChange"></irrigator-details-dialog>
  <Sidebar v-if="this.userType == 'admin'" v-model:visible="showClosedIssues" :baseZIndex="1000" position="right">
    <h2>Issues cerrados</h2>
    <closed-issues-list :fetchData="showClosedIssues" :clickElement="setSelectedIssue"></closed-issues-list>
  </Sidebar>
</template>

<script>
import IssuesList from '../components/Issues/IssuesList';
import HdwIssueCreationDialog from '../components/Issues/Forms/HdwIssueCreationForm.vue';
import IrrigatorDetailsDialog from '../components/Irrigators/IrrigatorDetailsDialog.vue';
import ClosedIssuesList from '../components/Issues/ClosedIssuesList.vue';
import IssueDetail from '../components/Issues/Details/IssueDetail.vue';
import AssignationForm from '../components/Issues/Forms/AssignationForm.vue';
import { getHdwIssuesQuery } from '../api/apiRequests';
import RepairForm from "../components/Issues/Forms/RepairForm.vue";
import AutopsyForm from '../components/Issues/Forms/AutopsyForm.vue';
import Sidebar from 'primevue/sidebar';
import InspectionForm from "../components/Issues/Forms/InspectionForm.vue";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

export default {
  name: 'Issues',
  components: {
    IssuesList,
    HdwIssueCreationDialog,
    IrrigatorDetailsDialog,
    IssueDetail,
    AssignationForm,
    RepairForm,
    AutopsyForm,
    Sidebar,
    ClosedIssuesList,
    InspectionForm,
    Accordion,
    AccordionTab,
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
    },
    handleIsOpenInspection(val) {
      this.showInspectionForm = val;
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
      showInspectionForm: false,
      userType: 'technician',
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
    const type = sessionStorage.getItem('type');
    this.userType = type;
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
