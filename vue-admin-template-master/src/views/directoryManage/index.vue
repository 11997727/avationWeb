
<template>

  <div class="custom-tree-container">

    <el-row :gutter="20" class="demo-form-inline" style="margin-top: 30px;margin-left:30px">

      <el-col :span="6">
        一级分类：
        <el-select v-model="regulationsTypeId" placeholder="请选择一级分类" @change="isShow">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.regulationsTypeName"
            :value="item.regulationsTypeId"
          />
        </el-select>
      </el-col>

      <el-col :span="6">
        二级分类：
        <el-select v-model="cid" placeholder="请选择二级分类" @change="isShowfagui">
          <el-option
            v-for="item in twoOptions"
            :key="item.value"
            :label="item.cname"
            :value="item.cid"
          />
        </el-select>
      </el-col>

      <el-col :span="6">
        法规：
        <el-select v-model="regulationsId" placeholder="请选择法规" @change="showTree">
          <el-option
            v-for="item in threeOptions"
            :key="item.value"
            :label="item.regulationsName"
            :value="item.regulationsId"
          />
        </el-select>
      </el-col>

      <el-col :span="6">
        <el-button type="text" :disabled="flag" @click="dialogFormVisible = true">新增一级目录</el-button>
      </el-col>

    </el-row>

    <div class="block">
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>{{ data.lever }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => append(node,data)"
            >
              添加
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => updateKeyChildren(data)"
            >
              修改
            </el-button>
          </span>
        </span>
      </el-tree>
      <!-- Form -->
      <el-dialog title="新增一级目录" :visible.sync="dialogFormVisible" :close-on-press-escape=false :close-on-click-modal=false :show-close="false">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="目录名称" prop="directoryNama">
            <el-input v-model="ruleForm.directoryNama" autocomplete="off" />
          </el-form-item>

          <el-form-item label="目录排序" prop="level">
            <el-input v-model.number="ruleForm.level" type="number" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="quxiao('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- Form -->
      <el-dialog title="新增子目录" :visible.sync="dialogFormVisible2" :close-on-press-escape=false :close-on-click-modal=false :show-close="false">
        <el-form ref="ruleForm2" :model="ruleForm2" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="目录名称" prop="directoryNama">
            <el-input v-model="ruleForm2.directoryNama" autocomplete="off" />
          </el-form-item>

          <el-form-item label="目录排序" prop="level">
            <el-input v-model.number="ruleForm2.level" type="number" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="quxiao2('ruleForm2')">取 消</el-button>
          <el-button type="primary" @click="submitForm2('ruleForm2')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- Form -->
      <el-dialog title="修改" :visible.sync="dialogFormVisible3" :close-on-press-escape=false :close-on-click-modal=false :show-close="false">
        <el-form ref="ruleForm3" :model="ruleForm3" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="目录名称" prop="directoryNama">
            <el-input v-model="ruleForm3.directoryNama" autocomplete="off" />
          </el-form-item>

          <el-form-item label="目录排序" prop="level">
            <el-input v-model.number="ruleForm3.level" type="number" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="quxiao3('ruleForm3')">取 消</el-button>
          <el-button type="primary" @click="submitForm3('ruleForm3')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style>
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
<script>
export default {
  data() {
    return {
      ruleForm: {
        level: '',
        directoryNama: '',
        regulationsForeignKey: ''
      },
      dialogFormVisible: false,

      ruleForm2: {
        // 上一级目录主信息
        data: {},
        // 当前目录的顺序
        level: '',
        // 当前目录的名称
        directoryNama: '',
        // 法规外键
        regulationsForeignKey: '',
        // 目录线索
        directoryKey: '',
        // 当前目录到根目录的距离
        distance: '',
        // 父id
        parentId: ''
      },
      dialogFormVisible2: false,

      ruleForm3: {
        level: '',
        directoryNama: '',
        directoryId: ''
      },
      dialogFormVisible3: false,

      flag: true,
      regulationsTypeId: '', // 一级分类主键
      cid: '', // 二级分类主键
      regulationsId: '', // 法规主键
      data: [],
      options: [],
      twoOptions: [],
      threeOptions: [],
      rules: {
        level: [
          { required: true, message: '请输入同级排序', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        directoryNama: [
          {
            required: true,
            message: '请输入目录名称'
          }
        ]

      }
    }
  },
  mounted() {
    this.showOneType()
    // this.getData()
  },
  methods: {
    // 显示一级下拉
    showOneType() {
      this.$http.get(this.$url + 'regulationsTrype/showAllOneType').then((res) => {
        if (res.data.code == '2001') {
          this.options = res.data.data
        } else {
          this.options = []
        }
      })
    },
    // 显示二级分类下拉
    isShow() {
      this.flag = true
      this.twoOptions = []
      this.threeOptions = []
      this.data = []
      this.cid = ''
      this.regulationsId = ''
      this.$http.get(this.$url + 'cassify/classifyList', {
        params: { 'regulationsTypeId': this.regulationsTypeId }
      }).then((res) => {
        if (res.data.code == '2001') {
          this.twoOptions = res.data.data
        } else {
          this.twoOptions = []
        }
      })
    },
    // 显示法规的下拉
    isShowfagui() {
      this.threeOptions = []
      this.data = []
      this.regulationsId = ''
      const params = new URLSearchParams()
      params.append('cid', this.cid)
      this.$http.post(this.$url + 'regulations/showRegulationsNameAndId', params).then((res) => {
        if (res.data.code == '2001') {
          this.threeOptions = res.data.data
        } else {
          this.threeOptions = []
          this.flag = true
        }
      })
    },
    showTree() {
      this.getData()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.ruleForm.regulationsForeignKey = this.regulationsId
          this.$http.post(this.$url + 'directory/addOneDirectoryById', this.ruleForm).then((res) => {
            if (res.data.code == '2001') {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.quxiao(formName)
              this.showTree()
            } else {
              this.$message.error('添加失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    quxiao(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    // 添加目录
    append(node, data) {
      this.dialogFormVisible2 = true
      // console.log(JSON.stringify(data))
      this.ruleForm2.data = data
      // console.log(node)
    },

    submitForm2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm2.regulationsForeignKey = this.regulationsId
          this.dialogFormVisible2 = false
          // console.log("这是父级目录")
          // console.log(JSON.stringify(this.ruleForm2.data))

          // 如果添加的是一级目录下的节点那么  目录线索就是一级目录主键加一级目录的线索
          if (this.ruleForm2.data.pid == '0') {
            // console.log("是在一级目录下添加的")
            this.ruleForm2.directoryKey = this.ruleForm2.data.id + this.ruleForm2.data.directoryKey
          } else {
            // 如果不是一级目录下的节点  那么，目录线索就是父节目录的线索加父节目录的主键加-
            this.ruleForm2.directoryKey = this.ruleForm2.data.directoryKey + this.ruleForm2.data.id + '-'
          }
          // 当前目录距离根节点的距离
          this.ruleForm2.distance = parseInt(this.ruleForm2.data.distance) + 1
          // 当前目录的父id
          this.ruleForm2.parentId = this.ruleForm2.data.id

          const params = new URLSearchParams()
          params.append('directoryNama', this.ruleForm2.directoryNama)
          params.append('parentId', this.ruleForm2.parentId)
          params.append('directoryKey', this.ruleForm2.directoryKey)
          params.append('distance', this.ruleForm2.distance)
          params.append('level', this.ruleForm2.level)
          params.append('regulationsForeignKey', this.ruleForm2.regulationsForeignKey)
          this.$http.post(this.$url + 'directory/addZiDirectory', params).then((res) => {
            if (res.data.code == '2001') {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              // console.log(JSON.stringify(node.parent.data))
              const newChild = { id: parseInt(res.data.data), label: this.ruleForm2.directoryNama, lever: this.ruleForm2.level, directoryKey: this.ruleForm2.directoryKey, distance: this.ruleForm2.distance, pid: this.ruleForm2.parentId, children: [] }
              if (!this.ruleForm2.data.children) {
                this.$set(this.ruleForm2.data, 'children', [])
              }
              this.ruleForm2.data.children.push(newChild)
              // console.log(JSON.stringify(newChild))
              this.getData()// 需要异步刷新更新目录顺序，不需要更新目录顺序直接注释
              this.quxiao2(formName)
            } else {
              this.$message.error('添加失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    quxiao2(formName) {
      this.dialogFormVisible2 = false
      this.$refs[formName].resetFields()
      this.ruleForm2.data = {}
    },

    // 删除目录
    remove(node, data) {
      // alert(JSON.stringify(data))
      // 要删除的目录主键
      var directoryId = data.id
      // 该目录下的子孙目录线索
      var directoryKey = ''
      if (data.pid == '0') {
        directoryKey = data.id + data.directoryKey
      } else {
        directoryKey = data.directoryKey + data.id + '-'
      }
      // console.log(directoryId)
      // console.log(directoryKey)
      const params = new URLSearchParams()
      params.append('directoryId', directoryId)
      params.append('directoryKey', directoryKey)
      this.$http.post(this.$url + 'directory/delDirectory', params).then((res) => {
        if (res.data.code == '2001') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    // 修改同级目录排序
    updateKeyChildren(data) {
      this.dialogFormVisible3 = true
      this.ruleForm3.directoryId = data.id
      this.ruleForm3.directoryNama = data.label
      this.ruleForm3.level = data.lever
    },

    submitForm3(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible3 = false
          this.$http.post(this.$url + 'directory/updateDirectoryById', this.ruleForm3).then((res) => {
            if (res.data.code == '2001') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.quxiao3(formName)
              this.getData()
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
    quxiao3(formName) {
      this.dialogFormVisible3 = false
      this.$refs[formName].resetFields()
    },

    getData() {
      const params = new URLSearchParams()
      params.append('directoryId', this.regulationsId)
      this.$http.post(this.$url + 'directory/selectDirectoryById2', params).then((res) => {
        if (res.data.code == '2001') {
          // console.log(JSON.stringify(res.data.data))
          this.data = res.data.data
          this.flag = false
        } else {
          this.data = []
          this.flag = false
        }
      })
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
