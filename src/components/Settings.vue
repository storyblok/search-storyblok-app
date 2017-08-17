<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="model" label-width="120px">
      <div v-for="(item, key) in model">
        <h2>{{ key|humanize }}</h2>

        <el-form-item :key="innerKey" :label="innerKey|humanize" v-for="(innerItem, innerKey) in item">
          <el-input v-model="model[key][innerKey]"></el-input>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Save</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['config', 'rootConfig'],

  data () {
    return {
      api: null,
      loading: true,
      model: {
        stripe: { public_key: '', private_key: '' },
        general_setting: { default_shipping_price: '', default_tax: '', domain: '' }
      }
    }
  },

  created () {
    this.api = this.$resource(
      this.rootConfig.endPoint + '/settings/{id}', {}, {}, {headers: this.rootConfig.headers})

    this.api
      .get({id: 'mine'})
      .then((res) => {
        this.loading = false

        for (let i = 0; i < res.data.length; i++) {
          let data = res.data[i]
          if (typeof this.model[data.code] !== 'undefined' && typeof this.model[data.code][data.setting_key] !== 'undefined') {
            this.model[data.code][data.setting_key] = data.setting
          }
        }
      })
  },

  methods: {
    onSubmit () {
      this.api
        .update({id: 'mine'}, this.model)
        .then((res) => {
          this.$message('Updated successfully')
        })
    }
  }
}
</script>
