
<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top: 30px">

    <el-form-item label="*服务协议" prop="msg">
      <tinymce-editor
        ref="editor"
        v-model="ruleForm.serviceAgreementContent"
        :disabled="disabled"
        @onClick="onClick"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
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
      // msg: '',
      disabled: false,
      ruleForm: {
        serviceId:'',
        serviceAgreementContent:''
      },
      rules: {
        serviceAgreementContent: [
          {
            required: true,
            message: '请输入信息'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      this.$http.post(this.$url + 'admin/initService',).then((res) => {
        if (res.data.code == '2001') {
          console.log(JSON.stringify(res.data.data))
          this.ruleForm = res.data.data
        } else {
          this.ruleForm = []
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.$url + 'admin/updateService',this.ruleForm).then((res) => {
            if (res.data.code == '2001') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.editor.clear()
    },
    onClick(e, editor) {
      console.log('Element clicked')
      console.log(e)
      console.log(editor)
    },
    // 清空内容
    clear() {
      this.$refs.editor.clear()
    },
    getContent() {
      alert(this.$refs.editor.getContent())
    }
  }
}
</script>
