<template>
<Dialog
    header="Creación de Hardware Issue"
    v-model:visible="computedIsOpen"
    :style="{ width: '50vw' }"
    :modal="true"
  >
     <div class="card">
        <div class="field">
            <label for="creationDate">Creation Date</label>
            <Calendar  class="inputfield w-full" id="creationDate" v-model="creationDate" :showIcon="true" />
        </div>
        <!-- <div class="field">
            <label for="assignationDate">Assignation Date</label>
            <Calendar class="inputfield w-full" id="assignationDate" v-model="assignationDate" :showIcon="true" :showTime="true" :showSeconds="false"/>
        </div>
        <div class="field">
            <label for="fieldRepairDate">Field Repair Date</label>
            <Calendar class="inputfield w-full" id="fieldRepairDate" v-model="fieldRepairDate" :showIcon="true" :showTime="true" :showSeconds="false"/>
        </div> -->
        <div class="field">
            <label for="hdwIssueDescription">Hardware Issue</label>
            <InputText id="hdwIssueDescription" v-model="hdwIssueDescription" type="text" class="inputfield w-full"/>
        </div>
        <div class="field">
            <label for="device">Device</label>
            <Dropdown id="device" class="inputfield w-full" v-model="selectedDevice" :options="deviceOptions" optionLabel="name" optionValue="code" placeholder="Select a device" />
        </div>
        <div class="field">
            <label for="rootCause">Root</label>
            <InputText id="rootCause" v-model="rootCause" type="text" class="inputfield w-full"/>
        </div>
        <div class="field">
            <label for="gtw">Gateway Id</label>
            <Dropdown id="gtw" :filter="true" class="inputfield w-full" v-model="selectedGtw" :options="gtwOptions" optionLabel="name" optionValue="code" placeholder="Select a Gateway" />
        </div>
        <div class="field">
            <label for="gpsNode">Node Id</label>
            <Dropdown id="gpsNode" :filter="true" class="inputfield w-full" v-model="selectedGpsNode" :options="gpsNodeOptions" optionLabel="name" optionValue="code" placeholder="Select a Gps Node" />
        </div>
        <div class="field">
            <label for="pressureSensor">Pressure Sensor Id</label>
            <Dropdown id="pressureSensor" :filter="true" class="inputfield w-full" v-model="selectedPressureSensor" :options="pressureSensorOptions" optionLabel="name" optionValue="code" placeholder="Select a Pressure Sensor" />
        </div>
        <div class="field">
            <label for="status">Status</label>
            <InputText id="status" v-model="status" type="text" class="inputfield w-full"/>
        </div>
        <div class="field">
            <label for="assignedTechnician">Assigned Technician</label>
            <Dropdown id="assignedTechnician" :filter="true" class="inputfield w-full" v-model="assignedTechnician" :options="assignedTechnicianOptions" optionLabel="name" optionValue="code" placeholder="Select a Technician" />
        </div>
    </div>
    <template #footer>
    <div class='mt-2'>
      <ion-button color="medium" icon="pi pi-check" @click="onCancel" :loading="loading">
          <i class="pi pi-times mr-1"></i> Cancel
      </ion-button>
      <ion-button color="success" icon="pi pi-check" @click="onSubmit" :loading="loading">
          <i class="pi pi-check mr-1"></i> Submit
      </ion-button>
    </div>
    </template>
  </Dialog>
</template>

<script>
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import { IonButton } from '@ionic/vue';

export default {
  name: 'HdwIssueCreationDialog',
  components: {
      InputText,
      Calendar,
      Dropdown,
      IonButton
  },
  props: ['isOpen'],
  data() {
      return {
          //dates
          creationDate: new Date(),
          assignationDate: null,
          fieldRepairDate: null,

          //dropdown selectors
          selectedDevice: null,
          selectedGtw: null,
          selectedGpsNode: null,
          selectedPressureSensor: null,
          assignedTechnician: null,

          //strings
          hdwIssueDescription: '',
          rootCause: '',
          status: '',

          //dropdown options
          deviceOptions: [
              {name: 'Gateway', code: 'GTW'},
              {name: 'Gps Node', code: 'NODE'},
              {name: 'Pressure Sensor', code: 'SPRES'},
          ],
          pressureSensorOptions: [
              {name: 'PRES123', code: 'PRES123'},
              {name: 'PRES333', code: 'PRES333'},
              {name: 'PRES223', code: 'PRES223'},
          ],
          gpsNodeOptions: [
              {name: 'NODO123', code: 'NODO123'},
              {name: 'NODO456', code: 'NODO456'},
              {name: 'NODO433', code: 'NODO433'},
          ],
          gtwOptions: [
              {name: 'GTW123', code: 'GTW123'},
              {name: 'GTW456', code: 'GTW456'},
              {name: 'GTW789', code: 'GTW789'},
          ],
          assignedTechnicianOptions: [
              {name: 'Lucas Perez', code: 'asdasdas@gmail.com'},
              {name: 'Hardco Deado', code: 'bebedsds@gmail.com'},
              {name: 'Miguel Lopez', code: 'aeuaea@hotmail.com'},
          ],
      }
  },
  methods: {
      onSubmit() {
          console.log('onsubmit todo!!')
          //TODO
      },
      onCancel() {
          this.computedIsOpen = false;
      }
  },
  computed: {
      computedIsOpen: {
          get() {return this.isOpen},
          set(value) {this.$emit('updateIsOpen', value)}

      }
  }
}

</script>

<style scoped>
</style>