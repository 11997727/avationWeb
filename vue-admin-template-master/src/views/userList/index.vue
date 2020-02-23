<template>
  <div>
    <el-table
      v-loading="loading"
      stripe
      :default-sort="{prop: 'vip', order: 'descending'}"
      :data="tableData.filter(data => !search || data.userName.toLowerCase().includes(search.toLowerCase()) ||
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
        prop="userPhone"
        label="手机号"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="userSex"
        label="性别"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userSex == 1 ? '女':'男' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="userType"
        label="会员类型"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userType == 1 ? 'VIP会员':'普通会员' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="userDeleteStatus"
        label="状态"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userDeleteStatus == 1 ? '正常':'禁用' }}</span>
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
          >Edit</el-button>
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

    <el-dialog title="用户管理" :visible.sync="dialogFormVisible" width="500px" @close="close">
      <el-form :model="form">
        <el-form-item label="会员类型" label-width="120px">
          <el-select v-model="form.userType" placeholder="请选择会员类型">
            <el-option label="普通会员" :value="0" />
            <el-option label="VIP会员" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="会员管理" label-width="120px">
          <el-select v-model="form.userDeleteStatus" placeholder="请选择会员类型">
            <el-option label="禁用" :value="0" />
            <el-option label="正常" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSumbit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'User',
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
    close(){
      this.onload()
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.form = row
      this.dialogFormVisible = true
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
      this.$http.post(this.$url + 'user/getUsersList', params).then((res) => {
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
    },
    onSumbit() {
      this.$http.post(this.$url + 'user/updateUser', this.form).then((res) => {
        if (res.data.code === 2001) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogFormVisible = false
        }
        if (res.data.code === 2004) {
          this.$message.error('修改失败')
        }
      })
    }
  }
}
</script>
