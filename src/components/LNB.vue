<template>
  <nav>
    <div class="header">
      0seo's Notion
    </div>
    <ul class="workspaces">
      <WorkspaceItem
        v-for="workspace in workspaceStore.workspaces"
        :key="workspace.id"
        :workspace="workspace" />
    </ul>
    <div class="actions">
    </div>
  </nav>
</template>

<script>
import { mapStores } from 'pinia'
import { useWorkspaceStore } from '~/store/workspace'
import WorkspaceItem from '~/components/WorkspaceItem.vue'

export default {
  components: {
    WorkspaceItem
  },
 computed: {
  ...mapStores(useWorkspaceStore)
 },
 created() {
  this.workspaceStore.readWorkspaces()
 }
}
</script>

<style scoped lang="scss">
@import '~/scss/variables';
nav {
  flex-shrink: 0;
  min-width: 160px;
  max-width: 500px;
  display: flex;
  flex-direction: column;   
  background-color: $color-background;
  .header{
    flex-shrink: 0;
    height: 48px;
    padding: 14px;
  }
  ul.workspaces {
    flex-grow: 1;
    overflow: auto;
  }
  .actions {
    flex-shrink: 0;
    height: 48px;
    padding: 14px;
    border-top: 1px solid red;
  }
}
</style>
