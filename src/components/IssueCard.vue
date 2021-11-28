<template>
  <Card>
    <template #title>
      <div class="grid text-sm">
        <div class="col-12 m-0 p-0"> {{ issue.client.name + ' - ' + issue.field.name }} </div>
        <div class="col-12"> {{ issue.irrigator.name }} </div>
     </div>
    </template>
    <template #subtitle>
        {{ issue.name }}
    </template>
  </Card>
</template>

<script>
export default {
  props: ["issue"],
  methods: {
    createCard() {
      if (this.cardName !== "") {
        const card = {
          listId: this.listId,
          name: this.cardName,
        };
        this.$store.dispatch("createCard", card);
        this.cardName = "";
      }
    },
  },
};
</script>

<style>
.input-card {
  position: relative;
  background-color: white;
  min-height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 10px;
  word-break: break-all;
  font-size: 16px;
}
</style>