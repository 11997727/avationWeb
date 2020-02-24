<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1000px;margin-top: 30px">
      <el-form-item label="Email ：" prop="smtpEmail">
        <el-input v-model="ruleForm.smtpEmail" />
      </el-form-item>
      <el-form-item label="服务器：" prop="smtpServer">
        <el-input v-model="ruleForm.smtpServer" />
      </el-form-item>
      <el-form-item label="用户名：" prop="smtpUsername">
        <el-input v-model="ruleForm.smtpUsername" />
      </el-form-item>
      <el-form-item label="密码：" prop="smtpPassword">
        <el-input v-model="ruleForm.smtpPassword" />
      </el-form-item>
      <el-form-item label="一次连接服务器连续发送 ：" prop="number">
        <el-input v-model="ruleForm.number" />
      </el-form-item>
      <el-form-item label="登录类型：" prop="loginType">
        <el-select v-model="ruleForm.loginType" placeholder="请选择">
          <el-option label="login认证" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<script>

export default {
  data() {
    return {
      ruleForm: {
        smtpId: '',
        smtpEmail: '',
        smtpServer: '',
        smtpUsername: '',
        smtpPassword: '',
        number: '',
        loginType: ''
      },
      rules: {
        smtpServer: [
          { required: true, message: '请输入服务器', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        smtpUsername: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        smtpPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        smtpEmail: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        loginType: [
          { required: true, message: '请选择登录类型', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请填写次数', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$http.post(this.$url + 'admin/initSmtp',).then((res) => {
          this.ruleForm = res.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          this.$http.post(this.$url + 'admin/updateSmtp',this.ruleForm).then((res) => {
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
    }
  }
}
</script>
