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
                  <Card class='hover:bg-blue-300 hover:text-white border-round' @click="clickElement(element)">
                    <template #title>
                      {{ (element.irrigator?.field?.name ?? 'Campo desconocido') + ' | '
                      + element.irrigator?.name + " (" + element.irrigator?.integration_id+")" }}
                    </template>
                    <template #subtitle>
                      {{ dateFormatter(element.creation_date, false) }}
                    </template>
                    <template #content>
                      {{ element.request_type === 'install'? "Instalación" 
                        : element.request_type ==='uninstall' ? "Desinstalación" 
                        : element.request_type || "Desconocido" }}
                    </template>
                    <template #footer v-if="element?.assigned_technician">
                      <Avatar :label="element.assigned_technician.name.charAt(0)" size="large" style="background-color:#2196F3; color: #ffffff" shape="circle"  />
                      <span class="p-buttonset m-2"  v-if="element.status === 'done'">
                        <Button icon="pi pi-check" class="p-button-success" @click="clickButtonOk(element)"/>
                        <Button icon="pi pi-times" class="p-button-danger" @click="clickButtonWrong(element)"/>
                      </span>
                      <span class="m-2"  v-if="element.status === 'assigned'">
                        <Button icon="pi pi-cloud-upload" class="p-button-success" @click="clickButtonAddInstallData(element)"/>
                      </span>
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
// import { updateHdwIssueStatusMutation } from '../../api/apiRequests';
import {dateFormatter} from "../../utils/dateFormatter";

export default {
  name: 'DraggableList',
  components: {
    draggable,
    ProgressSpinner,
    Card,
    ScrollPanel,
    Panel,
    Avatar,
    Button,
  },
   data() {
    return {
      selectedRequest: null
    }
  },
  emits: ["updateRequestFormOpen", "updateUninstallFormOpen"],
  props: ['title', 'list', 'log', 'clickElement', 'loading'],
  methods: {
    dateFormatter,
    async clickButtonAddInstallData(request) {
      await this.clickElement(request);
      if (request.request_type === 'install') {
        this.$emit("updateRequestFormOpen", true);
      } else {
        this.$emit("updateUninstallFormOpen", true);
      }
      
    }
  }
}
</script>

<style scoped>

</style>
