<template>          
    <div class="grid fadein animation-duration-1000">
        <div class="col-12">
        <Panel :header="title">
          <ProgressSpinner v-if="this.loading" />
          <ScrollPanel v-else style="width: 100%; height: 300px">          
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
                      {{ element.diagnostic.diagnostic_type.name }}
                    </template>
                    <template #content>
                      {{ element.comments }}
                    </template>
                    <template #footer v-if="element.assigned_technician">
                      <Avatar :label="element.assigned_technician.name.charAt(0)" class="p-mr-2" size="large" style="background-color:#2196F3; color: #ffffff" shape="circle"  />
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

import Card from "primevue/card";

export default {
  name: 'DraggableList',
  components: {
    draggable,
    ProgressSpinner,
    Card,
    ScrollPanel,
    Panel,
    Avatar,
  },
  props: ['title', 'list', 'log', 'clickElement', 'loading'],
}
</script>

<style scoped>

</style>
