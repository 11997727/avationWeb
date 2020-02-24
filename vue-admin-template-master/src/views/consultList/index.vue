<template>
  <div>
    <el-table
      v-loading="loading"
      stripe
      :data="tableData.filter(data => !search || data.consultContent.includes(search) ||
        data.userPhone.includes(search))"
    >
      <el-table-column
        prop="userName"
        label="姓名"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="consultContent"
        label="咨询内容"
        :show-overflow-tooltip="true"
        width="500px"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px;overflow: hidden">{{ scope.row.consultContent }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="consultCreatetime"
        label="咨询时间"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row.consultCreatetime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="userPhone"
        label="联系方式"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="right" width="300px">
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
          >查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.consultId)"
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

    <!--弹出框-->

    <el-dialog title="咨询内容详情" :visible.sync="dialogFormVisible" :close-on-press-escape=false :close-on-click-modal=false :show-close="false">
      <el-form :model="form">
        <el-form-item label="咨询人：" label-width="120px">
          <el-input v-model="form.userName" autocomplete="off" :readonly="true" />
        </el-form-item>
        <el-form-item label="联系电话：" label-width="120px">
          <el-input v-model="form.userPhone" autocomplete="off" :readonly="true" />
        </el-form-item>
        <el-form-item label="咨询内容：" label-width="120px">
          <el-input
            v-model="form.consultContent"
            type="textarea"
            autosize
            :readonly="true"
          />
        </el-form-item>
        <el-form-item label="相关条款编号：" label-width="120px">
          <el-input v-model="form.clauseNo" autocomplete="off" :readonly="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style lang="css">
  .el-tooltip__popper{font-size: 14px; max-width:50% } /*设置显示隐藏部分内容，按50%显示*/
</style>

<script>
export default {
  name: 'ConsultList',
  data() {
    return {
      loading: true,
      dialogFormVisible: false,
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      form: []
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    handleEdit(index, row) {
      this.form = row
      this.dialogFormVisible = true
    },

    handleDelete(index, zid) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = new URLSearchParams()
        params.append('consultId', zid)
        this.$http.post(this.$url + 'consult/delConsult', params).then((res) => {
          if (res.data.code === 2001) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.onload()
          }
          if (res.data.code === 2004) {
            this.$message.error('删除失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange: function(size) {
      this.pageSize = size
      this.onload()
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      this.onload()
    },
    onload() {
      const params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('limit', this.pageSize)
      this.$http.post(this.$url + 'consult/getConsultList', params).then((res) => {
        this.loading = true
        if (res.data.code === 2001) {
          console.log('请求成功')
          this.tableData = res.data.data
          this.total = res.data.count
          this.loading = false
        }
        if (res.data.code === 2004) {
          console.log('请求失败')
          this.loading = false
        }
      })
    }
  }

}
</script>
