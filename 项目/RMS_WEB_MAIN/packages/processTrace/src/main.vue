<template>
  <div class="processTrace">
    <div class="processTrace-operation">
      <i class="approve-icon svgfont-back" @click="closeProcessTrace"><span class="global-family">返回</span></i>
      <img style="float:right" src="@/assets/image/svg/logo-default.svg">
    </div>
    <div class="processTrace-content" v-if="!historyFlag || historyFlag==='0'">
      <div class="processTraceImg">
        <project-panel title="流程节点图">
          <div class="processTraceImg_body">
            <iframe
              name = "iframeChild"
              id = "iframeChild"
              :src="imgSrc"
              width="100%"
              :height="iframeHeight"
              frameborder="0"
              scrolling="auto"
              ref="iframeDom"></iframe>
          </div>
        </project-panel>
      </div>
      <div class="processTraceDetail">
        <project-panel title="处理节点明细">
          <div class="processTraceDetail_body">
            <sp-table
              :table-data="traceDetailList"
              :table-cols="tableCols"
              :loading="loading"
            ></sp-table>
          </div>
        </project-panel>
      </div>
    </div>
    <div v-else>
      <preview-pdf :file-code="fileCode" ></preview-pdf>
    </div>
  </div>
</template>
<script>
import PreviewPdf from '@lib/common/selfComponents/previewPdf/index'
import API from '../serve'
import { formatDate } from '@lib/common/util/common'
export default {
  name: 'processTrace',
  data () {
    return {
      imgSrc: '',
      traceImgShow: false,
      traceDetailShow: false,
      iframeHeight: 400,
      traceDetailList: [],
      loading: false,
      tableCols: [ //表格的头部信息
        {
          label: 'ID',
          prop: 'id',
          align: 'left',
          width: '200',
          overflow: true,
          resizable: false
        },
        {
          label: '处理节点',
          prop: 'activityNodeName',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '处理人',
          prop: 'approverName',
          align: 'center',
          overflow: true,
          resizable: false
        },
        {
          label: '审批时间',
          prop: 'createdDate',
          align: 'left',
          width: '200',
          overflow: true,
          resizable: false,
          formatter: formatDate
        },
        {
          label: '审批意见',
          prop: 'approvalOpinion',
          align: 'left',
          overflow: true,
          resizable: false
        }
      ],
      historyFlag: this.$route.query.historyFlag, //是否历史数据
      fileCode: this.$route.query.fileCode, //历史数据文件编码 '1283589068277420033'
      processInstId: this.$route.query.processInstId //流程实例ID
    }
  },
  components: { PreviewPdf },
  mounted () {
    if (!this.historyFlag || this.historyFlag === '0') {
      this.getApprovals()
      this.getTraceUrl()
    }
  },
  methods: {
    // 查询流程跟踪url
    getTraceUrl () {
      API.getTraceUrl({ businessSerialNumber: String(this.$route.query.businessSerialNumber) })
        .then(res => {
          // this.imgSrc = res + '&processInstId=' + this.processInstId
          this.imgSrc = res
          this.$refs.iframeDom.contentWindow.location.replace(this.imgSrc)
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取流程跟踪url失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 查询审批记录
    getApprovals () {
      this.loading = true
      let params = {
        businessSerialNumber: this.$route.query.businessSerialNumber //业务流水号
      }
      API.getApprovals(params)
        .then(res => {
          this.loading = false
          this.traceDetailList = res
          // API.getBusinessProcessInst(this.$route.query.businessSerialNumber)
          //   .then(res => {
          //     if (res) {
          //       this.traceDetailList.push({
          //         id: null,
          //         activityNodeName: res.approverActivityName,
          //         approverName: res.approverName
          //       })
          //     }
          //   })
          //   .catch(e => {
          //     if (e.selfError) return
          //     if (e.message) {
          //       this.$message({
          //         message: e.message || '服务器异常，请稍后再试！',
          //         type: 'error',
          //         showClose: true
          //       })
          //     }
          //   })
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取处理节点明细列表失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    closeProcessTrace () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.processTrace {
  position: absolute;
  height: 100%;
  width: 100%;
  top:0;
  left: 0;
  overflow-y: auto;
  background-color: #f8f9fa;
  .processTrace-operation {
    box-shadow: 0 4px 4px 0 rgba(220,223,230,0.50);
    background-color: #fff;
    border-radius: 2px;
    padding: 10px 130px;
    .approve-icon{
      font-size: 14px;
      cursor: pointer;
      &:before{
        vertical-align: -2px;
        margin-right: 5px;
      }
    }
  }
  /deep/ .processTrace-content {
    padding: 0 130px 46px;
    .processTraceImg {
      box-shadow: 0 4px 4px 0 rgba(220,223,230,0.50);
      background-color: #fff;
      border-radius: 2px;
      margin: 20px 0;
      .processTraceImg_body {
        padding: 20px 30px;
      }
    }
    .processTraceDetail {
      box-shadow: 0 4px 4px 0 rgba(220,223,230,0.50);
      background-color: #fff;
      border-radius: 2px;
      .processTraceDetail_body {
        padding: 20px 30px;
        .el-table {
          .cell {
            span {
              white-space: normal;
            }
          }
        }
      }
    }
  }
}
</style>
