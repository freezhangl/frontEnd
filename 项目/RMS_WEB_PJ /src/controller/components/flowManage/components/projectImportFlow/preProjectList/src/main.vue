<template>
  <div class="projectDocumentDetail" id="projectDocumentDetail">
    <project-panel title="项目列表信息">
      <div class="main-header">
        <el-button class="normal-btn" @click="download" >下载导入文件</el-button>
      </div>
      <self-table
        :table-data="preProjectList"
        :table-cols="projectDocCols"
        :loading="loading"
        :is-pagination="false"
      ></self-table>
    </project-panel>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel/index'
import selfTable from '@/components/table'
import axios from 'axios'
import { getStore } from '@/store'
import API from '@/serve/API_projectImport'
export default {
  name: 'projectImportList',
  components: { projectPanel, selfTable },
  props: {
    preProjectList: { type: Array, default: () => null },
    projectParams: { type: Object, default: () => null },
    fileList: { type: Array, default: () => null }
  },
  data () {
    return {
      projectDocCols: [
        {
          label: '项目编码',
          prop: 'projectCode',
          align: 'left',
          overflow: true,
          padding: true,
          resizable: false
        },
        {
          label: '项目名称',
          prop: 'projectName',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '是否计划内',
          prop: 'planFlag',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.formatData
        },
        {
          label: '是否统筹项目',
          prop: 'groupFlag',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.formatData
        },
        {
          label: '项目经理',
          prop: 'projectManagerName',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '牵头承担部门',
          prop: 'leadingDepartment',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.formatDate
        }
      ],
      projectDocColsOut: [
        {
          label: '项目名称',
          prop: 'projectName',
          align: 'left',
          padding: true,
          overflow: true,
          resizable: false
        },
        {
          label: '是否统筹项目',
          prop: 'groupFlag',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.formatData
        },
        {
          label: '项目经理',
          prop: 'projectManagerName',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '牵头承担部门',
          prop: 'leadingDepartment',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '费用类型',
          prop: 'projectExpenditureTypeValue',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '是否加计扣除',
          prop: 'additionalDeduction',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.formatData
        },
        {
          label: '是否研发包',
          prop: 'developPackage',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.formatData
        }
      ],
      //项目文档列表表头字段
      loading: false, //是否需要加载效果
      baseUrl: getStore().getters['CONFIG/baseUrl'], //下载请求url前缀
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      signInfo: {} // 文件sign信息
    }
  },
  watch: {
    preProjectList (val, oldVal) {
      // console.log(val)
      if (val && val[0]) {
        if (this.preProjectList[0].planFlag === '0') {
          this.projectDocCols = this.projectDocColsOut
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    getPreProjectList () {
      let param = {
        approveNo: this.docParams
      }
      API.queryProjectPreApproveImportDetails(param)
        .then(res => {
          this.preProjectList = res || []
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取批量预立项流程信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //处理文本格式 文件名称aa
    formatData (val) {
      if (!val) {
        return ''
      }
      if (val === '0' || val === 'false' || val === 'IS_RD_0') {
        return '否'
      } else {
        return '是'
      }
    },
    //下载文件
    async download () {
      let row = this.projectParams
      let url = '?nonce=' + row.nonce + '&sign=' + row.sign + '&timeStamp=' + row.timeStamp + '&fileCode=' + row.fileCode
      axios.request({
        url: this.baseUrl + '/rms/file/ext/file/v1/5/v1/file/' + url,
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
    }
  }
}
</script>
<style lang="scss" scoped>
.main-header {
  float: right;
  margin-bottom: 20px;
}
.projectDocumentDetail{
  width: 100%;
  background: white;
}
</style>
