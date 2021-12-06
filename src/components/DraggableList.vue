<template>          
    <div class="grid fadein animation-duration-1000">
        <div class="col-12">
        <Panel :header="title">
          <ScrollPanel style="width: 100%; height: 300px">          
            <draggable
              class="list-group"
              :list="list"
              group="people"
              @change="log"
              itemKey="name"
            >
              <template #item="{ element }">
                <div class="list-group-item">
                    <ion-card class='hover:bg-blue-300 hover:text-white border-round' @click="clickElement(element)">
                    <ion-card-header>
                      <ion-card-title>{{ element.name }}</ion-card-title>
                      <ion-card-subtitle> {{ element.field.name }} </ion-card-subtitle>
                      <ion-card-subtitle> {{ element.irrigator.name }} </ion-card-subtitle>
                    </ion-card-header>
                    </ion-card>
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

export default {
  name: 'Dashboard',
  components: {
    draggable,
  },
  props: ['title', 'list', 'log', 'clickElement'],
}
</script>

<style scoped>

</style>
