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
                  <Card class='hover:bg-blue-300 hover:text-white border-round' @click="clickElement(element)">
                    <template #title>
                      <div class="grid text-sm">
                        <div class="col-10 m-0 p-0"> {{ element.comments }} </div>
                        <div class="col-12"> {{ element.field?.name + ' - ' + element.irrigator.name}} </div>
                      </div>
                    </template>
                    <template #subtitle>
                        {{ element.name }}
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
