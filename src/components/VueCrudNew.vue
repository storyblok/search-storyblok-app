<template>
  <el-form ref="form" :model="model" label-width="120px">
    <el-tabs>
      <el-tab-pane :key="tab.label" v-for="tab in config.formFields" :label="tab.label">
        <el-form-item :key="field.name" :label="field.label" v-for="field in tab.fields">
          <div :placeholder="field.placeholder" :options="field.options" :type="field.type" :is="field.component" v-model="model[field.name]"></div>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Save</el-button>
      <el-button @click="$router.push({name: 'admin', params: {id: 'all', action: 'index'}})">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Select from './fields/Select.vue'

export default {
  name: 'v-crud-new',

  props: ['config', 'rootConfig', 'api', 'params', 'id'],

  data () {
    return {
      model: {}
    }
  },

  components: {
    'v-crud-select': Select
  },

  methods: {
    onSubmit () {
      let params = {}

      if (this.config.singleRootObject) {
        params[this.config.singleRootObject] = this.model
      } else {
        params = this.model
      }

      this.api
        .save(params)
        .then(() => {
          this.$router.push({name: 'admin', params: {id: 'all', action: 'index'}})
        })
        .catch((res) => {
          this.$message.error('Oops, something went wrong. ' + JSON.stringify(res.data))
        })
    }
  }
}
</script>
