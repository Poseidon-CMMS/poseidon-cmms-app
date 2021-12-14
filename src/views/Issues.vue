<template>
    <div class="grid mt-3">
      <div class="col-12 flex flex-row">
        <Button label="Create" icon="pi pi-plus" class="p-button-success align-self-start" @click="setIsCreationModalOpen" />
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
    <assignation-dialog :isOpen="showAssignedDialog" :selectedIssue="selectedIssue" @issueUpdated="handleIssueHasBeenUpdated"></assignation-dialog>

    <irrigator-details-dialog :isOpen="displayIrrigatorDialog" :irrigator="selectedIrrigator" @updateIsOpen="handleIsOpenChange"></irrigator-details-dialog>
</template>

<script>
import DraggableList from '../components/DraggableList';
import HdwIssueCreationDialog from '../components/HdwIssueCreationDialog.vue';
import IrrigatorDetailsDialog from '../components/IrrigatorDetailsDialog.vue';
import IssueDetail from '../components/IssueDetail.vue';
import AssignationDialog from '../components/AssignationDialog.vue';

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
    handleIssueHasBeenUpdated: function(updatedIssue) {
      const allOtherIssues = this.issues.filter(issue => issue.id !== updatedIssue.id);
      this.issues = [...allOtherIssues, updatedIssue];
    },
    clickIrrigator: function() {
      this.selectedIrrigator = this.selectedIssue.irrigator;
      this.displayIrrigatorDialog = true;
    },
    technicianChange: function(evt){
      this.selectedTechnician = evt.value;
      if(this.selectedTechnician) {
        this.selectedIssue.technician = evt.value;
      }
    },
    inFieldLog: function(evt) {
      console.log('In field: ' + evt);
    },
    assignedLog: function(evt) {
      if(evt.added && !evt.added.user) {
        this.showAssignedDialog = true;
      }
    },
    repairedLog: function(evt) {
      console.log('Repaired: ' + evt);
    },
    outOfFieldLog: function(evt) {
      console.log('Out of field: ' + evt);
    },
    clickElement: function(evt) {
      console.log(evt);
      this.selectedIssue = evt;
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
      issues: [
        { 
          id: '1', 
          comment:'Presión en -20mA (207)',
          assetType: { id: 1, name: 'GTW' },
          gateway: { 
              id: 'GTW889',
              pcbGateway: { 
                  firmwareVersion: 
                    { version: '0.2.8' } 
              } 
          },
          irrigator: { integration_id: 'EQ23', name:'Equipo k'},
          downtime: 10,
          field: {name: 'Campo1'},
          technician: {name: 'Probando', id: 6},
          status: 'in-field',
          diagnostic: {
            date: '2021/12/25',
            grafana_link: "www.issues.com/1232",
            user: {
              name: 'Fernando Navarro'
            },
            diagnostic_type: {
              name: 'No conecta el GTW'
            }
          },
          inspections: [
            {
              id: 1,
              date: '2021-01-01',
              user: {
                name: 'Juan Sanchez Miño'
              },
              comments: 'Sin problemas'
            },
            {
              id: 2,
              date: '2021-02-01',
              user: {
                name: 'Marcos Miño'
              },
              comments: 'Tuve que reinstalar el capacitor c-1'
            },
          ]
        },
        { 
          id: '2',
          comment:'Se rompió (203)',
          assetType: { id: 1, name: 'NODE' },
          gpsNode: { 
              id: 'NODE031',
              pcbNode: { 
                  firmwareVersion: 
                    { version: '1.4.1' } 
              } 
          },
          irrigator: { 
            integration_id: 'EQ13',
            name:'R2'
          },
          downtime: 123,
          field: { name: 'Campo1'}, 
          status: 'in-field'
        },
        { 
          id: '3',
          comment:'Presión en 0mA (203)',
          gateway: { 
              id: 'GTW77-SUR',
              pcbGateway: { 
                  firmwareVersion: 
                    { version: '2.4.1' } 
              } 
          },
          irrigator: { integration_id: 'EQ19', name:'Pozo 22'},
          TTR: 10,
          field: {name: 'Campo1'},
          assetType: { id: 1, name: 'GTW' }, 
          status: 'repaired'
        },
        { 
          id: '4',
          comment:'Presión en 2mA (203)', 
          irrigator:{ id: 'EQ02', name:'El alemán'},
          TTR: 131,
          gateway: { 
              id: 'GTW131',
              pcbGateway: { 
                  firmwareVersion: 
                    { version: '2.4.1' } 
              } 
          },
          field: { name: 'Campo1' },
          assetType: { id: 1, name: 'GTW' },
          status: 'out-of-field'
        }
      ],
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
  beforeMount() {
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
