
<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top: 30px">

    <el-row>
      <el-col :span="12">
        <el-form-item label="法规" prop="regulationsId">
          <el-select v-model="ruleForm.regulationsId" placeholder="请选择法规" @change="onChange">
            <el-option
              v-for="item in regulationsList"
              :key="item.value"
              :label="item.regulationsName"
              :value="item.regulationsId"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="法规目录" prop="directoryForeignKey">
          <el-cascader
            v-model="valueId"
            :options="options"
            :props="{value:'id',label:'label', checkStrictly: true }"
            clearable
            @change="onHandleChange"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="条款编号" prop="clauseNo">
      <el-input v-model.number="ruleForm.clauseNo" type="number" />
    </el-form-item>
    <el-form-item label="条款编号别名" prop="clauseNoAlias">
      <el-input v-model="ruleForm.clauseNoAlias" />
    </el-form-item>
    <el-form-item label="条款版本号" prop="clauseVersion">
      <el-input v-model="ruleForm.clauseVersion" />
    </el-form-item>
    <el-form-item label="条款标题" prop="clauseTitle">
      <el-input v-model="ruleForm.clauseTitle" />
    </el-form-item>
    <el-form-item label="*条款内容 " prop="clauseContent">
      <tinymce-editor
        ref="editor"
        v-model="ruleForm.clauseContent"
        :disabled="disabled"
        @onClick="onClick"
      />
    </el-form-item>
    <el-form-item label="关键词" prop="clauseAntistop">
      <el-input v-model="ruleForm.clauseAntistop" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
<!--      <el-button @click="resetForm('ruleForm')">重置</el-button>-->
      <el-button @click="getBack()">返回</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import TinymceEditor from '../addRegulations/TinymceEditor'
export default {
  components: {
    TinymceEditor
  },
  data() {
    return {
      // dialogImageUrl: '',
      // dialogVisible: false,
      disabled: false,
      regulationsList: [],
      valueId: [], // 联动选择框的id主键
      ruleForm: {
        regulationsId: '',
        clauseNo: '',
        clauseNoAlias: '',
        clauseVersion: '',
        clauseTitle: '',
        clauseContent: '',
        clauseAntistop: '',
        directoryForeignKey: ''
      },
      rules: {
        regulationsId: [
          { required: true, message: '请选择法规', trigger: 'change' }
        ],
        directoryForeignKey: [
          { required: true, message: '请选择法规目录', trigger: 'change' }
        ],
        clauseNo: [
          { required: true, message: '请输入条款编号', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        clauseNoAlias: [
          { required: true, message: '请输入条款编号别名', trigger: 'blur' }
        ],
        clauseVersion: [
          { required: true, message: '请输入条款版本号', trigger: 'blur' }
        ],
        clauseTitle: [
          { required: true, message: '请输入条款标题', trigger: 'blur' }
        ],
        clauseContent: [
          { required: true, message: '请输入条款内容' }
        ],
        clauseAntistop: [
          { required: true, message: '请输入关键词', trigger: 'blur' }
        ]
      },
      options: []
    }
  },
  created() {
    // 初始化一级分类下拉
    this.getRegulations()
    // this.setContent()
    // this.$refs.editor.setContent("22222")
  },
  methods: {
    getRegulations() {
      this.$http.post(this.$url + 'regulations/showAll').then((res) => {
        if (res.data.code == '2001') {
          this.regulationsList = res.data.data
        } else {
          this.regulationsList = []
        }
      })
    },
    onChange() {
      const params = new URLSearchParams()
      params.append('directoryId', this.ruleForm.regulationsId)
      this.$http.post(this.$url + 'directory/selectDirectoryById2', params).then((res) => {
        if (res.data.code == '2001') {
          this.options = res.data.data
        } else {
          this.options = []
        }
      })
    },
    onHandleChange() {
      // console.log(JSON.stringify(this.valueId))
      if (this.valueId.length === 1) {
        this.ruleForm.directoryForeignKey = this.valueId[0]
      } else {
        this.ruleForm.directoryForeignKey = this.valueId[this.valueId.length - 1]
      }
    },
    // 表单的提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var _this = this
          // console.log(JSON.stringify(_this.ruleForm))
          this.$http.post(this.$url + 'clause/addClause', _this.ruleForm).then((res) => {
            if (res.data.code == '2001') {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              // this.resetForm(formName)
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
    // 清空表单以及富文本编译器内容
    // resetForm(formName) {
    //   this.$refs[formName].resetFields()
    //   this.$refs.editor.clear()
    //   this.valueId=[]
    //   this.options = []
    // },
    // 文本编译器点击事件
    onClick(e, editor) {
      // console.log('Element clicked')
      // console.log(e)
      // console.log(editor)
    },
    // 获取文本编译器的HTML内容
    getContent() {
      // alert(this.$refs.editor.getContent())
    },
    // 设置文本编译器的HTML内容
    setContent(msg) {
      this.$refs.editor.setContent(msg)
    },
    getBack() {
      this.$router.push({
        path: '/example/clauseList'
      })
    }

  }
}
</script>
