<template>
  <div>
    <el-button @click="onSubmit">Initiate crawl</el-button>
  </div>
</template>

<script>
export default {
  name: 'enqueue',
  props: ['options', 'placeholder', 'value', 'rootModel', 'rootConfig'],

  created () {

  },

  data () {
    return {
      api: null
    }
  },

  methods: {
    onSubmit () {
      this.api = this.$resource(
        this.rootConfig.endPoint + '/crawl?space_id=' + this.rootConfig.spaceId, {}, {}, {headers: this.rootConfig.headers})

      this.api
        .save()
        .then(() => {
          this.$message('Enqueued successfully')
        })
        .catch((res) => {
          this.$message.error('Oops, something went wrong. ' + JSON.stringify(res.data))
        })
    }
  }
}
</script>

<style>

</style>
