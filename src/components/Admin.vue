<template>
  <div v-if="!loading">
    <el-menu default-active="1" @select="handleSelect" mode="horizontal">
      <el-menu-item :key="index" :index="nav.route" v-for="(nav, index) in config.body">
        {{ nav.name }}
      </el-menu-item>
    </el-menu>
    <div class="container" v-if="activeConfig != null">
      <div :is="activeConfig.component" :model="model" :action="action" :id="id" :root-config="config" :config="activeConfig"></div>
    </div>
  </div>
</template>

<script>
import VueCrud from './VueCrud'
import Settings from './Settings'
const local = window.location.href.indexOf('localhost:') > -1
const endPoint = local ? 'https://localhost:3002/v1' : 'https://api.storyblok.com/v1'

export default {
  name: 'admin',

  props: ['id', 'model', 'action'],

  data () {
    return {
      loading: true,
      config: {
        spaceId: '',
        component: 'v-admin',
        endPoint: endPoint,
        headers: {},
        body: [
          {
            component: 'v-crud',
            resource: 'crawl_configs/{id}',
            route: 'crawl_configs',
            name: 'Crawler',
            hideCreate: true,
            rootObject: 'crawl_configs',
            selectable: false,
            formFields: [
              {
                component: 'el-tab',
                label: 'General',
                fields: [
                  {
                    component: 'v-crud-text',
                    label: 'ID',
                    name: 'uid'
                  },
                  {
                    component: 'el-input',
                    label: 'Url to crawl',
                    name: 'base_url'
                  },
                  {
                    component: 'el-checkbox',
                    label: 'Active?',
                    name: 'enabled'
                  },
                  {
                    component: 'enqueue',
                    label: 'Actions',
                    name: 'enqueue'
                  }
                ]
              }
            ],
            columns: [
              {
                component: 'el-table-column',
                label: 'ID',
                property: 'uid'
              },
              {
                component: 'el-table-column',
                label: 'Url',
                property: 'base_url'
              },
              {
                component: 'el-table-column',
                label: 'Last crawled',
                property: 'last_crawled'
              },
              {
                component: 'el-table-column',
                label: 'Crawl requested',
                property: 'crawl_requested'
              },
              {
                component: 'el-table-column',
                label: 'Active?',
                property: 'enabled'
              }
            ]
          }
        ]
      }
    }
  },

  computed: {
    activeConfig: function () {
      let model = this.config.body.filter((e) => {
        return e.route === this.model
      })

      if (model.length > 0) {
        return model[0]
      }

      return null
    }
  },

  created () {
    if (local) {
      this.config.headers['Authorization'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozOTgyMSwidGltZXN0YW1wIjoxNTAzNTk2OTAwfQ.j-w_W8LWCl2CNImGhBGujC_utrWVCySlNRL0ksFJ-dw'
      this.setSpaceId('39837')
      this.loading = false
    } else {
      window.storyblok.getSession((data) => {
        this.setSpaceId(data.session.space_id)
        this.config.headers['Authorization'] = data.session.access_token
        this.loading = false
      })
    }
  },

  components: {
    'v-crud': VueCrud,
    'settings': Settings
  },

  methods: {
    handleSelect (index) {
      this.$router.push({name: 'admin', params: {model: index, id: 'all', action: 'index'}})
    },

    setSpaceId (spaceId) {
      this.config.spaceId = spaceId
      this.config.body.forEach((item) => {
        item.resource = item.resource + '?space_id=' + spaceId
      })
    }
  }
}
</script>

<style scoped>
  .container {
    padding: 30px;
  }
</style>
