<template>
  <div class="research-activities">
    <div class="header">
      <el-tabs v-model="activeName" style="padding-bottom: 10px;">
        <el-tab-pane label="预立项导入" name="projectImport">
        </el-tab-pane>
      </el-tabs>
      <el-form
        :inline="true"
        ref="searchForm"
        :model="searchForm"
        label-width="auto">
        <el-form-item label="年份：" prop="timeYear">
          <el-date-picker
            v-model="searchForm.timeYear"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
            :clearable="true"
            @keyup.enter.native="getResSearch"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="审批状态：" prop="approveStates">
          <SpAdvancedSelect
            :data.sync="searchForm.approveStates"
            :list="approveStateOptions"
            is-more-type="even"
            value-txt="value"
            label-txt="label"
            placeholder="全部"
          ></SpAdvancedSelect>
        </el-form-item>
        <el-form-item  class="search-btn">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getResSearch">查询</el-button>
          <el-button
            class="normal-btn"
            icon="el-icon-refresh-left"
            @click="searchReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main">
      <div class="main-header">
        <el-button class="normal-btn" @click="showDownloadMoal" >下载模板</el-button>
        <el-upload
          class="upload"
          name="file"
          :show-file-list="false"
          :headers="uploadHeaders"
          :action="uploadUrl"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :on-error="handleError">
          <el-button class="normal-btn">预立项导入</el-button>
        </el-upload>
        <el-button class="normal-btn" @click="batchDeleteFiles">批量删除</el-button>
      </div>
      <div class="main-table">
        <self-table
          :table-data="projectList"
          :table-cols="tableCols"
          :is-pagination="true"
          :is-selection="true"
          :pagination="{ pageSize: searchForm.pageSize, pageNum: searchForm.pageNum, total: searchForm.pageTotal }"
          @refresh="getProjectList"
          @select="handleSelectChange"
        ></self-table>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      class="downloadDialog"
      title="请选择模板"
      width="475px"
      :before-close="closeDownload"
      :visible.sync="isShowMoal"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleDownloadChange">
          <el-table-column
            type="selection"
            label="请选择"
            width="80">
          </el-table-column>
          <el-table-column
            prop="name"
            width="350"
            label="文件名称"
          >
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDownload">取消</el-button>
        <DownloadFile
          :url="downloadUrl + fileType "
          @sucsess="closeDownload"
          method="get"
          style="margin: 0 10px;"
          message="模板下载成功！">
          <el-button type="primary">确定</el-button>
        </DownloadFile>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/serve/API_projectImport'
import { getStore } from '@/store'
import DownloadFile from '@/components/download'
import SelfTable from '@/components/table'
import axios from 'axios'
export default {
  name: 'projectImport',
  components: { DownloadFile, SelfTable },
  data () {
    return {
      activeName: 'projectImport',
      timer: [],
      searchForm: {
        approveStates: [], //审批状态
        timeYear: '', //1年份
        pageSize: 10, // 每页条数
        pageNum: 1, //当前页码
        pageTotal: 0 // 总页数
      },
      projectList: [], // 列表数据
      selectProjectIdList: [], //批量选中的预立项列表id集合
      approveStateOptions: [ //审批状态options
        {
          value: 1,
          label: '草稿'
        },
        {
          value: 2,
          label: '审批中'
        },
        {
          value: 3,
          label: '审批驳回'
        },
        {
          value: 4,
          label: '已完成'
        },
        {
          value: 5,
          label: '已作废'
        }
      ],
      tableCols: [ // 列表配置项
        {
          label: '文件名称',
          prop: 'extendedAttributes',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.formatFileName
        },
        {
          label: '导入时间',
          prop: 'versionCreatedDate',
          align: 'center',
          overflow: true,
          resizable: false,
          formatter: this.formatDateDay
        },
        {
          label: '流程发起时间',
          prop: 'initiatedDate',
          align: 'center',
          overflow: true,
          resizable: false,
          formatter: this.formatDateTime
        },
        {
          label: '审批状态',
          prop: 'approveState', //approveState
          type: 'Status',
          align: 'center',
          overflow: true,
          resizable: false,
          formatter: this.statusFormatter
        },
        {
          label: '流程查看',
          prop: 'operation',
          type: 'Button',
          align: 'center',
          btnList: [
            { id: 1, type: 'text', isHidden: this.shoDetailBtn, label: '查看', handle: this.goAprovePage }
          ]
        },
        {
          label: '操作',
          prop: 'operation1',
          type: 'Button',
          width: '180px',
          align: 'center',
          btnList: [
            { id: 1, type: 'text', label: '下载', handle: this.download },
            { id: 2, type: 'text', label: '删除', class: 'delBtnClass', isHidden: this.showDelBtn, handle: this.deleteFile },
            { id: 3, type: 'text', label: '发起流程', isHidden: this.showDelBtn, handle: this.preLaunchApproval }
          ]
        }
      ],
      tableData: [{
        type: '1',
        name: '预立项目导入模板-计划内新增'

      }, {
        type: '2',
        name: '预立项目导入模板-计划外新增'
      }],
      isShowMoal: false,
      tableLoading: false, // 列表loading效果
      checkRows: [], // 当前选中的所有行
      dialogVisible: false, //新增&编辑&详情弹出框控制显示
      devActivityDetailData: {}, //当前编辑的数据
      title: '', //传给弹出框的标题
      isIncludeInvalid: false, //批量删除列表中是否包含有效的数据
      fileType: '0000',
      exportUrl: '', //下载模板完整地址
      uploadHeaders: { Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization }, //上传时的Token
      uploadUrl: getStore().getters['CONFIG/baseUrl'] + '/rms/project/groupPreProjectApproveController/v1/0/importPreProjectApprove', //上传地址
      downloadUrl: getStore().getters['CONFIG/baseUrl'] + '/rms/project/groupPreProjectApproveController/v1/5/downloadProjectPreApproveImportTemplateFile?fileType=', //下载模板完整地址
      contentType: { headers: { 'Content-Type': 'application/vnd.ms-excel;charset=UTF-8' } },
      uploadLoading: null //导入文件时出现的loading状态组件
    }
  },
  methods: {
    //获取预立项导入列表
    getProjectList (pageNum, pageSize) {
      this.tableLoading = true
      this.searchForm.pageNum = pageNum
      this.searchForm.pageSize = pageSize
      let params = {}
      params.timeYear = this.searchForm.timeYear
      params.approveStates = this.searchForm.approveStates.join(',')
      params.pageSize = this.searchForm.pageSize
      params.pageNum = this.searchForm.pageNum
      API.preProjectApproveList(params)
        .then(res => {
          if (res && res.records && res.records.length) {
            this.loading = false
            this.projectList = res.records || []
            this.projectList.forEach((item) => {
              if (item.approveState === '1' || item.approveState === '5') {
                item.initiatedDate = null
              }
            })
            this.searchForm.pageTotal = parseInt(res.total)
          } else {
            this.projectList = []
            this.searchForm.pageTotal = 0
            if (params.pageNum !== 1) { //点击分页查询
              this.searchForm.pageNum = 1
              this.getProjectList(this.searchForm.pageNum, this.searchForm.pageSize)
            }
          }
          this.tableLoading = false
          this.checkRows = []
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常,请稍后再试!',
              type: 'error',
              showClose: true
            })
          }
          this.tableLoading = false
        })
    },
    //是否显示 删除和发起流程按钮
    showDelBtn (row) {
      return row.approveState === '1'
    },
    //是否展示查看按钮
    shoDetailBtn (row) {
      return row.approveState !== '1' &&
        row.approveState !== '5'
    },
    //查询
    getResSearch () {
      this.searchForm.pageNum = 1
      this.getProjectList(this.searchForm.pageNum, this.searchForm.pageSize)
    },
    //重置
    searchReset () {
      this.$refs['searchForm'].resetFields()
      this.searchForm.timeYear = '' //年份
      this.searchForm.approveStates = [] //审批状态
      this.searchForm.pageSize = 10
      this.searchForm.pageNum = 1
      this.searchForm.pageTotal = 0
      this.getProjectList(this.searchForm.pageNum, this.searchForm.pageSize)
    },
    showDownloadMoal () {
      this.isShowMoal = true
      this.fileType = '0000'
    },
    closeDownload () {
      this.isShowMoal = false
      this.$refs.multipleTable.clearSelection()
      this.fileType = '0000'
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleDownloadChange (val) {
      if (val && val.length === 1) {
        this.exportUrl = this.downloadUrl + val[0].type
        this.fileType = val[0].type
      } else if (val && val.length === 2) {
        this.exportUrl = this.downloadUrl + '3'
        this.fileType = '3'
      } else {
        this.exportUrl = this.downloadUrl + '0000'
        this.fileType = '0000'
      }
    },
    //选中状态改变事件
    handleSelectChange (selection) {
      if (selection && selection.length > 0) {
        let selectIdList = []
        selection.forEach(item => {
          selectIdList.push(item.approveNo)
        })
        this.isIncludeInvalid = selection.some(item => {
          return item.approveState !== '1'
        })
        this.selectProjectIdList = selectIdList
      } else {
        this.selectProjectIdList = selection
      }
    },
    deleteFile (row, index) {
      this.$confirm(`一旦确定删除，结果将无法撤回，请谨慎考虑。`, `确定要删除吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          let param = [row.approveNo]
          API.deleteApprove(param)
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.searchReset() // 重置查询条件
            })
        })
    },
    //批量删除
    batchDeleteFiles () {
      if (this.selectProjectIdList && this.selectProjectIdList.length > 0) {
        if (this.isIncludeInvalid) {
          this.$message({
            message: '只能删除审批状态为草稿的文件,请重新勾选!',
            type: 'warning',
            showClose: true
          })
          return
        }
        this.$confirm(' ', '确定要批量删除已选导入文件？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(res => {
            let param = this.selectProjectIdList
            API.deleteApprove(param)
              .then(res => {
                if (res) {
                  this.$message({
                    message: '批量删除成功!',
                    type: 'success',
                    showClose: true
                  })
                } else {
                  this.$message({
                    message: '服务器异常,请稍后再试!',
                    type: 'error',
                    showClose: true
                  })
                }
                this.searchReset() // 重置查询条件
              })
              .catch(err => {
                // console.log(err)
                if (err.selfError) return
                this.$message({
                  message: err.message || '服务器异常,请稍后再试!',
                  type: 'error',
                  showClose: true
                })
              })
            this.selectProjectIdList = []
          })
      } else {
        this.$message({
          message: '请先勾选需要删除的预立项导入文件！',
          type: 'warning',
          showClose: true
        })
      }
    },
    //上传文件前
    beforeUpload (file) {
      let index = file.name.lastIndexOf('.')
      let xls = file.name.substring(index + 1, file.name.length)
      if (xls === 'xls' || xls === 'xlsx') {
        this.uploadLoading = this.$loading({
          lock: true,
          text: '校验中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        return file
      } else {
        this.$message({
          message: '上传文件只能是xls/xlsx格式!',
          type: 'warning',
          showClose: true
        })
        return false
      }
    },
    //上传文件失败回调
    handleError (res) {
      this.uploadLoading.close()
      if (!res.body && res.message) {
        this.$message({
          message: res.message,
          type: 'error',
          showClose: true
        })
        return
      }
      this.$confirm('文件校验失败，请下载错误提示文件查看错误原因', '提示', {
        confirmButtonText: '下载',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          if (res.body) {
            this.download(res.body)
          }
        })
    },
    //上传文件成功回调
    handleSuccess (response, file) {
      // console.log(response)
      if (response.code === '000000') {
        this.$message({
          message: '导入数据成功!',
          type: 'success',
          showClose: true
        })
        this.uploadLoading.close()
        this.searchReset() // 重置查询条件
      } else {
        this.handleError(response)
        this.uploadLoading.close()
      }
    },
    //处理文本格式 文件名称
    formatFileName (val) {
      if (!val) {
        return ''
      }
      let obj = JSON.parse(val)
      if (typeof obj === 'object' && obj.fileName) {
        return obj.fileName
      } else {
        return '  '
      }
    },
    //处理文本格式 日期格式化天
    formatDateDay (val) {
      if (!val) {
        return ''
      }
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    //处理文本格式 日期格式化时分秒
    formatDateTime (val) {
      if (!val) {
        return ''
      }
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    //处理文本格式 状态过滤
    statusFormatter (val) {
      let status = ''
      switch (val) {
        case '1':
          status = '草稿'
          break
        case '2':
          status = '审批中'
          break
        case '3':
          status = '审批驳回'
          break
        case '4':
          status = '已完成'
          break
        case '5':
          status = '已作废'
          break
        default:
          status = ' '
      }
      return status
    },
    //下载列表文件
    async download (row) {
      if (row.extendedAttributes) { //获取项目列表下载参数
        let extendObj = JSON.parse(row.extendedAttributes)
        row.fileCode = extendObj.fileCode || ''
        row.fileName = extendObj.fileName || ''
      }
      let url = '?nonce=' + row.nonce + '&sign=' + row.sign + '&timeStamp=' + row.timeStamp + '&fileCode=' + row.fileCode
      axios.request({
        url: getStore().getters['CONFIG/baseUrl'] + '/rms/file/ext/file/v1/5/v1/file/' + url,
        headers: {
          'Authorization': getStore().getters['USERENTITY/authHeaher'].Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        },
        responseType: 'blob'
      })
        .then((res) => {
          let blob = new Blob([res.data])
          let fileName = row.fileName
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
          this.$message({
            message: err,
            type: 'error',
            showClose: true
          })
        })
    },
    //流程查看
    goAprovePage (item) {
      let { href } = this.$router.resolve({
        path: '/groupPreLaunchFlow/groupPreProjectDetail/',
        query: {
          businessType: item.businessType, //类型(批量预立项）
          projectCode: item.projectCode,
          approveNo: item.approveNo,
          isCarry: '1'
        }
      })
      // 打开新的窗口
      let $window = window.open(href, '_blank')
      if (this.timer[item.approveNo]) {
        window.clearInterval(this.timer[item.approveNo])
      }
      this.timer[item.approveNo] = setInterval(() => {
        if ($window && $window.closed) {
          if (this.timer[item.approveNo]) {
            window.clearInterval(this.timer[item.approveNo])
          }
          //this.myProjectList()
          // this.$emit('myProjectList')
        }
      }, 500)
    },
    //发起流程
    preLaunchApproval (item) {
      this.$router.push({
        path: '/groupPreLaunchFlow/groupPreProjectEdit',
        query: {
          addLaunch: 'true',
          businessType: item.businessType, //类型(批量预立项）
          projectCode: item.projectCode,
          versionCode: item.versionNo,
          approveNo: item.approveNo,
          isCarry: '1'
        }
      })
    }
  },
  mounted () {
    this.getResSearch()
    window['refreshBacklogList1'] = () => {
      this.getResSearch()
    }
  }
}
</script>

<style lang="scss" scoped>
.downloadDialog {
  /deep/ .el-table th.is-leaf,
  /deep/ .el-table__body td {
    border-right: none !important;
  }
  /deep/ .el-dialog__body {
    padding: 20px 20px;
  }
}
/deep/ .delBtnClass {
  color: red !important;
}
.research-activities {
  .header {
    background: #FFFFFF;
    padding:0px 30px 30px;
    margin-bottom: 10px;
    .search-btn{
      width: 180px;
      float: right;
      margin-right: 0;
    }
  }
  .main {
    background: #FFFFFF;
    padding: 20px 30px;
    &::after {
      content: '';
      display: block;
      clear: both;
      visibility: hidden;
      height: 0;
    }
    .main-header {
      float: right;
      margin-bottom: 20px;
      .upload {
        display: inline-block;
        margin: 0 10px;
      }
    }
    .main-table {
      /deep/ .el-table__header {
        background: #F4F4F4;
      }
      /deep/ .el-table__body {
        border-left: 1px solid #E5E5E5;
        border-right: 1px solid #E5E5E5;
      }
      .status {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 5px;
        position: relative;
        bottom: 2.5px;
      }
      .over {
        background: #79c95b;
      }
      .fail {
        background: #FF3F3B;
      }
    }
  }
}
</style>
