<template>
  <div class="launch-edit">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span>
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-back" v-if="createdBy && userId === createdBy"  @click="rollBackProcessInstance"><span class="global-family">撤回流程</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">批量预立项申请</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">
        <prelaunch-info ref="change-reason" :info="changeReason"></prelaunch-info>
        <project-import-list
          id="project-list"
          :project-params="projectParams"
          :pre-project-list="projectApprovePreApprovalImportList"></project-import-list>
        <div id="approved-con" v-if="isShowApprove && projectApprove.historyFlag === '0'">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
        <project-document-detail
          id="project-doc"
          :file-list="attachmentFileList"
          v-if="docVisible"></project-document-detail>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_project'
import preAPI from '@/serve/API_projectImport'
import flowAPI from '@/serve/API_flow'
import projectDocumentDetail from '@/controller/groupPlan/components/attachments/detail'
import prelaunchInfo from './preLunchFlowInfo/detail'
import projectImportList from './preProjectList'
import { getStore } from '@/store'
import { flowRollback } from '@/common/flowRollbackMixins'
export default {
  data () {
    return {
      changeReason: '',
      docVisible: false,
      processInstId: this.$route.query.processInstID, // 流程实例ID
      approveNo: this.$route.query.approveNo, // 业务流水号
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      projectApprovePreApprovalImportList: [], //x项目列表信息
      attachmentFileList: [], // 单据附件列表
      approvalOpinionList: [], // 审批意见
      projectApprove: {}, //表单信息
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      docParams: {
        type: 'BT-PRE-APPROVE-IMPORT',
        approveNo: this.$route.query.approveNo
      },
      businessType: 'BT-PRE-APPROVE-IMPORT',
      projectParams: {
        nonce: '',
        sign: '',
        timeStamp: '',
        fileCode: ''
      },
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      navMenus: [
        {
          name: '项目列表信息',
          id: 'project-list'
        },
        {
          name: '审批意见',
          id: 'approved-con'
        },
        {
          name: '项目文档',
          id: 'project-doc'
        }
      ],
      isShowApprove: true
    }
  },
  mixins: [flowRollback],
  components: {
    projectImportList,
    projectDocumentDetail,
    prelaunchInfo
  },
  computed: {
  },
  mounted () {
    this.getPageUrl()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    // 判断入口参数
    getPageUrl () {
      if (this.$route.query.approveNo) {
        this.getApproveTemInfo()
      } else {
        this.getProcessInstDetailById()
      }
    },
    // 审批-获取业务流水号
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(Number(this.$route.query.processInstID))
        .then(res => {
          this.approveNo = res.businessSerialNumber
          this.docParams.approveNo = res.businessSerialNumber
          this.getApproveTemInfo()
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 根据业务流水号查询业务流程实例信息
    getBusinessProcessInst () {
      this.getApproveTemInfo()
      flowAPI.getBusinessProcessInst(this.approveNo)
        .then(res => {
          this.processInstId = res.processInstId
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取业务流程实例信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取立项流程详细信息
    async getApproveTemInfo () {
      let param = {
        approveNo: this.approveNo
      }
      preAPI.queryProjectPreApproveImportDetails(param)
        .then(res => {
          if (res) {
            if (res.projectApproveInfo && res.projectApproveInfo.extendedAttributes) {
              let extendedAttributes = JSON.parse(res.projectApproveInfo.extendedAttributes)
              this.changeReason = extendedAttributes.remarks || ''
              this.projectParams = {
                nonce: res.nonce,
                sign: res.sign,
                timeStamp: res.timeStamp,
                fileCode: extendedAttributes.fileCode,
                fileName: extendedAttributes.fileName
              }
            }
            this.projectApprove = res.projectApproveInfo
            this.createdBy = this.projectApprove ? this.projectApprove.createdBy : ''
            this.attachmentFileList = res.attachmentDtoList || []
            this.docVisible = true
            this.projectApprovePreApprovalImportList = res.projectApprovePreApprovalImportList || []
            if (res.approveRecord === null || res.approveRecord.total === 0) {
              this.isShowApprove = false
              let index = -1
              this.navMenus.some((ele, i) => {
                if (ele.id === 'approved-con') {
                  index = i
                  return true
                }
              })
              if (index > -1) {
                this.navMenus.splice(index, 1)
              }
            }
            this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取立项流程详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 流程跟踪
    processTrace () {
      if (this.projectApprove.historyFlag === '0' && this.$route.query.approveNo) {
        flowAPI.getBusinessProcessInst(this.approveNo)
          .then(res => {
            this.processInstId = res.processInstId
            this.$router.push({
              path: '/processTrace',
              query: {
                businessSerialNumber: this.approveNo,
                processInstId: res.processInstId,
                userId: this.userId,
                fileCode: this.projectApprove.historyApproveFileId,
                historyFlag: this.projectApprove.historyFlag
              }
            })
          })
          .catch(e => {
            this.loading = false
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '获取业务流程实例信息失败，请稍后重试！',
                type: 'error',
                showClose: true
              })
            }
          })
      } else {
        this.$router.push({
          path: '/processTrace',
          query: {
            businessSerialNumber: this.approveNo,
            processInstId: this.processInstId,
            userId: this.userId,
            fileCode: this.projectApprove.historyApproveFileId,
            historyFlag: this.projectApprove.historyFlag
          }
        })
      }
    },
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
    },
    slideNav (menu, idx) {
      if (this.timer) {
        window.clearTimeout(this.timer)
      }

      this.navIdx = idx
      this.clearFlag = false
      document.getElementById(menu.id)
        .scrollIntoView({
          behavior: 'smooth'
        })

      this.timer = setTimeout(() => {
        this.clearFlag = true
      }, 1000)
    },
    updateProjectCode (code) {
      this.projectCode = code
    },
    scrollWindow () {
      if (!this.clearFlag) {
        return
      }

      let doc = document.documentElement || document.body
      let sTop = doc.scrollTop
      let cHei = doc.clientHeight
      let sHei = doc.scrollHeight

      if (sTop > 500) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }

      if (sTop + cHei + 5 >= sHei) {
        this.navIdx = this.navMenus.length - 1
        return false
      }

      let posArr = []

      this.navMenus.forEach(menu => {
        posArr.push(document.getElementById(menu.id).offsetTop)
      })

      let _idx = 0

      if (posArr[posArr.length - 1] <= sTop) {
        this.navIdx = posArr.length - 1
      } else {
        for (let i = 0; i < posArr.length - 1; i++) {
          if (sTop >= posArr[i] && sTop < posArr[i + 1]) {
            _idx = i
            break
          }
        }
        this.navIdx = _idx
      }
    },
    // 关闭流程信息页面
    closeProcessInfo () {
      // if (this.$route.query.projectCode) {
      //   this.$router.push({
      //     path: this.backUrl,
      //     query: {
      //       activeTab: 'projectProgress'
      //     }
      //   })
      // }

      if (this.$route.query.isCarry === '1' && window.opener) {
        window.opener.refreshBacklogList1()
        window.opener = null
        window.open('', '_self')
        window.close()
      } else {
        window.close()
      }
    }
  },
  created () {
    this.projectCode = this.$route.params.projectCode || ''
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  }
}
</script>
<style  lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px){
  /deep/ .head-con{
    width: 1000px !important;
  }
  /deep/ .main-container{
    width: 1000px !important;
  }
  /deep/ .nav-menu{
    left: calc(50% + 520px) !important;
  }
}

@media screen and (max-width: 1364px){
  /deep/ .head-con{
    width: 960px !important;
  }
  /deep/ .main-container{
    width: 960px !important;
  }
  /deep/ .nav-menu{
    left: calc(50% + 500px) !important;
  }
}

.launch-edit{
   /deep/ .el-form-item__content:hover{
  .el-form-item__error{
    display: inline-block;
  }
}
/deep/ .el-form-item__error{
  display: none;
  background: #fff;
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: -32px;
  border: 1px solid #f56c6c;
  right: 1px;
  z-index: 999999999;
  padding: 4px !important;
  left: auto;
  white-space: nowrap;
}

/deep/ .el-form-item__error:before{
content: ”;
position: absolute;
top: 18px;
left: 12px;
width: 4px;
height: 4px;
border: 1px solid #f56c6c;
background: #fff;
border-top-color: transparent;
border-left-color: transparent;
content: " ";
transform: rotate(
45deg
);
}
  /deep/ .el-form-item{
   margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
  }
  overflow: auto;
  background : #f6f6f6;
  min-height: 100vh;
  .back-top{
    z-index: 100;
    position: fixed;
    bottom: 20px;
    right : 10px;
    cursor: pointer;
    img{
      width: 50px;
      height: 50px;
    }
  }
  .top-head{
    height: 50px;
    background : #fff;
    i{
      margin-right: 10px;
      cursor: pointer;
      &:before {
        margin-right: 5px;
      }
    }
    .head-con{
      height: 50px;
      line-height: 50px;
      width: 1180px;
      margin: 0 auto;

      .logo-img{
        float: right;
        margin-top: 15px;
      }
      .approve-icon{
        font-size: 14px;
        &:before{
          vertical-align: -2px;
        }
      }
    }
  }

  .main-container{
    width: 1180px;
    margin: 0 auto;
    .project-title{

      font-size: 26px;
      font-weight: 600;
      color: #333333;
      text-align: center;
      line-height: 26px;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .top-opt-con{
      display: flex;
      align-items: center;
      background: #f6f6f6;
      height: 70px;

      .btn-opt{

        font-size: 14px;
        color: #333;
        text-align: center;
        line-height: 18px;
        margin-right: 20px;
        font-weight: bold;
        cursor: pointer;

        i{
          margin-right: 5px;
        }
      }

    }

    .nav-menu{
      position: fixed;
      left: calc(50% + 630px);
      top : 120px;
      border-left: 1px solid #e5e5e5;
      padding : 20px 10px;
      z-index: 9;

      .nav-menu-item{
        display: block;
        position: relative;
        margin: 12px 0;

        &:hover{
          @include color();
        }

        &.item-active{
          @include color();

          &::after{
            display: inline-block;
            position: absolute;
            content :'';
            left : -17px;
            top : 3px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            @include border();
            border-width: 4px !important;
            background: #fff;
          }
        }

      }
    }

  }
  .main-content{
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
    .approval-form{
      background:#fff;
      height: 70px;
      line-height: 70px;
      margin-top: 30px;
      margin-bottom: 20px;
      padding: 0px 20px;
      /deep/ .el-form-item__content{
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>
