<template>
  <div>
    <el-row style="margin-left: 30px;margin-top: 30px">
      <el-button type="primary" @click="onAdd">新增管理员</el-button>
    </el-row>
    <el-table
      v-loading="loading"
      stripe
      :data="tableData.filter(data => !search || data.adminName.includes(search) ||
        data.adminPhone.includes(search))"
    >
      <el-table-column
        prop="adminPhone"
        label="管理员手机号"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.adminPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="adminName"
        label="管理员姓名"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px;overflow: hidden">{{ scope.row.adminName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="添加日期"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.adminCreatetime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
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

    <!--添加弹出框-->

    <el-dialog title="添加子管理员" :visible.sync="dialogFormVisible" width="500px" :close-on-press-escape=false :close-on-click-modal=false :show-close="false">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">
        <el-form-item label="管理员姓名：" label-width="120px" prop="adminName">
          <el-input v-model="ruleForm.adminName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号：" label-width="120px" prop="adminPhone">
          <el-input v-model.number="ruleForm.adminPhone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码：" label-width="120px" prop="adminPassword">
          <el-input v-model="ruleForm.adminPassword" autocomplete="off" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiao('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="onSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改弹出框-->

    <el-dialog title="管理子管理员" :visible.sync="formVisible" width="500px" @close="close" :close-on-press-escape=false :close-on-click-modal=false :show-close="false">
      <el-form ref="form" :model="form" :rules="adminRules" class="demo-ruleForm">
        <el-form-item label="手机号：" label-width="120px" prop="adminPhone">
          <el-input v-model.number="form.adminPhone" autocomplete="off" :readonly="true" />
        </el-form-item>
        <el-form-item label="管理员姓名：" label-width="120px" prop="adminName">
          <el-input v-model="form.adminName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码：" label-width="120px" prop="adminPassword">
          <el-input v-model="form.adminPassword" autocomplete="off" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="onChange('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var isMobileNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        const isPhone = reg.test(value)
        value = Number(value) // 转换为数字
        if (typeof value === 'number' && !isNaN(value)) { // 判断是否为数字
          value = value.toString() // 转换成字符串
          if (value.length < 0 || value.length > 12 || !isPhone) { // 判断是否为11位手机号
            callback(new Error('手机号码格式如:138xxxx8754'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入电话号码'))
        }
      }
    }

    return {
      loading: true,
      formVisible: false,
      dialogFormVisible: false,
      ruleForm: {},
      form: {},
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      rules: {
        adminName: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        adminPhone: [
          { validator: isMobileNumber, trigger: 'blur' }
        ],
        adminPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      adminRules: {
        adminName: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        adminPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    close() {
      this.onload()
    },
    onAdd() {
      this.dialogFormVisible = true
    },
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$http.post(this.$url + 'admin/addAdmin', this.ruleForm).then((res) => {
            this.loading = true
            if (res.data.code === 2001) {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
            } else if (res.data.code === 2002) {
              this.$message.error('手机号重复')
            } else {
              this.$message.error('添加失败')
            }
            this.dialogFormVisible = false
            this.$refs[ruleForm].resetFields();
            this.onload()
          })
        } else {
          console.log('error submit!!')
          // this.dialogFormVisible = false
          // this.loading = true
          // return false
        }
      })
    },
    quxiao(ruleForm){
      this.dialogFormVisible = false
      // this.ruleForm.adminName=''
      // this.ruleForm.adminPhone=''
      // this.ruleForm.adminPassword=''
      this.$refs[ruleForm].resetFields();
    },
    onChange(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.$url + 'admin/updateAdmin', this.form).then((res) => {
            this.loading = true
            if (res.data.code === 2001) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.formVisible = false
              this.onload()
            } else {
              this.$message.error('修改失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleEdit(index, row) {
      this.form = row
      this.formVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('adminId', row.adminId)
        this.$http.post(this.$url + 'admin/delAdmin', params).then((res) => {
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
      this.$http.post(this.$url + 'admin/showAdmin', params).then((res) => {
        this.loading = true
        if (res.data.code === 2001) {
          // console.log('请求成功')
          this.tableData = res.data.data
          this.total = res.data.count
          this.loading = false
        }
        if (res.data.code === 3001) {
          // console.log('请求失败')
          this.loading = false
        }
      })
    }
  }

}
</script>
