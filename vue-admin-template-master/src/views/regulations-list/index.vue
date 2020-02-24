<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" style="margin-top: 30px;margin-left:30px">
      <el-form-item>
        <el-button type="primary" @click="btn">新增法规</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      stripe
      :default-sort="{prop: 'date', order: 'descending'}"
      :data="tableData.filter(data => !search || data.regulationsPartNoAlias.toLowerCase().includes(search.toLowerCase())
      )"
    >
      <el-table-column
        prop="regulationsPartNo"
        label="部号"
        sortable

      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.regulationsPartNo }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="regulationsPartNoAlias"
        label="法规部号别名"

      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.regulationsPartNoAlias }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="regulationsVersion"
        label="版本号"
        sortable

      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.regulationsVersion }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="regulationsName"
        label="法规名称"
      >
<!--        <template slot-scope="scope">-->
<!--          <el-popover trigger="hover" placement="top">-->
<!--            <p>法规类型: {{ scope.row.regulationsTypeName }}</p>-->
<!--            <p>法规分类: {{ scope.row.cname }}</p>-->
<!--            <div slot="reference" class="name-wrapper">-->
<!--              <el-tag size="medium">{{ scope.row.regulationsName }}</el-tag>-->
<!--            </div>-->
<!--          </el-popover>-->
<!--        </template>-->
      </el-table-column>

      <el-table-column
        prop="regulationsShowStatus"
        label="前台显示"
        width="200"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.regulationsShowStatus == 1 ? '显示':'不显示' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="right"
      >
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"
          />
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      align="center"
      style="margin-top: 20px"
      :current-page="currentPage"
      :page-sizes="[5,10,20,30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>

<script>
export default {
  name: 'RegulationsList',
  data() {
    return {
      tableData: [],
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    btn() {
      this.$router.push({ path: 'addRegulations' })// 路由跳转页面
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'UpdateRegulations',
        query: {
          regulationsId: row.regulationsId
        }
      })
    },
    handleDelete(index, row) {
      this.$http.get(this.$url + 'regulations/delRegulations', {
        params: { 'regulationsId': row.regulationsId }
      }).then((res) => {
        if (res.data.code == '2001') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getData()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.getData()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getData()
    },
    getData() {
      const params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('limit', this.pageSize)
      this.$http.post(this.$url + 'regulations/showRegulations', params).then((res) => {
        if (res.data.code == '2001') {
          this.loading = false
          this.tableData = res.data.data
          this.total = res.data.count
        } else {
          this.total = res.data.count
          this.loading = false
          this.tableData = []
        }
      })
    }
  }
}
</script>
