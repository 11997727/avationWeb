<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row :gutter="20" class="demo-form-inline" style="margin-top: 30px;margin-left:30px">
        <el-col :span="6">
          <el-form-item label="法规" prop="regulationsId">
            <el-select v-model="ruleForm.regulationsId" placeholder="请选择法规">
              <el-option
                v-for="item in regulationsList"
                :key="item.value"
                :label="item.regulationsName"
                :value="item.regulationsId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="条款号" prop="clauseNo">
            <el-input v-model.number="ruleForm.clauseNo" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键词" prop="clauseAntistop">
            <el-input v-model="ruleForm.clauseAntistop" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">搜索</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="demo-form-inline" style="margin-top: 30px;margin-left:30px">
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="btn">新增条款</el-button>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <el-table
      v-loading="loading"
      stripe
      :default-sort="{prop: 'date', order: 'descending'}"
      :data="tableData.filter(data => !search || data.clauseTitle.toLowerCase().includes(search.toLowerCase())
      )"
    >
      <el-table-column
        prop="clauseNo"
        label="条款号"
        sortable
        width="300"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.clauseNo }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="clauseNoAlias"
        label="条款号别名"
        width="300"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.clauseNoAlias }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="clauseTitle"
        label="条款标题"
        sortable
        width="300"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.clauseTitle }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="regulationsName"
        label="所属法规名称"
        sortable
        width="300"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.regulationsName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="clauseVersion"
        label="版本号"
        sortable
        width="300"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.clauseVersion }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="right"
      >
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
      loading: true,
      regulationsList: [],
      ruleForm: {
        clauseNo: '',
        clauseAntistop: '',
        regulationsId: ''
      }
    }
  },
  mounted() {
    this.getRegulations()
    this.getData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    btn() {
      this.$router.push({ path: '/example/addClause' })// 路由跳转页面
    },
    handleEdit(index, row) {
      this.$router.push({
        path: '/example/updateClause',
        query: {
          clauseId: row.clauseId
        }
      })
    },
    handleDelete(index, row) {
      this.$http.get(this.$url + 'clause/delClause', {
        params: { 'clauseId': row.clauseId }
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

    getRegulations() {
      this.$http.post(this.$url + 'regulations/showAll').then((res) => {
        if (res.data.code == '2001') {
          this.regulationsList = res.data.data
        } else {
          this.regulationsList = []
        }
      })
    },
    getData() {
      const params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('limit', this.pageSize)
      params.append('regulationsId', this.ruleForm.regulationsId)
      params.append('clauseAntistop', this.ruleForm.clauseAntistop)
      params.append('clauseNo', this.ruleForm.clauseNo)
      if (typeof (this.ruleForm.clauseNo) == "number" || this.ruleForm.clauseNo == '') {
        this.$http.post(this.$url + 'clause/showClause', params).then((res) => {
          if (res.data.code == '2001') {
            this.loading = false
            this.tableData = res.data.data
            this.total = res.data.count
            this.pageSize = res.data.limit
            this.currentPage = res.data.page
          } else {
            this.total = res.data.count
            this.loading = false
            this.tableData = []
          }
        })
      }else{
        this.$message.error('请输入正确条款号')
      }
    }
  }
}
</script>
