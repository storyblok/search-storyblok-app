<template>
  <div>
    <div class="header">
      <span class="title">{{ config.name }}</span>
      <span class="buttons" v-if="!config.hideCreate">
        <el-button @click="$router.push({name: 'admin', params: {model: model, id: 'all', action: 'new'}})">New {{ config.name }}</el-button>
      </span>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @row-click="handlRowClick"
      @selection-change="handleSelectionChange">
      <div slot="empty">
        No items yet
      </div>
      <el-table-column
        type="selection"
        width="55"
        v-if="config.selectable">
      </el-table-column>
      <el-table-column
        :key="column.property"
        :label="column.label"
        :property="column.property"
        :width="column.width"
        v-for="column in config.columns">

        <template scope="scope">
          <span v-if="scope.row[column.property] === true || scope.row[column.property] === false">
            <el-tag>
              {{scope.row[column.property] === true ? 'Yes' : 'No'}}
            </el-tag>
          </span>
          <span v-else>
            {{scope.row[column.property]}}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div class="footer" v-if="pageSize > 0">
      <el-pagination
        layout="prev, pager, next"
        :total="numFound"
        :page-size="pageSize"
        @current-change="pageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-crud-index',

  props: ['config', 'rootConfig', 'api', 'model'],

  data () {
    return {
      tableData: [],
      multipleSelection: [],
      pageSize: 0,
      numFound: 0,
      page: 1,
      loading: false
    }
  },

  mounted () {
    this.loadData()
  },

  watch: {
    model () {
      this.loadData()
    }
  },

  methods: {
    pageChange (page) {
      this.page = page
      this.loadData()
    },

    loadData () {
      this.loading = true
      this.api
        .get({page: this.page})
        .then(this.setTableData)
    },

    getHeader (res, header) {
      if (res.headers.map[header]) {
        return parseInt(res.headers.map[header][0])
      }
      return 0
    },

    setTableData (res) {
      this.pageSize = this.getHeader(res, 'Per-Page')
      this.numFound = this.getHeader(res, 'Total')

      if (this.config.rootObject) {
        this.tableData = res.body[this.config.rootObject]
      } else {
        this.tableData = res.body
      }

      this.loading = false
    },

    handlRowClick (row) {
      this.$router.push({name: 'admin', params: {id: row.id, action: 'edit', model: this.config.route}})
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
  .footer {
    padding: 30px 0;
    text-align: center;
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .title {
    margin-right: auto;
    font-size: 1.2rem;
  }

  .buttons {
    margin-left: auto;
  }
</style>
