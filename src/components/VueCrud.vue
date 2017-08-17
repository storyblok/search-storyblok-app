<template>
  <div>
    <div :model="model" :action="action" :id="id" :api="api" :root-config="rootConfig" :config="config" :is="activeComponent"></div>
  </div>
</template>

<script>
import ElementUI from 'element-ui'
import Vue from 'vue'
import VueCrudIndex from './VueCrudIndex.vue'
import VueCrudEdit from './VueCrudEdit.vue'
import VueCrudNew from './VueCrudNew.vue'
import 'element-ui/lib/theme-default/index.css'

Vue.use(ElementUI)

export default {
  name: 'v-crud',

  props: ['model', 'config', 'rootConfig', 'action', 'id'],

  data () {
    return {
      activeComponent: 'v-crud-index',
      api: null,
      params: {}
    }
  },

  components: {
    'v-crud-index': VueCrudIndex,
    'v-crud-new': VueCrudNew,
    'v-crud-edit': VueCrudEdit
  },

  watch: {
    action () {
      this.activeComponent = 'v-crud-' + this.action
    },

    model () {
      this.setApi()
    }
  },

  created () {
    this.setApi()
    this.activeComponent = 'v-crud-' + this.action
  },

  methods: {
    setApi () {
      this.api = this.$resource(
        this.rootConfig.endPoint + '/' + this.config.resource, {}, {}, {headers: this.rootConfig.headers})
    }
  }
}
</script>

<style scoped>

</style>
