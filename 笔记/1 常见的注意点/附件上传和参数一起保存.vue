<template>
  <div class="document-container">
    <div class="content">
      <div class="search-content">
        <el-form :model="docData.body" :inline="true">
          <el-form-item label="文件名：">
            <el-input
              v-model.trim="docData.body.fileName"
              placeholder="请输入"
              @keyup.enter.native="getDocSearch">
            </el-input>
          </el-form-item>
          <el-form-item label="项目名：">
            <el-input
              v-model.trim="docData.body.project"
              placeholder="请输入"
              @keyup.enter.native="getDocSearch">
            </el-input>
          </el-form-item>
          <el-form-item label="起止时间：">
            <el-date-picker
              class="date-picker"
              v-model="docData.body.timeRange"
              type="datetimerange"
              range-separator="～"
              value-format="timestamp"
              size="large"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['12:00:00']">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="search-btn">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getDocSearch">查 询</el-button>
            <el-button
              class="normal-btn"
              icon="el-icon-refresh-left"
              @click="docSearchReset">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-warpper">
        <div class="main-header">
          <el-button
            class="normal-btn"
            @click="uploadDoc"
            icon="el-icon-upload">上传文件</el-button>
        </div>
        <self-table
          :table-data="docData.docList"
          :table-cols="tableCols"
          :border="isBorder"
          :is-pagination="true"
          :pagination="{ pageSize: docData.body.pageSize, pageNum: docData.body.pageNum, total: docData.pagetotal }"
          @refresh="getDocList"
        ></self-table>
        <!--:height="'calc(100vh - 410px)'"-->
        <!--:max-height="'calc(100vh - 410px)'"-->
        <!--:loading="loading"-->
      </div>
    </div>

    <div class="uploadForm">
      <el-dialog
        title="上传文件"
        :visible.sync="uploadDialogVisible"
        :before-close="beforeCloseAddDig"
        :close-on-click-modal="false"
        v-dialogDrag>
        <el-form
          :model="uploadForm"
          ref="uploadForm"
          :rules="uploadFormRules"
          hide-required-asterisk
          :validate-on-rule-change="false"
          :inline="true">
          <el-upload
            class="upload-demo"
            ref="upload"
            drag
            :action="uploadUrl"
            :headers="uploadHeaders"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.bmp,.tga,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rp,.html,.htm,.mht,.zip,.tz,.rar,.PDF,.JPG,.JPEG,.PNG,.BMP,.TGA,.DOC,.DOCX,.XLS,.XLSX,.PPT,.PPTX,.TXT,.RP,.HTML,.HTM,.MHT,.ZIP,.TZ,.RAR"
            :on-preview="handlePreview"
            :limit="15"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-success="submitUploadFile"
            :data="uploadData"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="changeFileList">
            <i class="el-icon-upload"></i>
            <div>
              <div class="el-upload__text">点击或将文件拖到这里上传</div>
              <div class="el-upload__tip" style="width: 250px; overflow: hidden; white-space: nowrap; text-overflow:ellipsis;" title="支持扩展名：.pdf .jpg .jpeg .png .bmp .tga .doc .docx .xls .xlsx .ppt .pptx .txt .rp .html .htm .mht .zip .tz .rar">支持扩展名：.rar .zip .docx .pdf .jpg ... </div>
              <div class="el-upload__tip" slot="tip">单个文件大小不超过100M</div>
            </div>
          </el-upload>
          <div class="clearboth"></div>
          <el-form-item label="添加水印：" prop="waterMarkFlag">
            <el-radio-group v-model="uploadForm.waterMarkFlag" @change="showWaterMarkCode">
              <el-radio
                v-for="item in waterMarkOptions"
                :key="item.status"
                :label="item.label"
                value="label">
                {{item.value}}
              </el-radio>
            </el-radio-group>
            <div v-if="disabledAddPrint && notAddPrintFiles.length!==fileList.length && uploadForm.waterMarkFlag==='0'" class="tips" style="color: red;">
              <span v-for="(name,index) in notAddPrintFilesSuffix" :key="index"><span v-if="notAddPrintFilesSuffix.length>1 && index>0">、</span>{{name}}</span>
              文件不支持添加水印，如需继续添加水印，请先删除
            </div>
            <div v-if="disabledAddPrint && notAddPrintFiles.length===fileList.length && uploadForm.waterMarkFlag==='0'" class="tips" style="color: red;">
              <span v-for="(name,index) in notAddPrintFilesSuffix" :key="index"><span v-if="notAddPrintFilesSuffix.length>1 && index>0">、</span>{{name}}</span>
              文件不支持添加水印</div>
          </el-form-item>
          <div class="clearboth"></div>
          <el-form-item v-if="uploadForm.waterMarkFlag==='0'&&!disabledAddPrint" label="水印选择：" prop="waterMarkCode">
            <el-select v-model="uploadForm.waterMarkCode" placeholder="请选择">
              <el-option
                v-for="item in waterMarkCodeOptions"
                :key="item.waterMarkCode"
                :label="item.waterMarkName"
                :value="item.waterMarkCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeUploadForm">取消</el-button>
          <el-button type="primary" @click="submitAddDoc">确认</el-button>
        </div>
      </el-dialog>
    </div>

    <el-dialog
      :title="docDialogType === 'edit' ? '文件修改' : '文件详情'"
      :before-close="beforeCloseEditDig"
      :visible.sync="docDialogVisible"
      custom-class="detailForm"
      :close-on-click-modal="false"
      v-dialogDrag>
      <el-form
        :model="docDetailForm"
        ref="docDetailForm"
        :inline="true"
        class="doc-detail-form"
        hide-required-asterisk
        :rules="docDialogType === 'edit' ? editFormRules : detailFormRules"
        label-position="right"
        label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="ID：" prop="id">
              <el-tooltip
                :content="docDetailForm.id"
                effect="dark"
                :disabled="showTooltip(docDetailForm.id, 220, true, 'id')"
                placement="top">
                <el-input
                  v-model="docDetailForm.id"
                  autocomplete="off"
                  disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件编码：" prop="fileCode">
              <el-tooltip
                :content="docDetailForm.fileCode"
                effect="dark"
                :disabled="showTooltip(docDetailForm.fileCode, 220, true, 'fileCode')"
                placement="top">
                <el-input
                  v-model="docDetailForm.fileCode"
                  autocomplete="off"
                  disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="hash值：" prop="fileHash">
              <el-tooltip
                :content="docDetailForm.fileHash"
                effect="dark"
                :disabled="showTooltip(docDetailForm.fileHash, 220, true, 'fileHash')"
                placement="top">
                <el-input
                  v-model="docDetailForm.fileHash"
                  autocomplete="off"
                  disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件大小：" prop="fileSize">
              <el-tooltip
                :content="docDetailForm.fileSize"
                effect="dark"
                :disabled="showTooltip(docDetailForm.fileSize, 220, true, 'fileSize')"
                placement="top">
                <el-input
                  v-model="docDetailForm.fileSize"
                  autocomplete="off"
                  disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="文件名：" prop="fileName">
              <el-tooltip
                :content="docDetailForm.fileName"
                effect="dark"
                :disabled="showTooltip(docDetailForm.fileName, 550, docDialogType !== 'edit', 'fileName')"
                placement="top">
                <el-input
                  v-model="docDetailForm.fileName"
                  autocomplete="off"
                  :disabled="docDialogType !== 'edit'"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="文件地址：" prop="filePath">
              <el-tooltip
                :content="docDetailForm.filePath"
                effect="dark"
                :disabled="showTooltip(docDetailForm.filePath, 550, true, 'filePath')"
                placement="top">
                <el-input
                  v-model="docDetailForm.filePath"
                  autocomplete="off"
                  disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否有水印：" prop="waterMarkFlag">
              <el-radio-group
                v-model="docDetailForm.waterMarkFlag"
                autocomplete="off"
                :disabled="docDialogType !== 'edit' || (docDialogType === 'edit' && disabledEditPrint)"
                @change="showWaterMarkName">
                <el-radio
                  v-for="item in waterMarkOptions"
                  :key="item.status"
                  :label="item.label"
                  value="label">
                  {{item.value}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div v-show="disabledEditPrint" class="tips">此文件不能添加水印</div>
            <el-form-item v-if="docDetailForm.waterMarkFlag === '0'" label="水印名称：" prop="waterMarkCode">
              <el-tooltip
                :disabled="choosedWaterMarkName && choosedWaterMarkName.length<14"
                class="item"
                effect="dark"
                :content="choosedWaterMarkName"
                :offset="-80"
                placement="top">
                <el-select
                  v-model="docDetailForm.waterMarkCode"
                  autocomplete="off"
                  :disabled="docDialogType !== 'edit'"
                  placeholder="请选择"
                  @change="validWaterMakCode">
                  <el-option
                    v-for="item in waterMarkCodeOptions"
                    :key="item.waterMarkCode"
                    :label="item.waterMarkName"
                    :value="item.waterMarkCode">
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名：" prop="project">
              <el-tooltip
                :content="docDetailForm.project"
                effect="dark"
                :disabled="showTooltip(docDetailForm.project, 220, true, 'project')"
                placement="top">
                <el-input
                  v-model="docDetailForm.project"
                  autocomplete="off"
                  disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传时间：" prop="createDate">
              <el-input
                v-model="docDetailForm.createDate"
                autocomplete="off"
                disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上传人：" prop="creatorName">
              <el-input
                v-model="docDetailForm.creatorName"
                autocomplete="off"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修改时间：" prop="modifyDate">
              <el-input
                v-model="docDetailForm.modifyDate"
                autocomplete="off"
                disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="修改人：" prop="modifierName">
              <el-input
                v-model="docDetailForm.modifierName"
                autocomplete="off"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!--        <el-form-item label="模块名：" prop="module">-->
            <!--          <el-input-->
            <!--            type="textarea"-->
            <!--            :autosize="{ minRows: 1, maxRows: 2}"-->
            <!--            v-model="docDetailForm.module"-->
            <!--            autocomplete="off"-->
            <!--            disabled></el-input>-->
            <!--        </el-form-item>-->
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="docDialogType !== 'edit'" @click="closeEditForm">关闭</el-button>
        <el-button v-if="docDialogType === 'edit'" @click="closeEditForm">取消</el-button>
        <el-button v-if="docDialogType === 'edit'" type="primary" @click="updateFile">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import selfTable from '@/components/table'
import API from '@/serve/API_document'
import dayjs from 'dayjs'
import { getStore } from '@/store'
export default {
  name: 'documentList',
  components: { selfTable },
  data () {
    return {
      uploadHeaders: { Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization },
      baseUrl: getStore().getters['CONFIG/baseUrl'],
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      uploadUrl: this.baseUrl + '/rms/file/file/v1/4/uploadFile',
      downloadUrl: this.baseUrl + '/rms/file/file/v1/5/downloadFile/',
      loading: false,
      isBorder: false,
      tableCols: [
        {
          label: '文件名',
          prop: 'fileName',
          align: 'left',
          minwidth: '200',
          padding: true,
          overflow: true,
          resizable: false
        },
        {
          label: '项目名',
          prop: 'project',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '是否有水印',
          prop: 'waterMarkFlag',
          align: 'center',
          width: '200',
          overflow: true,
          resizable: false
        },
        {
          label: '文件大小',
          prop: 'fileSize',
          align: 'left',
          width: '160',
          overflow: true,
          resizable: false
        },
        {
          label: '创建人',
          prop: 'creatorName',
          align: 'left',
          width: '100',
          overflow: true,
          resizable: false
        },
        {
          label: '创建时间',
          prop: 'createDate',
          align: 'left',
          width: '160',
          overflow: true,
          resizable: false,
          formatter: this.formatDate
        },
        {
          label: '操作',
          prop: 'operation',
          type: 'Button',
          align: 'center',
          width: '260',
          btnList: [
            { id: 1, type: 'text', label: '详情', handle: this.detailItem },
            { id: 2, type: 'text', label: '修改', handle: this.editItem },
            { id: 3, type: 'text', label: '删除', handle: this.delItem },
            { id: 4, type: 'text', label: '下载', handle: this.download },
            { id: 5, type: 'text', label: '预览', handle: this.preview }
          ]
        }
      ],
      docData: {
        docList: [], // table列表渲染数据
        pagetotal: null, // 分页总数
        body: { // table数据请求参数
          'pageNum': 1, // 当前页
          'pageSize': 10, // 每页数量
          'fileName': null, // 文件名
          'project': null, // 项目名
          'waterMarkFlag': null, //是否有水印
          'fileSize': null, //文件大小
          'creatorName': null, //创建人
          'createDate': null, // 创建时间
          'timeRange': null, //起止时间
          'startDate': null, // 开始日期
          'endDate': null // 结束日期
        },
        editForm: {}
      },
      waterMarkOptions: [
        {
          status: '0',
          label: '0',
          value: '是'
        },
        {
          status: '1',
          label: '1',
          value: '否'
        }
      ],
      choosedWaterMarkName: '',
      showWaterMarkCodeOptions: false,
      waterMarkCodeOptions: [],
      uploadDialogVisible: false,
      uploadForm: {
        waterMarkFlag: '1',
        waterMarkCode: ''
      },
      uploadFormRules: {
        waterMarkFlag: [
          { required: true, message: '请选择是否添加水印！', trigger: 'change' }
        ]
      },
      docDialogVisible: false,
      docDialogType: '', // edit detail
      docDetailForm: {
        id: null,
        fileCode: null,
        fileName: null,
        fileSize: null,
        fileHash: null,
        filePath: null,
        waterMarkFlag: null,
        waterMarkCode: null,
        project: null,
        module: null,
        creatorName: null,
        createDate: null,
        modifierName: null,
        modifyDate: null
      },
      editFormRules: {
        fileName: [
          { required: true, message: '请输入文件名！', trigger: 'blur' },
          { max: 200, message: '文件名长度不可超过200！', trigger: ['change', 'blur'] }
        ],
        waterMarkFlag: [
          { required: true, message: '请选择是否添加水印！', trigger: 'change' }
        ]
      },
      detailFormRules: {},
      fileList: [],
      acceptSuffix: ['pdf', 'jpg', 'jpeg', 'png', 'bmp', 'tga', 'doc', 'docx',
        'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rp', 'html', 'htm', 'mht', 'zip', 'tz', 'rar',
        'PDF', 'JPG', 'JPEG', 'PNG', 'BMP', 'TGA', 'DOC', 'DOCX', 'XLS', 'XLSX',
        'PPT', 'PPTX', 'TXT', 'RP', 'HTML', 'HTM', 'MHT', 'ZIP', 'TZ', 'RAR'], //可上传的文件类型
      notAddPrintSuffix: ['jpeg', 'png', 'bmp', 'tga', 'doc',
        'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rp', 'html', 'htm', 'mht', 'zip', 'tz', 'rar',
        'JPEG', 'PNG', 'BMP', 'TGA', 'DOC', 'XLS', 'XLSX', 'PPT', 'PPTX', 'TXT',
        'RP', 'HTML', 'HTM', 'MHT', 'ZIP', 'TZ', 'RAR'], // 不可添加水印的类型
      notAddPrintFiles: [], //无法添加水印的文件列表
      disabledAddPrint: false, //添加水印按钮是否不可用
      disabledEditPrint: false, //修改水印页面，是否有水印项不可用
      notAddPrintFilesSuffix: [] //无法添加水印的文件后缀，已去重
    }
  },
  computed: {
    // 这里定义上传文件时携带的参数，即表单数据
    uploadData: function () {
      // console.log('打印表单数据', this.uploadForm)
      return {
        body: JSON.stringify(this.uploadForm)
      }
    }
  },
  mounted () {
    this.getDocList()
    this.getWaterMarkCodeOptions()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      // return val
      if (!val) {
        return ''
      } else {
        return dayjs(val)
          .format('YYYY-MM-DD HH:mm:ss')
      }
    },
    // 获取文件列表
    getDocList (pageNum = this.dataChange(this.docData.body.pageNum), pageSize = this.dataChange(this.docData.body.pageSize)) {
      this.loading = true
      let params = {
        fileName: this.docData.body.fileName,
        project: this.docData.body.project,
        waterMarkName: this.docData.body.waterMarkName,
        startDate: this.docData.body.timeRange ? this.formatDate(this.docData.body.timeRange[0]) : '',
        endDate: this.docData.body.timeRange ? this.formatDate(this.docData.body.timeRange[1]) : '',
        pageNum: pageNum,
        pageSize: pageSize
      }
      this.docData.body.pageNum = pageNum
      this.docData.body.pageSize = pageSize
      // console.log('打印时间', params)
      API.getDocList(params)
        .then(res => {
          this.loading = false
          this.docData.pagetotal = parseInt(res.total)
          res.records.forEach(element => {
            switch (element.waterMarkFlag) {
              case '0':
                element.waterMarkFlag = '是'
                break
              case '1':
                element.waterMarkFlag = '否'
                break
            }
          })
          this.docData.docList = res.records
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          // if (e.message) {
          //   this.$message.error('获取文件失败')
          // }
          this.$message({
            message: e.message || '服务器异常,请稍后再试!',
            type: 'error',
            showClose: true
          })
        })
    },
    //查询
    getDocSearch () {
      this.docData.body.pageNum = 1
      this.docData.body.pageSize = this.dataChange(this.docData.body.pageSize)
      this.docData.body.fileName = this.dataChange(this.docData.body.fileName)
      this.docData.body.project = this.dataChange(this.docData.body.project)
      this.docData.body.startDate = this.docData.body.timeRange ? this.formatDate(this.docData.body.timeRange[0]) : ''
      this.docData.body.endDate = this.docData.body.timeRange ? this.formatDate(this.docData.body.timeRange[1]) : ''
      this.getDocList()
    },
    //重置查询
    docSearchReset () {
      const resetDocSearch = {
        'pageNum': 1, // 当前页
        'pageSize': 10, // 每页数量
        'fileName': null, // 文件名
        'project': null, // 项目名
        'createDate': null, // 起止时间
        'startDate': null, //开始时间
        'endDate': null //结束时间
      }
      this.docData.body = resetDocSearch
      this.getDocList()
    },
    handlePreview (file) {
      // console.log(file)
    },
    beforeUpload (file) {
      this.uploadData = this.uploadForm
      let promise = new Promise((resolve) => {
        this.$nextTick(function () {
          resolve(true)
        })
      })
      return promise //通过返回一个promis对象解决
    },
    handleExceed (files, fileList) {
      // this.$message.warning(`当前限制选择 15 个文件`)
      this.$message({
        message: '当前限制选择 15 个文件!',
        type: 'warning',
        showClose: true
      })
    },
    handleRemove (file, fileList) {
      // console.log('handleRemove', Object.assign({}, fileList))
      // this.$refs['uploadForm'].resetFields()
      // this.uploadForm.waterMarkCode = ''
      this.checkAddPrint(file, fileList)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, {
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
    },
    // 添加文件、上传成功和上传失败时会被调用
    changeFileList (file, fileList) {
      // 判断文件名长度超长
      let fileName = file.name.split('.')[0]
      // console.log('file.name.length: ', fileName.length)
      /* let temp = 0
      for (var i = 0; i < fileName.length; i++) {
        if (/[\u4e00-\u9fa5]/.test(fileName[i])) {
          temp += 2
        } else {
          temp++
        }
      } */
      if (fileName.length > 200) {
        this.$message({
          message: '文件名长度不可超过200个字符!',
          type: 'warning',
          showClose: true
        })
        fileList.pop()
      }
      // 判断文件是否都是可以上传的文件类型
      if (!this.checkFileType(file, fileList)) { return }
      // 限制上传文件总大小超出100M
      let totalSize = 0
      fileList.forEach(element => {
        totalSize = element.size + totalSize
        let isTotalExceed = totalSize / 1024 / 1024 <= 100
        // console.log('total Size: ', totalSize)
        if (!isTotalExceed) {
          this.$message({
            message: '文件总大小不超过100M!',
            type: 'warning',
            showClose: true
          })
          fileList.pop()
        }
      })
      // 限制上传文件单个大小超出100M的文件
      let isSizeExceed = file.size / 1024 / 1024 <= 100
      if (!isSizeExceed) {
        this.$message({
          message: '单个文件大小不超过100M!',
          type: 'warning',
          showClose: true
        })
        // 超过100M则移除该文件
        let newfileList = []
        fileList.forEach(element => {
          if (element.uid !== file.uid) {
            newfileList.push(element)
          }
        })
        this.fileList = newfileList
      } else {
        this.fileList = fileList
      }
      // 判断当前文件列表是否可以添加水印
      this.checkAddPrint(file, fileList)
    },
    // 判断文件是否都是可以上传的文件类型
    checkFileType (file, fileList) {
      let notAccept = []
      fileList.forEach(file => {
        // console.log('file', file)
        let nameArr = file.name.split('.')
        let suffix = nameArr[nameArr.length - 1] // 当前文件后缀名
        let accept = this.acceptSuffix.some(item => { // 是否为可上传文件类型
          return suffix === item
        })
        if (!accept) { //无法上传的文件类型
          notAccept.push(suffix)
          fileList.pop()
        }
      })
      // console.log('notAccept:', notAccept)
      if (notAccept.length > 0) {
        let set = new Set(notAccept)
        let newAccept = [...set] //去除重复的后缀类型
        let tip = ''
        newAccept.forEach(e => {
          tip = !tip ? e : (tip + '、' + e)
        })
        this.$message({
          message: '无法上传扩展名为' + tip + '的文件!',
          type: 'warning',
          showClose: true
        })
        return false
      } else {
        return true
      }
    },
    // 判断当前文件列表是否可以添加水印
    checkAddPrint (file, fileList) {
      this.notAddPrintFiles = []
      this.notAddPrintFilesSuffix = []
      fileList.forEach(file => {
        let nameArr = file.name.split('.')
        let suffix = nameArr[nameArr.length - 1] // 当前文件后缀名
        let notAdd = this.notAddPrintSuffix.some(item => { // 是否为不可添加水印的文件
          return suffix === item
        })
        if (notAdd) { //无法添加水印的文件
          this.notAddPrintFiles.push(file.name)
          this.notAddPrintFilesSuffix.push('.' + suffix)
          let set = new Set(this.notAddPrintFilesSuffix)
          this.notAddPrintFilesSuffix = [...set] //去除重复的后缀类型
        }
      })
      this.fileList = fileList
      if (this.notAddPrintFiles.length > 0) {
        this.disabledAddPrint = true
        // this.uploadForm.waterMarkFlag = '1'
        this.showWaterMarkCode('1', false) //0227-此时不显示水印名称选择，但保留其选择的数据，不清空
      } else {
        this.showWaterMarkCode('0', false) //0227-更新一下验证规则
        // this.$nextTick(() => {
        //   this.$refs.uploadForm.validate(valid => {}) //0227-主动执行一次验证，为了保证与上面的if情况样式一致
        // })
        this.disabledAddPrint = false
      }
    },
    // 上传文件
    uploadDoc () {
      this.uploadDialogVisible = true
    },
    beforeCloseAddDig (done) {
      this.closeUploadForm()
    },
    closeUploadForm () {
      this.$refs['uploadForm'].resetFields()
      this.uploadForm.waterMarkCode = ''
      this.fileList = []
      this.showWaterMarkCodeOptions = false
      this.uploadDialogVisible = false
      this.disabledAddPrint = false
    },
    beforeCloseEditDig (done) {
      this.closeEditForm()
    },
    closeEditForm () {
      this.$refs['docDetailForm'].resetFields()
      this.docDialogVisible = false
      this.disabledEditPrint = false
    },
    //新增上传文件
    submitAddDoc () {
      // console.log(11111)
      if (this.fileList.length === 0) {
        // this.$message.warning('请选择文件')
        this.$message({
          message: '请选择文件!',
          type: 'warning',
          showClose: true
        })
      } else {
        this.$refs.uploadForm.validate(valid => {
          if (valid) {
            // if (this.notAddPrintFiles.length > 0 && this.notAddPrintFiles.length !== this.fileList.length) return
            if (this.uploadForm.waterMarkFlag === '0' && this.notAddPrintFiles.length > 0) return
            let params = new FormData()
            this.fileList.forEach(file => {
              params.append('files', file.raw)
            })
            Object.keys(this.uploadForm)
              .forEach(key => {
                params.append(key, this.uploadForm[key])
              })
            API.uploadFiles(params)
              .then(res => {
                this.$message({
                  message: '上传文件成功!',
                  type: 'success',
                  showClose: true
                })
                // this.$refs['uploadForm'].resetFields()
                // this.uploadDialogVisible = false
                // this.fileList = []
                // this.showWaterMarkCodeOptions = false
                // this.disabledAddPrint = false
                this.closeUploadForm() //0227-关闭对话框，需执行的一些清空操作
                // this.getDocList()
                this.docSearchReset() // 上传成功后重置到第一页
              })
              .catch(e => {
                this.$refs['uploadForm'].resetFields()
                this.fileList = []
                this.showWaterMarkCodeOptions = false
                if (e.selfError) return
                // if (e.message) {
                //   this.$message.error('上传文件失败')
                // }
                this.$message({
                  message: e.message || '服务器异常,请稍后再试!',
                  type: 'error',
                  showClose: true
                })
              })
          } else {
            return false
          }
        })
      }
    },
    submitUploadFile (response, file, fileList) {
      if (response.code === 10001) {
        this.$message({
          message: '保存成功！',
          type: 'success',
          showClose: true
        })
        // alert('保存成功！')
        this.waterMarkFlag = ''
        this.waterMarkCode = ''
      } else {
        // alert('保存失败！')
        this.$message({
          message: '保存失败！',
          type: 'error',
          showClose: true
        })
        this.waterMarkFlag = ''
        this.waterMarkCode = ''
      }
    },
    // 使用水印编码映射水印名称
    //查看文件详情
    detailItem (row) {
      // this.loading = true
      this.docDialogType = 'detail'
      // this.docDialogVisible = true
      API.getFileDetail(row.fileCode)
        .then(res => {
          let createTime = new Date(res.createDate)
          let modifyTime = new Date(res.modifyDate)
          res.createDate = this.formatDate(createTime)
          res.modifyDate = this.formatDate(modifyTime)
          // res.waterMarkFlag = res.waterMarkFlag === '0' ? '是' : '否'
          res.waterMarkCode = row.waterMarkCode
          this.waterMarkCodeOptions.map(item => {
            if (item.waterMarkCode === res.waterMarkCode) {
              this.choosedWaterMarkName = item.waterMarkName
            }
          })
          this.docDetailForm = res
          // this.loading = false
          this.docDialogVisible = true
        })
        .catch(e => {
          // this.loading = false
          if (e.selfError) return
          // if (e.message) {
          //   this.$message.error('查看文件详情失败')
          // }
          this.$message({
            message: e.message || '服务器异常,请稍后再试!',
            type: 'error',
            showClose: true
          })
        })
    },
    //编辑文件详情
    editItem (row) {
      this.docDialogType = 'edit'
      // this.docDialogVisible = true
      // this.loading = true
      API.getFileDetail(row.fileCode)
        .then(res => {
          let createTime = new Date(res.createDate)
          let modifyTime = new Date(res.modifyDate)
          res.createDate = this.formatDate(createTime)
          res.modifyDate = this.formatDate(modifyTime)
          res.waterMarkCode = row.waterMarkCode
          this.waterMarkCodeOptions.map(item => {
            if (item.waterMarkCode === res.waterMarkCode) {
              this.choosedWaterMarkName = item.waterMarkName
            }
          })
          // 这里不再截取，后端直接返回不带后缀的文件名
          // let lastPoint = res.fileName.lastIndexOf('.')
          // // console.log('从最后一个点获取的fileName:', res.fileName.substr(0, lastPoint))
          // res.fileName = res.fileName.substr(0, lastPoint)
          this.docDetailForm = res
          // this.loading = false
          this.docDialogVisible = true
          this.checkSingleFileType(res.fileType)
        })
        .catch(e => {
          // this.loading = false
          if (e.selfError) return
          // if (e.message) {
          //   this.$message.error('获取文件信息失败')
          // }
          this.$message({
            message: e.message || '服务器异常,请稍后再试!',
            type: 'error',
            showClose: true
          })
        })
    },
    checkSingleFileType (suffix) {
      let notAdd = this.notAddPrintSuffix.some(item => { // 是否为不可添加水印的文件
        return suffix === item
      })
      if (notAdd) {
        this.docDetailForm.waterMarkFlag = '1'
        this.disabledEditPrint = true
        this.showWaterMarkName('1')
      } else {
        this.disabledEditPrint = false
      }
    },
    //修改文件
    updateFile () {
      // this.loading = true
      let param = {
        fileCode: this.docDetailForm.fileCode,
        fileName: this.docDetailForm.fileName.trim(),
        waterMarkFlag: this.docDetailForm.waterMarkFlag
      }
      if (this.docDetailForm.waterMarkFlag === '0') {
        param.waterMarkCode = this.docDetailForm.waterMarkCode
      }
      this.$refs.docDetailForm.validate(valid => {
        if (valid) {
          if (this.docDetailForm.fileName.trim().length === 0) {
            // this.$message.error('文件名不能为空，请重新输入！')
            this.$message({
              message: '文件名不能为空，请重新输入！',
              type: 'error',
              showClose: true
            })
            // this.loading = false
          } else {
            API.updateFile(param)
              .then(res => {
                this.$message({
                  message: '修改成功!',
                  type: 'success',
                  showClose: true
                })
                // this.loading = false
                this.docDialogVisible = false
                this.getDocList()
              })
              .catch(e => {
                // this.loading = false
                this.docDialogVisible = false
                if (e.selfError) return
                // if (e.message) {
                //   this.$message.error('编辑文件信息失败')
                // }
                this.$message({
                  message: e.message || '服务器异常,请稍后再试!',
                  type: 'error',
                  showClose: true
                })
              })
          }
        }
      })
    },
    //删除文件
    delItem (row) {
      this.$confirm('一旦确定删除，结果将无法撤回，请谨慎考虑。', '确定要删除吗？', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          API.deleteFile(row.fileCode)
            .then(res => {
              this.$message({
                message: '删除成功!',
                type: 'success',
                showClose: true,
                customClass: 'self-message-success',
                dangerouslyUseHTMLString: true
              })
              this.getDocList()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    //下载文件
    download (row) {
      axios.request({
        // url: this.baseUrl + '/rms/file/file/v1/5/file/' + row.fileCode,
        url: this.baseUrl + '/rms/file/file/v1/5/file',
        method: 'get',
        params: {
          nonce: row.nonce,
          timeStamp: row.timeStamp,
          sign: row.sign,
          fileCode: row.fileCode
        },
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        },
        responseType: 'blob'
      })
        .then((res) => {
          let blob = new Blob([res.data])
          let fileName = row.fileName
          // let fileName = decodeURI(res.headers['content-disposition'].split('=')[1])
          // console.log('filename: ', res.headers['content-disposition'].split('=')[1])
          // 非IE下载
          if ('download' in document.createElement('a')) {
            let elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .catch(err => {
          if (err.selfError) { return }
          this.$message.error(err.message || '服务器异常，请稍后再试！')
        })
    },
    //是否显示水印选择下拉框
    //0227-增加参数：是否需要清空水印名称，按钮点击切换时清空，手动调用时不应清空
    showWaterMarkCode (value, resetMarkCode = true) {
      // console.log('11111：', value)
      // this.showWaterMarkCodeOptions = value === '0'
      if (resetMarkCode) { //0227
        this.uploadForm.waterMarkCode = ''
      }
      if (value === '0') {
        this.uploadFormRules = {
          waterMarkFlag: [
            { required: true, message: '请选择是否添加水印', trigger: 'change' }
          ],
          waterMarkCode: [
            { type: 'string', required: true, message: '请选择水印', trigger: ['change', 'blur'] }
          ]
        }
      } else {
        // this.$refs.uploadForm.clearValidate()
        this.uploadFormRules = {
          waterMarkFlag: [
            { required: true, message: '请选择是否添加水印', trigger: 'change' }
          ]
        }
      }
    },
    // 编辑表单中水印名称是否验证
    showWaterMarkName (value) {
      if (value === '0') {
        // this.$refs.docDetailForm.clearValidate('waterMarkCode')
        this.editFormRules.waterMarkCode = [
          { type: 'string', required: true, message: '请选择水印！', trigger: 'blur' }
        ]
      } else {
        // this.$refs.docDetailForm.clearValidate('waterMarkCode')
        this.editFormRules.waterMarkCode = null
      }
    },
    validWaterMakCode (itemCode) {
      this.$refs.docDetailForm.validate(valid => {
        // console.log('valid', itemCode, valid)
        this.waterMarkCodeOptions.map(item => {
          if (item.waterMarkCode === itemCode) {
            this.choosedWaterMarkName = item.waterMarkName
          }
        })
      })
    },
    //获取水印选项
    getWaterMarkCodeOptions () {
      API.getWaterMarksByCompanyCode()
        .then(res => {
          // console.log('水印选项: ', res)
          this.waterMarkCodeOptions = res
        })
        .catch(e => {
          // this.loading = false
          if (e.selfError) return
          // if (e.message) {
          //   this.$message.error('获取水印失败')
          // }
          this.$message({
            message: e.message || '服务器异常,请稍后再试!',
            type: 'error',
            showClose: true
          })
        })
    },
    validateWaterMarkCode () {
      this.$refs.docDetailForm.validate(valid => {
      })
    },
    dataChange (val) {
      if (this.docData.body.startDate === '') {
        this.docData.body.startDate = null
      }
      return val === '' ? null : val
    },
    /**
     * 是否显示Tooltip
     * @param val 需要显示的内容
     * @param len 文本框长度
     * @param isUse 是否使用Tooltip
     * @param id 文本框id
     * @returns {boolean}
     */
    showTooltip (val, len, isUse, id) {
      if (isUse) {
        let con = document.getElementsByTagName('body')[0]
        let span = document.createElement('span')
        span.id = id
        span.style.position = 'absolute'
        span.style.left = '30px'
        span.style.visibility = 'hidden'
        con.appendChild(span)
        span.innerText = val
        let showTip = document.getElementById(id).offsetWidth > len
        con.removeChild(span)
        return !showTip
      } else {
        return true
      }
    },
    // 预览
    preview (row) {
      const canPreview = ['jpg', 'jpeg', 'png', 'bmp', 'pdf', 'xlsx', 'xls', 'docx', 'doc', 'ppt', 'pptx']
      if (canPreview.indexOf(row.fileType.toLowerCase()) === -1) {
        this.$message({
          message: '该文件类型不支持在线预览',
          type: 'warning',
          showClose: true
        })
        return
      }
      let { href } = this.$router.resolve({
        path: '/previewDoc',
        query: {
          fileName: row.fileName,
          fileCode: row.fileCode,
          nonce: row.nonce,
          sign: row.sign,
          timeStamp: row.timeStamp,
          inside: '1'
        }
      })
      window.open(href, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.document-container {
  .clearboth{
    clear: both;
  }
  .content{
    button{
      font-size: 12px;
      border-radius: 2px;
      width: 80px;
      height: 30px;
      &.is-plain{
        color: #0B82FF;
        border: 1px solid rgba(11,130,255,0.50);
      }
    }
    .search-content{
      background: white;
      padding: 19px 20px;
      margin-bottom: 10px;
      .el-form-item{
        margin-right: 30px;
      }
      .el-form-item .el-input__inner{
        max-width: 400px;
      }
      /deep/ .el-date-editor .el-range-separator{
        height: 32px;
        color: #999999;
      }
      .date-picker{
        width: 360px;
      }
      .search-btn{
        width: 170px;
        float: right;
        margin-right: 10px;
      }
    }

    .main-warpper{
      background: white;
      padding: 20px 30px 30px;
      .main-header{
        margin-bottom: 20px;
        overflow: hidden;
        button{
          float: right;
          margin-right: 0;
          width: 110px;
        }
      }
      .el-table{
        color: rgba(0,0,0,0.65);
        .opt-btn{
          font-size: 14px;
          margin: 0 8px;
          padding: 0;
          width: 30px;
        }
      }
    }
  }

  /deep/ .el-dialog{
    width: 600px;
    /deep/ .el-dialog__header{
      background: #F4F4F4;
      bottom: 0;
      .el-dialog__title{
        font-size: 14px;
      }
      .el-dialog__headerbtn{
        top: 12px;
      }
    }
    /deep/ .el-dialog__footer{
      text-align: right;
      .el-button{
        border-radius: 2px;
      }
    }
    .el-form-item {
      margin-top: 13px;
    }
    .el-form-item__error{
      padding-top: 0;
    }
    .el-textarea__inner{
      width: 200px;
      /*font-family:"Microsoft";*/
      background-color: #ffffff;
      border-color: #999999;
      &:hover{
        @include border();
      }
      &:focus{
        @include border();
      }
    }
    .el-input__inner{
      width: 220px;
    }
    .tips{
      color:#F56C6C;
      height: auto;
      line-height: 20px;
    }
    &.detailForm{
      width: 700px;
      /deep/ .el-dialog__body{
        /*.el-form-item:nth-child(2){*/
        /*  float: right;*/
        /*}*/
        /*.el-form-item:nth-child(4){*/
        /*  float: right;*/
        /*}*/
        /*.el-form-item:nth-child(6){*/
        /*  float: right;*/
        /*}*/
        /*.el-form-item:nth-child(9){*/
        /*  float: right;*/
        /*}*/
        /*.el-form-item:nth-child(11){*/
        /*  float: right;*/
        /*}*/
        /*.el-form-item:nth-child(13){*/
        /*  float: right;*/
        /*}*/
        /*/deep/ .el-form-item__label {*/
        /*  width: auto;*/
        /*}*/
      }
      /*.el-input__inner{
        border-radius: 2px;
        width: 200px;
        border-color: #999999;
        &:hover{
          @include border();
        }
        &:focus{
          @include border();
        }
      } */
      /*.el-form-item.is-error .el-input__inner{*/
      /*  border-color: #F56C6C !important;*/
      /*}*/
      /*.el-form-item.is-error .el-textarea__inner{*/
      /*  border-color: #F56C6C !important;*/
      /*}*/
      /*.el-input.is-disabled .el-input__inner{*/
      /*  border: 1px solid #E5E5E5;*/
      /*  background-color: #fff !important;*/
      /*}*/
      /*.el-textarea.is-disabled .el-textarea__inner{*/
      /*  border: 1px solid #E5E5E5;*/
      /*  background-color: #fff !important;*/
      /*}*/
      .tips{
        color: red;
        /*height: 50px;*/
        line-height: 40px;
        padding-top: 13px;
        padding-right: 166px;
      }
    }
    /deep/ .el-col{
      .el-input__inner{
        height: 28px !important;
      }
    }
  }
  .uploadForm{
    /deep/ .el-dialog__body{
      .upload-demo{
        margin-bottom: 10px;
        .el-upload--text{
          /*width: 100%;*/
          width: 450px;
          margin: 0 55px;
          height: auto;
          .el-upload-dragger{
            width: 450px;
            margin: auto;
            background: #F4F4F4;
            border: 1px solid #E5E5E5;
            border-radius: 2px;
            height: 200px;
            .el-icon-upload{
              /*color: #0B82FF;*/
              @include color();
            }
          }
        }
        .el-upload-list{
          width: 450px;
          margin: 0 55px;
          li{
            border-bottom: 1px dashed #D9D9D9;
          }
        }
        .el-upload__text{
          color: #333333;
          letter-spacing: 0;
          text-align: center;
          line-height: 22px;
        }
        .el-upload__tip{
          font-size: 12px;
          color: #999999;
          padding-top: 5px;
          margin: auto;
          line-height: 20px;
        }
      }
      .el-form-item{
        width: 450px;
        margin: 0 55px;
        color: rgba(0, 0, 0, 0.85);
        letter-spacing: 0;
        line-height: 22px;
        .el-form-item__label{
          color: #333333;
        }
      }
      /deep/ .el-form-item__content{
        width: 365px;
      }
    }
  }
  .doc-detail-form {
    /deep/ .el-form-item {
      display: flex;
    }
    /deep/ .el-form-item__content {
      flex: 1;
    }
    /deep/ .el-input__inner {
      width: 100%;
    }
    /deep/ .el-select {
      width: 100%;
    }
    /deep/ .el-input.is-disabled .el-input__inner{
      border: 1px solid #E5E5E5;
    }
  }
}
</style>
