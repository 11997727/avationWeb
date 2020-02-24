<template>
  <div class="block" align="center">
    <el-table
      :data="tableData.filter(data => !search || data.feedbackContent.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
      v-loading="loading"
    >

      <el-table-column
        label="反馈呢容"
        prop="feedbackContent"
      />

      <el-table-column
        label="反馈时间"
        prop="feedbackCreatetime"
      >
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{scope.row.consultCreatetime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
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
          >查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      title="意见反馈内容详情"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-form :model="form">

        <el-form-item label="反馈内容" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.feedbackContent" autocomplete="off" disabled="disabled" rows="15"  ></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">关 闭</el-button>
  </span>

    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      total: 0,
      size: 5,
      tableData: [],
      search: '',
      loading:true,
      centerDialogVisible:false,
      form:{
        feedbackContent:""
      },
      formLabelWidth:'70px'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleEdit(index, row) {
      // console.log(row.feedbackId)
      this.centerDialogVisible=true
      this.$http.get(this.$url + 'feedback/queryFeedbackByFeedbackId', {
        params: { 'feedbackId': row.feedbackId }
      }).then((res) => {
        if (res.data.code == '2001') {
        this.form.feedbackContent=res.data.data.feedbackContent
        }
      })
    },
    handleDelete(index, row) {
      this.$http.get(this.$url + 'feedback/delFeedback', {
        params: { 'feedbackId': row.feedbackId }
      }).then((res) => {
        if (res.data.code == '2001') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.init()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    handleSizeChange(size) {
      this.size=size
      this.init()
    },
    handleCurrentChange(currentPage) {
      this.currentPage=currentPage
      this.init()
    },
    init(){
      const params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('limit', this.size)
      this.$http.post(this.$url + 'feedback/feedbackList', params).then((res) => {
        if (res.data.code === 2001) {
          // console.log('请求成功')
          this.tableData = res.data.data
          this.total = res.data.count
          this.loading=false
        }
        if (res.data.code === 2004) {
          // console.log('请求失败')
        }
      })
    }
  }
}
</script>

