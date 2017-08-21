<template>
  <div>
    <el-button @click="onSubmit">Initiate crawl</el-button>
    <div v-if="indexing">
      Indexing ...
    </div>
    <div v-if="results.hits">
      Documents in index: {{ results.hits.total }}
    </div>
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
      api: null,
      searchApi: null,
      results: {},
      interval: null,
      indexing: false,
      intervalCount: 0
    }
  },

  destroyed () {
    clearInterval(this.interval)
  },

  mounted () {
    if (this.rootModel.uid) {
      this.search()
    }
  },

  watch: {
    rootModel () {
      this.search()
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

          this.intervalCount = 0
          this.interval = setInterval(this.search, 2000)
          this.indexing = true
        })
        .catch((res) => {
          this.$message.error('Oops, something went wrong. ' + JSON.stringify(res.data))
        })
    },

    search () {
      this.searchApi = this.$resource(
        `https://sapi.searchblok.com/v1/${this.rootModel.uid}/_search`)

      if (this.intervalCount > 10) {
        clearInterval(this.interval)
        this.indexing = false
      }

      this.intervalCount += 1

      this.searchApi
        .save()
        .then((res) => {
          this.results = res.data
        })
    }
  }
}
</script>

<style>

</style>
