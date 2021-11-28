<template>          
    <div class="grid">
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
                  <issue-card :issue="element" />
                </div>
              </template>
            </draggable>
          </ScrollPanel>   
          </Panel>
        </div>
    </div>
</template>

<script>
import IssueCard from '../components/IssueCard.vue';
import draggable from "vuedraggable";

export default {
  name: 'Dashboard',
  components: {
    draggable,
    IssueCard,
  },
  props: ['title', 'list', 'log'],
}
</script>

<style scoped>

</style>
