<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top: 30px">
      <el-form-item label="网站状态 ：" prop="webStatus">
        <el-radio-group v-model="ruleForm.webStatus">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="网站标题：" prop="webTitle">
        <el-input v-model="ruleForm.webTitle" />
      </el-form-item>

      <el-form-item label="网站域名：" prop="webDomainName">
        <el-input v-model="ruleForm.webDomainName" />
      </el-form-item>

      <el-form-item label="网站logo">
        <el-upload
          class="avatar-uploader"
          action=""
          :auto-upload="false"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="ruleForm.webLogoPath" :src="ruleForm.webLogoPath" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item label="公司邮箱：" prop="webEmail">
        <el-input v-model="ruleForm.webEmail" />
      </el-form-item>

      <el-form-item label="站点语言：" prop="language">
        <el-select v-model="ruleForm.language" placeholder="请选择" style="width:300px">
          <el-option label="简体中文" :value="1" />
          <el-option label="繁體中文" :value="2" />
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
        webId:'',
        webStatus: '',
        webTitle: '',
        webDomainName: '',
        webEmail: '',
        language: '',
        webLogoPath: ''
      },
      rules: {
        webTitle: [
          { required: true, message: '请输入网站标题', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        language: [
          { required: true, message: '请选择语音', trigger: 'change' }
        ],
        webDomainName: [
          { required: true, message: '请输入域名', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        webEmail: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        webStatus: [
          { required: true, message: '请选择网站动态', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 移除图片清空图片的base64
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.ruleForm.webLogoPath = ''
    },
    // 触发事件
    handleChange(file, fileList) {
      this.getBase64(file.raw).then(res => {
        this.ruleForm.webLogoPath = res
      })
    },

    init() {
      this.$http.post(this.$url + 'admin/initWeb',).then((res) => {
        if (res.data.code == '2001') {
          this.ruleForm = res.data.data
        } else {
          this.ruleForm = []
        }
      })
    },
    // 图片转换base64
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    },
    // 上传法规图标的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(JSON.stringify(this.ruleForm))
          this.$http.post(this.$url + 'admin/updateWeb',this.ruleForm).then((res) => {
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
      this.ruleForm.webLogoPath=''
    }
  }
}
</script>
