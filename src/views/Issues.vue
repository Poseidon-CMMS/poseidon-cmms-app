<template>
    
    <div class="grid text-sm mt-3">
      <div class="col-12 flex flex-row"><Button label="Create" icon="pi pi-plus" class="p-button-success align-self-start" @click="toggleIsCreationModalOpen" /></div>
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
    
    <div class='mt-3'>
      <div class='fadein animation-duration-1000 box shadow-4'>
        <Panel>
          <template #header>
            <p class="text-lg font-bold text-left w-10">{{ selectedIssue.name }}</p>
          </template>
         <!-- Lista de atributos -->
          <div class="grid mt-3">
            <div class="col-4">
              <div class="flex align-items-center border-bottom-1 surface-border surface-overlay w-full">
                  <p class="w-2 text-left font-bold text-blue-500 mr-3">ID</p>
                  <p class="text-lg w-10">{{ selectedIssue.id }}</p>
              </div>
            </div>
            <div class="col-4">
              <div class="flex align-items-center border-bottom-1 surface-border surface-overlay w-full">
                  <p class="w-2 text-left font-bold text-blue-500 mr-3">Client</p>
                  <p class="text-lg w-10">{{ selectedIssue.client.name }}</p>
              </div>
            </div>
            <div class="col-4">
              <div class="flex align-items-center border-bottom-1 surface-border surface-overlay w-full">
                  <p class="w-2 text-left font-bold text-blue-500 mr-3">Field</p>
                  <p class="text-lg w-10">{{ selectedIssue.field.name }}</p>
              </div>
            </div>
            <div class="col-4">
              <div class="flex align-items-center border-bottom-1 surface-border surface-overlay w-full">
                  <p class="w-2 text-left font-bold text-blue-500 mr-3">Device</p>
                  <p class="text-lg w-10">{{ selectedIssue.irrigator.name }}</p>
              </div>
            </div>
            <div class="col-4">
              <div class="flex align-items-center border-bottom-1 surface-border surface-overlay w-full">
                  <p class="w-2 text-left font-bold text-blue-500 mr-3">Assignation</p>
                  <p class="text-lg w-10">{{ selectedIssue.irrigator.name }}</p>
              </div>
            </div>
          </div>

          <!-- listas -->
          <div class='mx-4 mt-4'>
            <Accordion :multiple="true">
              <AccordionTab header="Diagnostic">
                Content
              </AccordionTab>
              <AccordionTab header="Inspections">
                Content
              </AccordionTab>
              <AccordionTab header="Repairs">
                Content
              </AccordionTab>
            </Accordion>
          </div>
      </Panel>
      </div>
    </div>
    <HdwIssueCreationDialog :isOpen="isCreationModalOpen" @updateIsOpen="toggleIsCreationModalOpen"/>
</template>

<script>
import DragableList from '../components/DragableList';
import Button from 'primevue/button';
import HdwIssueCreationDialog from '../components/HdwIssueCreationDialog.vue';

export default {
  name: 'Issues',
  components: {
    DragableList,
    Button,
    HdwIssueCreationDialog
  },
  methods: {
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
      this.selectedIssue = evt;
    },
    toggleIsCreationModalOpen() {
      this.isCreationModalOpen = !this.isCreationModalOpen;
    }
  },
  data() {
    return {
        isCreationModalOpen: false,
        inFieldList: [
        { id: '1', name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
        { id: '2', name:'Se rompió (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
        { id: '3', name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
        { id: '4', name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
      ],
      assignedList: [
        { id: '5', name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
      ],
      repairedList: [
        { id: '6', name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
      ],
      outOfFieldList: [
        { id: '7', name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} },
      ],
      selectedIssue: { id: '1', name:'Presión en 0mA (203)', client: { name: "John" }, field: {name: 'Campo1'},  irrigator:{name:'El alemán'} }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
