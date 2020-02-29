
<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="width: 1200px;margin-top: 30px">

    <el-row>
      <el-col :span="12">
        <el-form-item label="一级分类" prop="regulationsTypeId">
          <el-select v-model="ruleForm.regulationsTypeId" placeholder="请选择" @change="isShow">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.regulationsTypeName"
              :value="item.regulationsTypeId"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item v-if="ifshow" label="二级分类" prop="cid">
          <el-select v-model="ruleForm.cid" placeholder="请选择">
            <el-option
              v-for="item in twoOptions"
              :key="item.value"
              :label="item.cname"
              :value="item.cid"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

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
        <el-radio label="1">是</el-radio>
        <el-radio label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="法规图标">
      <el-upload
        action=""
        list-type="picture-card"
        :auto-upload="false"
        :limit="1"
        :on-change="handleChange"
        :before-upload="beforeAvatarUpload"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        < img width="100%" :src="ruleForm.regulationsIconPath" alt="">
      </el-dialog>
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
        <div slot="tip" class="el-upload__tip">只能上传pdf文件,最大支持120MB</div>
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
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
      <el-button @click="getBack()">返回</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import TinymceEditor from './TinymceEditor'
export default {
  components: {
    TinymceEditor
  },
  data() {
    return {
      // dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      ifshow: false,
      options: [],
      twoOptions: [],
      isAdd: true,
      ruleForm: {
        cid: '',
        regulationsTypeId: '',
        regulationsIconPath: '',
        regulationsPartNo: '',
        regulationsPartNoAlias: '',
        regulationsVersion: '',
        regulationsName: '',
        regulationsShowStatus: '',
        regulationsPdfName: '',
        // 上传成功后的回调地址
        regulationsPdfPath: '',
        // 法规版本说明
        regulationsVersionExplain: '',
        // 上传成功后的回调的key
        key: ''
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
        ],
        regulationsTypeId: [
          { required: true, message: '请选择一级分类', trigger: 'change' }
        ],
        cid: [
          { required: true, message: '请选择二级分类', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    //初始化一级分类下拉
    this.showOneType()
    // this.setContent()
    // this.$refs.editor.setContent("22222")
  },
  methods: {
    //显示一级下拉
    showOneType() {
      this.$http.get(this.$url + 'regulationsTrype/showAllOneType').then((res) => {
        if (res.data.code == '2001') {
          this.options = res.data.data
        } else {
          this.options = []
        }
      })
    },
    //显示二级分类下拉
    isShow() {
      this.ruleForm.cid=''
      this.twoOptions = []
      this.ifshow = true
      this.$http.get(this.$url + 'cassify/classifyList', {
        params: { 'regulationsTypeId': this.ruleForm.regulationsTypeId }
      }).then((res) => {
        if (res.data.code == '2001') {
          this.twoOptions = res.data.data
        } else {
          this.twoOptions = []
        }
      })
    },
    //移除图片清空图片的base64
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.ruleForm.regulationsIconPath = ''
    },
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
      this.$refs.upload.submit()
    },
    //删除pdf文件
    handleRemovePDF(file, fileList) {
      this.isAdd = true
      console.log(file, fileList)
      if (this.ruleForm.regulationsPdfPath != '' && this.ruleForm.key != '') {
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
          } else if (res.data.code == '2004') {
            this.$message.error('文件删除失败')
          }
        })
      }
    },
    handlePreviewPDF(file) {
      console.log(file)
    },
    //上传pdf文件之前的判读
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
    //pdf上传成功的回调函数
    uploadSuccess(response, file, fileList) {
      this.isAdd = true
      if (response.code == '2001') {
        this.ruleForm.regulationsPdfPath = response.url
        this.ruleForm.key = response.key
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
    //表单的提交
    submitForm(formName) {
      if (this.isAdd) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var _this = this
            console.log(JSON.stringify(_this.ruleForm))
            this.$http.post(this.$url + 'regulations/addRegulations', _this.ruleForm).then((res) => {
              if (res.data.code == '2001') {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.resetForm(formName)
                this.ruleForm.regulationsPdfPath = ''
                this.ruleForm.key = ''
              } else {
                this.$message.error('添加失败')
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
    //清空表单以及富文本编译器内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.editor.clear()
      this.ifshow = false
    },
    //文本编译器点击事件
    onClick(e, editor) {
      console.log('Element clicked')
      console.log(e)
      console.log(editor)
    },
    //获取文本编译器的HTML内容
    getContent() {
      alert(this.$refs.editor.getContent())
    },
    //设置文本编译器的HTML内容
    setContent(msg) {
      this.$refs.editor.setContent(msg)
    },
    getBack(){
      this.$router.push({
        name:'RegulationsList'
      })
    }

  }
}
</script>
