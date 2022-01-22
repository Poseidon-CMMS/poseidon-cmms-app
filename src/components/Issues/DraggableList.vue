<template>          
    <div class="grid fadein animation-duration-1000">
        <div class="col-12">
        <Panel :header="title">
          <ProgressSpinner v-if="this.loading" />
          <ScrollPanel v-else style="width: 100%; height: 400px">          
            <draggable
              class="list-group"
              :list="list"
              group="people"
              @change="log"
              itemKey="name"
            >
              <template #item="{ element }">
                <div class="list-group-item">
                  <Card :class='`hover:bg-blue-300 hover:text-white border-round ${element.status==="assigned"?"bg-orange-100":element.status==="repaired"?"bg-green-100":""}`' @click="clickElement(element)">
                    <template #title>
                      {{ (element.irrigator?.field?.name ?? 'Campo desconocido') + ' | '
                      + element.irrigator?.name + " (" + element.irrigator?.integration_id+")" }}
                    </template>
                    <template #subtitle>
                      {{ element.diagnostic.diagnostic_type.name }}
                    </template>
                    <template #content>
                      {{ element.comments }}
                    </template>
                    <template #footer>
                      <div class="flex flex-column">
                        <span class="m-2">
                        <Avatar v-if="element.assigned_technician" :label="element.assigned_technician.name.charAt(0)" size="large" style="background-color:#2196F3; color: #ffffff" shape="circle"  />
                        <Button
                          v-if="isAdmin && (element.status === 'assigned' || element.status === 'in-field')"
                          class="ml-2 p-button-warning"
                          icon="pi pi-user"
                          @click="handleTechnicianEdit"
                        />
                        </span>
                        <span class="m-2"  v-if="element.status === 'assigned'">
                          <Button icon="pi pi-search" label="Pericia" class="p-button-info" @click="this.$emit('openInspectionDialog',true)"/>
                          <Button icon="pi pi-check" label="Reparación" class="p-button-success ml-2" @click="this.$emit('openRepairDialog',true)"/>
                        </span>
                        <span class="p-buttonset m-2"  v-if="isAdmin && element.status === 'repaired'">
                          <Button icon="pi pi-check" class="p-button-success" @click="clickButtonOk(element)"/>
                          <Button icon="pi pi-times" class="p-button-danger" @click="clickButtonWrong(element)"/>
                        </span>
                      </div>
                    </template>
                  </Card>
                </div>
              </template>
            </draggable>
          </ScrollPanel>   
          </Panel>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import ProgressSpinner from "primevue/progressspinner";
import ScrollPanel from "primevue/scrollpanel";
import Panel from 'primevue/panel';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Card from "primevue/card";
import { updateHdwIssueStatusMutation, rejectRepairedHdwIssueMutation } from '../../api/apiRequests';

export default {
  name: 'DraggableList',
  components: {
    draggable,
    ProgressSpinner,
    Card,
    ScrollPanel,
    Panel,
    Avatar,
    Button
    
  },
  emits: ["issueUpdated", "updateAssignationFormOpen", "openRepairDialog", "openInspectionDialog"],
  props: ['title', 'list', 'log', 'selectedIssue', 'clickElement', 'loading'],
  methods: {
    confirmDialog(message, toastMessage, onAccept) {
          this.$confirm.require({
                message: message,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    await onAccept();
                    this.$toast.add({severity:'info', summary:'Confirmado', detail: toastMessage, life: 3000});
                    
                },
                reject: () => {
                    this.$toast.add({severity:'warn', summary:'Cancelada', detail:'Acción cancelada', life: 3000});
                }
            });
        },
    async clickButtonOk(issue) {
      await this.clickElement(issue);
      const messageAssetChange = "¿Está seguro de que desea marcar este HDW Issue como solucionado? La solución fue un cambio de asset, por lo que el issue pasará al estado Out of Field";
      const messageFieldSolution = "¿Está seguro de que desea marcar este HDW Issue como solucionado? El issue fue solucionado en campo, por lo que el issue pasará al estado Closed";

      let currentIssueRepairs = [...this.selectedIssue.repair];
      const lastRepair = currentIssueRepairs.sort((a,b) => (a.date<b.date?1:-1))[0];

      if(lastRepair.repair_type.value === 'device_change') {
        this.confirmDialog(messageAssetChange, 'Issue solucionado, nuevo estado: Out of Field', this.onDeviceChangeAccept);
      } else if (lastRepair.repair_type.value === 'device_repair'){

        this.confirmDialog(messageFieldSolution, 'Issue solucionado, nuevo estado: Closed', this.onFieldSolutionAccept);
      } else{
        this.$toast.add({severity:'error', summary:'Error', detail:'Error al traer reparaciones del hardware issue', life: 3000});
      }
    },
    clickButtonWrong() {
      const messageStillBroken = "¿Está seguro de que desea marcar este HDW Issue como no reparado? El issue será devuelto al estado In Field";
      this.confirmDialog(messageStillBroken, 'Issue devuelto al estado: In Field', this.onReturnToInFieldAccept);
    },
    async onFieldSolutionAccept() {
      const result = await updateHdwIssueStatusMutation(this.selectedIssue.id, 'closed'); //todo reactivo
      this.$emit("issueUpdated", result.data.updatehdw_issue);
    },
    async onDeviceChangeAccept() {
      const result = await updateHdwIssueStatusMutation(this.selectedIssue.id, 'out-of-field');
      this.$emit("issueUpdated", result.data.updatehdw_issue);
    },
    async onReturnToInFieldAccept() {
      const result = await rejectRepairedHdwIssueMutation(this.selectedIssue.id);
      this.$emit("issueUpdated", result.data.updatehdw_issue);
    },
    handleTechnicianEdit() {
      this.$emit("updateAssignationFormOpen", true);
    },
  },
  computed: {
    isAdmin(){
      return sessionStorage.getItem("type") ==='admin';
    }
  }
}
</script>

<style scoped>

</style>
