<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" style="margin-top: 30px;margin-left:30px">
      <el-form-item>
        <el-button type="primary" @click="btn">新增一级分类</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      stripe
      :default-sort="{prop: 'date', order: 'descending'}"
      :data="tableData.filter(data => !search || data.regulationsTypeName.toLowerCase().includes(search.toLowerCase())
      )"
    >
      <el-table-column
        prop="regulationsTypeName"
        label="一级分类"
        sortable
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.regulationsTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="cname"
        label="二级分类"
      >
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.classifyList" style="margin-left: 10px">{{ item.cname }}</span>
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

    <!-- 二级Table -->
    <el-dialog title="二级分类列表" :visible.sync="dialogTableVisible" @close="closeDialog">

      <el-button type="primary" @click="btn2">新增二级分类</el-button>

      <el-table
        :data="gridData.filter(data => !search2 || data.cname.toLowerCase().includes(search2.toLowerCase())
        )"
      >
        <el-table-column
          prop="regulationsPartNoAlias"
          label="二级分类"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cname }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="right"
        >
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search2"
              size="mini"
              placeholder="输入关键字搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit2(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete2(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>

    <!-- Form -->
    <!--    <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>-->

    <el-dialog title="修改二级分类" :visible.sync="dialogFormVisible" :close-on-press-escape=false :close-on-click-modal=false :show-close="false">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="请输入二级分类名称" prop="cname">
          <el-input v-model="form.cname" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiao('form')">取 消</el-button>
        <el-button type="primary" @click="dialogForm('form')">确 定</el-button>
      </div>
    </el-dialog>

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
  name: 'RegulationsTrype',
  data() {
    return {
      dialogFormVisible: false,
      dialogTableVisible: false,
      tableData: [],
      search: '',
      search2: '',
      loading: true,
      gridData: [],
      cid: '',
      regulationsTypeId: '',
      form: {
        cname:''
      },
      rules: {
        cname: [
          { required: true, message: '请输入二级分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    btn() {
      // 新增分类
      this.$prompt('请输入一级分类名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '请输入'
      }).then(({ value }) => {
        this.$http.get(this.$url + 'regulationsTrype/addOneType', {
          params: { 'regulationsTypeName': value }
        }).then((res) => {
          if (res.data.code == '2001') {
            this.$message({
              type: 'success',
              message: '添加成功 '
            })
            this.getData()
          } else {
            this.$message.error('添加失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 点击展开二级分类列表
    handleEdit(index, row) {
      // console.log(index, row)
      this.regulationsTypeId = row.regulationsTypeId
      this.getGridData()
      this.dialogTableVisible = true
    },
    getGridData() {
      this.$http.get(this.$url + 'cassify/classifyList', {
        params: { 'regulationsTypeId': this.regulationsTypeId }
      }).then((res) => {
        if (res.data.code == '2001') {
          this.gridData = res.data.data
        } else {
          this.gridData = []
        }
      })
    },
    btn2() {
      // 新增分类
      const _this = this
      var ck = _this.regulationsTypeId
      this.$prompt('请输入二级分类名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '请输入'
      }).then(({ value }) => {
        // const params = new URLSearchParams()
        // params.append('ck', ck)
        // params.append('cname', value.toString())
        _this.$http.get(this.$url + 'cassify/addCassify', {
          params: { 'cname': value, 'ck': ck }
        }).then((res) => {
          if (res.data.code == '2001') {
            _this.$message({
              type: 'success',
              message: '添加成功 '
            })
            _this.getGridData()
          } else {
            this.$message.error('添加失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 打开二级form表单
    handleEdit2(index, row) {
      this.dialogFormVisible = true
      // this.form.cname=row.cname
      this.cid = row.cid
    },
    handleDelete2(index, row) {
      var _this = this
      const params = new URLSearchParams()
      params.append('cid', row.cid)
      this.$http.post(_this.$url + 'cassify/delClassifyByCid', params).then(function(res) {
        console.log(JSON.stringify(res.data))
        if (res.data.code == '2001') {
          _this.$message({
            type: 'success',
            message: '删除成功 '
          })
          // alert('成功')
          _this.getGridData()
        } else {
          _this.$message.error('删除失败')
          // alert('失败')
        }
      })
    },
    // 提交表单修改二级分类名
    dialogForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          var _this = this
          _this.$http.get(this.$url + 'cassify/classifyUpdateByCid', {
            params: { 'cid': this.cid, 'cname': this.form.cname }
          }).then((res) => {
            if (res.data.code == '2001') {
              this.$message({
                type: 'success',
                message: '修改成功 '
              })
              _this.dialogFormVisible = false
              _this.getGridData()
            } else {
              _this.$message.error('修改失败')
            }
            // this.form.cname = ''
            this.$refs[form].resetFields();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    quxiao(form){
      this.dialogFormVisible=false
      this.$refs[form].resetFields();
    },
    closeDialog() {
      this.getData()
    },
    // 删除一级
    handleDelete(index, row) {
      // 删除一级分类包含二级
      console.log(row.regulationsTypeId)
      this.$http.get(this.$url + 'regulationsTrype/delregulationsTrype', {
        params: { 'regulationsTypeId': row.regulationsTypeId }
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
    getData() {
      this.$http.post(this.$url + 'regulationsTrype/regulationsTrypeList').then((res) => {
        if (res.data.code == '2001') {
          this.loading = false
          this.tableData = res.data.data
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

