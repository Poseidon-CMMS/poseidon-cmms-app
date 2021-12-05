<template>
    
    <div class="grid text-sm mt-3">
      <div class="col-12 flex flex-row"><Button label="Create" icon="pi pi-plus" class="p-button-success align-self-start" @click="setIsCreationModalOpen(true)" /></div>
      <div class="col-3">
        <dragable-list title="In field" :list='inFieldList' :log='inFieldLog' :clickElement='clickElement'/>
      </div>
      <div class="col-3">
        <dragable-list title="Assigned" :list='assignedList' :log='assignedLog' :clickElement='clickElement'/>
      </div>
      <div class="col-3">
        <dragable-list title="Repaired" :list='repairedList' :log='repairedLog' :clickElement='clickElement'/>
      </div>
      <div class="col-3">
        <dragable-list title="Out of field" :list='outOfFieldList' :log='outOfFieldLog' :clickElement='clickElement'/>
      </div>
    </div>

    <issue-detail  v-model:selectedIssue="selectedIssue" :clickIrrigator="clickIrrigator"></issue-detail>
    
    <HdwIssueCreationDialog :isOpen="!!isCreationModalOpen" :selectedIrrigatorId="selectedCreateIssueIrrigatorId" @updateIsOpen="setIsCreationModalOpen" />
    <irrigator-details-dialog :isOpen="displayIrrigatorDialog" :irrigator="selectedIrrigator" @updateIsOpen="handleIsOpenChange"></irrigator-details-dialog>
</template>

<script>
import DragableList from '../components/DraggableList';
import Button from 'primevue/button';
import HdwIssueCreationDialog from '../components/HdwIssueCreationDialog.vue';
import IrrigatorDetailsDialog from '../components/IrrigatorDetailsDialog.vue';
import IssueDetail from '../components/IssueDetail.vue';

export default {
  name: 'Issues',
  components: {
    DragableList,
    Button,
    HdwIssueCreationDialog,
    IrrigatorDetailsDialog,
    IssueDetail
  },
  methods: {
    hasDevice: function(value) {
      console.log(value);
      return ( typeof value.gateway !== undefined || typeof value.gpsNode !== undefined ||typeof value.pressureSensor !== undefined );
    },
    handleIsOpenChange: function(value) {
      this.displayIrrigatorDialog = value;
    },
    clickIrrigator: function() {
      this.displayIrrigatorDialog = true;
    },
    technicianChange: function(evt){
      this.selectedTechnician = evt.value;
      console.log(evt.value);
    },
    inFieldLog: function(evt) {
      console.log('In field: ' + evt);
    },
    assignedLog: function(evt) {
      console.log('Assigned: ' + evt);
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
    }
  },
  data() {
    return {
      displayIrrigatorDialog: false,
      selectedTechnician: null,
      selectedIrrigator: null,
      technicians: [
            {name: 'Juan Perez', id: 1},
            {name: 'Fernando Navarro', id: 2},
            {name: 'Mauricio Lima', id: 3},
            {name: 'Hola', id: 4},
            {name: 'Chau', id: 5},
            {name: 'Probando', id: 6},
            {name: 'Iñaki', id: 7},
            {name: 'Zunda', id: 8},
            {name: 'Test', id: 9},
      ],
      isCreationModalOpen: false,
      inFieldList: [
          // .pcbGateway.firmwareVersion.version
        { 
          id: '1', 
          name:'Presión en -20mA (203)',
          device_type: { id: 1, name: 'GWT' },
          gateway: { 
              id: 'GTW889',
              pcbGateway: { 
                  firmwareVersion: 
                    { version: '0.2.8' } 
              } 
          },
          irrigator: { id: 1, name:'Equipo k'},
          downtime: 10,
          field: {name: 'Campo1'} 
        },
        { 
          id: '2',
          name:'Se rompió (203)',
          device_type: { id: 1, name: 'NODE' },
          gpsNode: { 
              id: 'NODE031',
              pcbNode: { 
                  firmwareVersion: 
                    { version: '1.4.1' } 
              } 
          },
          irrigator: { 
            id: 1,
            name:'R2'
          },
          downtime: 123,
          field: { name: 'Campo1'}, 
        },
      ],
      assignedList: [
      ],
      repairedList: [
        { 
          id: '3',
          name:'Presión en 0mA (203)',
          gateway: { 
              id: 'GTW77-SUR',
              pcbGateway: { 
                  firmwareVersion: 
                    { version: '2.4.1' } 
              } 
          },
          irrigator: { id: 1, name:'Pozo 22'},
          ttr: 10,
          field: {name: 'Campo1'},
          device_type: { id: 1, name: 'GWT' }, 
        },
      ],
      outOfFieldList: [
        { 
          id: '4',
          name:'Presión en 2mA (203)', 
          irrigator:{ id: 1, name:'El alemán'},
          ttr: 131,
          gateway: { 
              id: 'GTW131',
              pcbGateway: { 
                  firmwareVersion: 
                    { version: '2.4.1' } 
              } 
          },
          field: { name: 'Campo1' },
          device_type: { id: 1, name: 'GWT' },
        },
      ],
      selectedIssue: { 
        id: '1',
        name:'Presión en 0mA (203)',
        irrigator: { id: 1, name:"Equipo 23"},
        ttr: 231,
        field: {name: 'Campo1'},
        pressureSensor: { 
              id: 'SPRES 21ew',
              pressureSensorType: { 
                  name: 'Sensor tipo a'
              } 
          },
        device_type: { id: 1, name: 'GWT' }
      },
      selectedCreateIssueIrrigatorId: null,
    }
  },
  beforeMount() {
    const irrigatorId = this.$route.params.irrigatorId;
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
