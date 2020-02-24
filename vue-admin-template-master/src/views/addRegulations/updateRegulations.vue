
<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top: 30px">

    <el-form-item label="法规部号" prop="regulationsPartNo">
      <el-input v-model.number="ruleForm.regulationsPartNo" type="number" />
    </el-form-item>
    <el-form-item label="部号别名" prop="regulationsPartNoAlias">
      <el-input v-model="ruleForm.regulationsPartNoAlias" />
    </el-form-item>
    <el-form-item label="版本号" prop="regulationsVersion">
      <el-input v-model="ruleForm.regulationsVersion" />
    </el-form-item>
    <el-form-item label="法规名称" prop="regulationsName">
      <el-input v-model="ruleForm.regulationsName" />
    </el-form-item>

    <el-form-item label="是否显示" prop="regulationsShowStatus">
      <el-radio-group v-model="ruleForm.regulationsShowStatus">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="法规图标">
      <el-upload
        class="avatar-uploader"
        action=""
        :auto-upload="false"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="ruleForm.regulationsIconPath" :src="ruleForm.regulationsIconPath" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
    </el-form-item>

    <el-form-item label="PDF名称" prop="regulationsPdfName">
      <el-input v-model="ruleForm.regulationsPdfName" />
    </el-form-item>

    <el-form-item label="PDF文件上传">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="http://localhost:8080/regulations/doUpload"
        :on-preview="handlePreviewPDF"
        :on-remove="handleRemovePDF"
        :on-success="uploadSuccess"
        :before-upload="beforeAvatarUploadPDF"
        :auto-upload="false"
        :limit="1"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">注意!重新上传pdf会覆盖原文件</div>
      </el-upload>
    </el-form-item>

    <el-form-item label="*法规版本说明" prop="regulationsVersionExplain">
      <tinymce-editor
        ref="editor"
        v-model="ruleForm.regulationsVersionExplain"
        :disabled="disabled"
        @onClick="onClick"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
      <el-button @click="getBack()">返回</el-button>
    </el-form-item>
  </el-form>
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
import TinymceEditor from './TinymceEditor'
export default {
  components: {
    TinymceEditor
  },
  data() {
    return {
      dialogVisible: false,
      disabled: false,
      isAdd: true,
      // 新文件的地址
      regulationsPdfPathX: '',
      // 新文件的key
      keyX: '',
      ruleForm: {
        regulationsIconPath: '',
        regulationsPartNo: '',
        regulationsPartNoAlias: '',
        regulationsVersion: '',
        regulationsName: '',
        regulationsShowStatus: '',
        regulationsPdfName: '',
        // 原文件地址
        regulationsPdfPath: '',
        // 法规版本说明
        regulationsVersionExplain: '',
        // 原文件的key
        key: '',
        // cid: '',
        // regulationsTypeId: ''
      },
      rules: {
        regulationsPartNo: [
          { required: true, message: '请输入法规部号', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        regulationsPartNoAlias: [
          { required: true, message: '请输入法规部号别名', trigger: 'blur' }
        ],
        regulationsVersion: [
          { required: true, message: '请输入法规版本号', trigger: 'blur' }
        ],
        regulationsName: [
          { required: true, message: '请输入法规名称', trigger: 'blur' }
        ],

        regulationsShowStatus: [
          { required: true, message: '是否前台显示', trigger: 'change' }
        ],
        regulationsPdfName: [
          { required: true, message: '请输入法规PDF名称', trigger: 'blur' }
        ],
        msg: [
          {
            required: true,
            message: '请输入信息'
          }
        ]
      }
    }
  },
  created() {
    this.get()
  },
  methods: {

    // 移除图片清空图片的base64
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.ruleForm.regulationsIconPath = ''
    },
    // 触发事件
    handleChange(file, fileList) {
      this.getBase64(file.raw).then(res => {
        this.ruleForm.regulationsIconPath = res
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
    // pdf文件上传的方法
    submitUpload() {
      if (this.ruleForm.regulationsPdfPath != '' && this.ruleForm.key != '') {
        this.$confirm('此操作将覆盖原文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs.upload.submit()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$refs.upload.submit()
      }
    },
    // 删除pdf文件
    handleRemovePDF(file, fileList) {
      this.isAdd = true
      console.log(file, fileList)

      if (this.regulationsPdfPathX != '' && this.keyX != '') {
        this.$http.get(this.$url + 'regulations/delFile', {
          params: { 'key': this.ruleForm.key }
        }).then((res) => {
          if (res.data.code == '2001') {
            this.$message({
              message: '文件删除成功',
              type: 'success'
            })
            this.ruleForm.regulationsPdfPath = ''
            this.ruleForm.key = ''
            this.regulationsPdfPathX = ''
            this.keyX = ''
          } else if (res.data.code == '2004') {
            this.$message.error('文件删除失败')
          }
        })
      }
    },
    handlePreviewPDF(file) {
      console.log(file)
    },
    // 上传pdf文件之前的判读
    beforeAvatarUploadPDF(file) {
      var fileName = file.name
      var pos = fileName.lastIndexOf('.')
      var lastName = fileName.substring(pos, fileName.length)
      if (lastName.toLowerCase() !== '.pdf') {
        this.$message.error('请上传.pdf文件')
        return false
      } else {
        this.isAdd = false
      }
    },
    // pdf上传成功的回调函数
    uploadSuccess(response, file, fileList) {
      this.isAdd = true
      if (response.code == '2001') {
        this.ruleForm.regulationsPdfPath = response.url
        this.ruleForm.key = response.key
        this.regulationsPdfPathX = response.url
        this.keyX = response.key
        this.$message({
          message: '文件上传成功',
          type: 'success'
        })
        console.log('key' + this.ruleForm.key)
        console.log('path' + this.ruleForm.regulationsPdfPath)
      } else {
        this.$message.error('文件上传失败')
      }
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
    // 表单的提交
    submitForm(formName) {
      if (this.isAdd) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var _this = this
            // console.log(JSON.stringify(_this.ruleForm))
            this.$http.post(this.$url + 'regulations/updateRegulations', _this.ruleForm).then((res) => {
              if (res.data.code == '2001') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.ruleForm.regulationsPdfPath = ''
                this.ruleForm.key = ''
                this.regulationsPdfPathX = ''
                this.keyX = ''
                this.get()
              } else {
                this.$message.error('修改失败')
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$message.error('文件正在上传请稍后。。。')
      }
    },
    // 清空表单以及富文本编译器内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.editor.clear()
    },
    // 文本编译器点击事件
    onClick(e, editor) {
      console.log('Element clicked')
      console.log(e)
      console.log(editor)
    },
    // 获取文本编译器的HTML内容
    getContent() {
      alert(this.$refs.editor.getContent())
    },
    // 设置文本编译器的HTML内容
    setContent(msg) {
      this.$refs.editor.setContent(msg)
    },

    get() {
      var _this = this
      var regulationsId = _this.$route.query.regulationsId
      var params = new URLSearchParams()
      params.append('regulationsId', regulationsId)
      _this.$http.post(this.$url + 'regulations/selectRegulationsByRegulationsId', params).then((res2) => {
        if (res2.data.code == '2001') {
          _this.ruleForm = res2.data.data
        }
      })
    },
    getBack() {
      this.$router.push({
        name: 'RegulationsList'
      })
    }

  }
}
</script>
