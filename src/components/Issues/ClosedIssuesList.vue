<template>          
    <div class="grid fadein animation-duration-1000">
        <div class="col-12">
          <ProgressSpinner v-if="this.loading" class="w-full"/>
            <div
              class="list-group"
            >
                <div class="list-group-item" v-for="(element, index) in closedIssues" v-bind:key="index">
                  <Card class='hover:bg-blue-300 hover:text-white border-round' @click="clickElement(element)" >
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
                    <template #footer v-if="element.assigned_technician">
                      <Avatar :label="element.assigned_technician.name.charAt(0)" size="large" style="background-color:#2196F3; color: #ffffff" shape="circle"  />
                      <span class="p-buttonset m-2"  v-if="element.status === 'repaired'">
                        <Button icon="pi pi-check" class="p-button-success" @click="clickButtonOk(element)"/>
                        <Button icon="pi pi-times" class="p-button-danger" @click="clickButtonWrong(element)"/>
                      </span>
                    </template>
                  </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProgressSpinner from "primevue/progressspinner";
// import ScrollPanel from "primevue/scrollpanel";
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Card from "primevue/card";

import { getHdwIssuesQuery } from "../../api/apiRequests";

export default {
  name: 'ClosedIssuesList',
  components: {
    ProgressSpinner,
    Card,
    // ScrollPanel,
    Avatar,
    Button
    
  },
  data() {
      return {
          closedIssues: [],
          loading: false,
      }
  },
  props: ['clickElement'],
  methods: {
    
  },
  async beforeMount() {
    //traer cerrados
    this.loading = true;
    console.log('asdusahdfiusadfhuiwhf89237423879ru32r')
    const result = await getHdwIssuesQuery('closed');
    this.closedIssues = result.data.hdwIssues;

    this.loading = false;

  }
}
</script>

<style scoped>

</style>
