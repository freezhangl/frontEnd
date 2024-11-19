<template>
  <!-- 驳回 -->
  <div class="launch-edit5">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveTermInfo(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="submitBtnVisible" @click="submitLauchInfo"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-cancellation" v-if="cancelBtnVisible" @click="cancellation"><span class="global-family">作废</span></i>
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">本单位自立研发项目终止申请</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">
        <div style="background:#fff;" class="write-msg">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            :label-width="'auto'"
            class="demo-ruleForm">
            <el-form-item label="实际终止时间：" prop="stopTime" class='time'>
              <el-date-picker
                v-model="ruleForm.stopTime"
                type="date"
                :picker-options="stopTimeOptions"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="取消或终止原因：" prop="reason">
              <el-input
                type="textarea"
                placeholder="请输入"
                v-model.trim="ruleForm.reason"
                maxlength="300"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="项目已产生成果：" prop="achievement">
              <el-input
                type="textarea"
                placeholder="请输入"
                v-model.trim="ruleForm.achievement"
                maxlength="300"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="潜在风险分析：" prop="existRisk">
              <div calss="info-relative">
                <el-input
                  type="textarea"
                  placeholder="请分析项目终止了会带来哪些方面潜在的影响"
                  v-model.trim="ruleForm.existRisk"
                  maxlength="300"
                  show-word-limit></el-input>
                <!-- <div class="info-absolute">
                  <el-tooltip :content="'对于部分技术支撑、运维支撑、产品支撑、系统优化、功能迭代等日常工作中大任务下包含较多规模较小、任务不易细化明确的研发活动，按照研发包方式管理（简称：研发包项目）。项目执行中，按照实际研发任务需求，在该研发包下发起若干任务申请。每一项任务申请应完成需求审批、结果确认等闭环管理。'" placement="top">
                    <i class="el-icon-info accountingNo"></i>
                  </el-tooltip>
                </div> -->
              </div>
            </el-form-item>
            <el-form-item label="资源执行结果：" prop="executeResult">
              <div calss="info-relative">
                <el-input
                  type="textarea"
                  placeholder="请输入"
                  v-model.trim="ruleForm.executeResult"
                  maxlength="300"
                  show-word-limit></el-input>
                <!-- <div class="info-absolute">
                  <el-tooltip :content="'对于部分技术支撑、运维支撑、产品支撑、系统优化、功能迭代等日常工作中大任务下包含较多规模较小、任务不易细化明确的研发活动，按照研发包方式管理（简称：研发包项目）。项目执行中，按照实际研发任务需求，在该研发包下发起若干任务申请。每一项任务申请应完成需求审批、结果确认等闭环管理。'" placement="top">
                    <i class="el-icon-info accountingNo"></i>
                  </el-tooltip>
                </div> -->
              </div>
            </el-form-item>
            <el-form-item label="其他：" prop="other">
              <el-input
                type="textarea"
                placeholder="请输入"
                v-model.trim="ruleForm.other"
                maxlength="300"
                show-word-limit></el-input>
            </el-form-item>
          </el-form>
        </div>
        <project-document-upload
          id="project-doc"
          v-if="docParams.approveNo"
          :doc-params="docParams"
          @existAttachmentIds="getDelIds"></project-document-upload>
        <div id="basic-info">
          <basicInfo :receive-data="projectBaseInfo" info-type="simple"></basicInfo>
        </div>
        <div id="property-info">
          <attributeInfoApprove
            :receive-data="projectBaseInfo"
            :project-attribute="projectAttribute"></attributeInfoApprove>
        </div>
        <div id="product-info" v-if="hasProductInfo">
          <product-info-detail
            ref="productInfo"
            :receive-data="productInfoList"></product-info-detail>
        </div>

        <div id="resource-info" v-if="hasResourceInfo">
          <res-info-detail
            ref="resourceInfo"
            :receive-data="resourceInfo"></res-info-detail>
        </div>
        <div id="team-info">
          <teamInfo :receive-data="projectTeamList"></teamInfo>
        </div>
        <div id="project-budget">
          <projectBudget :info="infoTitle" :receive-data="costBudgetList"></projectBudget>
        </div>
        <div id="task-ach">
          <subproject :receive-data="subProjectInfoList"></subproject>
        </div>
        <div id="milestone" v-if="isShowMilestone">
          <detailTableMilestone :receive-data="projectMileStones" @detailTableMilestoneShowOrHide="setMilestoneVisible"></detailTableMilestone>
        </div>
        <div id="approved-con">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
      </div>
    </div>

    <!-- 提交下一处理组件 -->
    <next-handle
      :show="nextHandleVis"
      :business-serial-number="processParams.businessSerialNumber"
      :process-template-code="processParams.processTemplateCode"
      @confirmNextHandle="confirmNextHandle"
      @changeNextHandle="closeNextHandle">
    </next-handle>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import param from '@/const/param'
import { getStore } from '@/store'

import flowAPI from '@/serve/API_flow'
import termAPI from './API_terminate'
import API from '@/serve/API_project'
import projectPanel from '@/controller/components/projectPanel'
import detailTableMilestone from '@/controller/extraProject/components/basic/milestone/detailTableMilestone'
import basicInfo from '@/controller/extraProject/components/basic/detail'
import teamInfo from '@/controller/extraProject/components/teamInfo/detail'
import projectBudget from '@/controller/extraProject/components/budget/finalDetail'
import subproject from '@/controller/extraProject/components/subproject/detail'
import projectDocumentUpload from '../../../projectDocumentUpload'
import attributeInfoApprove from '@/controller/extraProject/components/attributeInfo/detail'
import timeObj from '@/utils/DateTimeUtils.js'
import ProductInfoDetail from '../../../../extraProject/components/product/productInfoDetail.vue'
import ResInfoDetail from '../../../../extraProject/components/resource/resInfoDetail.vue'
export default {
  beforeRouteEnter (to, from, next) {
    if (!to.query.processDefName) {
      flowAPI.getWorkItemDetail(parseInt(to.query.workItemID))
        .then(res => {
          if (res.currentState === 4 || res.currentState === 10) {
            // next()
            next({
              path: to.fullPath,
              query: {
                processDefName: res.processDefName
              }
            })
          } else {
            let urlString = 'processInstID=' + to.query.processInstID
            next('/terminateFlow/terminateFlowDetail?' + urlString)
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            Message({
              message: e.message || '获取当前工作项详情失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    } else {
      next()
    }
  },
  components: {
    detailTableMilestone,
    basicInfo,
    teamInfo,
    projectBudget,
    projectDocumentUpload,
    subproject,
    attributeInfoApprove,
    ResInfoDetail,
    ProductInfoDetail
  },
  data () {
    var validStopTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择终止时间'))
      }
      if (this.projectBaseInfo.planApprovalTime) {
        if (new Date(value)
          .getTime() < this.projectBaseInfo.planApprovalTime) {
          callback(new Error('终止时间不能小于计划立项时间'))
        }
      } else if (this.projectBaseInfo.actualPreApprovalTime) {
        if (new Date(value)
          .getTime() < this.projectBaseInfo.actualPreApprovalTime) {
          callback(new Error('终止时间不能小于实际预立项时间'))
        }
      }
      callback()
    }
    return {
      infoTitle: {
        title: '成本信息'
      },
      typeOptions: null,
      levelList: null,
      clearFlag: true, //true 触发滚动
      showBackTop: false,
      isShowMilestone: true,
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      processTemplateCode: null, // 流程模板编码接口返回
      docParams: {
        type: 'BT-STOP',
        approveNo: null
        // check: true
      },
      loading: false,
      versionCode: '', // 项目版本号
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      costBudgetList: [], // 项目预算
      projectTeamList: [], // 团队信息
      subProjectInfoList: [], // 预期成果
      projectMileStones: [], // 里程碑信息
      approvalOpinionList: [], // 审批意见
      projectApprove: {}, //表单信息
      approveNo: null,
      projectCode: '',
      attachmentIds: [], //项目文档编辑后的文档ids
      attachments: [], //项目文档编辑后的文档
      attachmentTypeCode: '', //当前上传附件类型
      timer: 0,
      stopTimeOptions: {
        disabledDate: time => {
          if (this.projectBaseInfo.planApprovalTime) {
            return (
              time.getTime() <
              this.projectBaseInfo.planApprovalTime
            )
          } else if (this.projectBaseInfo.actualPreApprovalTime) {
            return (
              time.getTime() <
              this.projectBaseInfo.actualPreApprovalTime
            )
          }
        }
      },
      ruleForm: {
        stopTime: '',
        reason: '',
        achievement: '',
        existRisk: '',
        executeResult: '',
        other: '' },
      rules: {
        stopTime: [{ required: true, validator: validStopTime, trigger: 'blur' }],
        reason: [{ required: true, message: '请输入取消或终止原因', trigger: 'blur' }],
        achievement: [{ required: true, message: '请输入项目已产生成果', trigger: 'blur' }],
        existRisk: [{ required: true, message: '请输入潜在风险分析', trigger: 'blur' }],
        executeResult: [{ required: true, message: '请输入资源执行结果', trigger: 'blur' }]
      },
      navIdx: 0,
      navMenus: [
        { name: '项目文档', id: 'project-doc' },
        { name: '基本信息', id: 'basic-info' },
        { name: '属性信息', id: 'property-info' },
        { name: '产品信息', id: 'product-info' },
        { name: '资源信息', id: 'resource-info' },
        { name: '团队信息', id: 'team-info' },
        { name: '成本信息', id: 'project-budget' },
        { name: '子项目', id: 'task-ach' },
        { name: '里程碑', id: 'milestone' },
        { name: '审批意见', id: 'approved-con' }
      ],
      processParams: {
        workItemId: parseInt(this.$route.query.workItemID), //工作项ID
        businessSerialNumber: '', //业务流水号
        processInstId: parseInt(this.$route.query.processInstID), //流程实例ID
        activityInstId: parseInt(this.$route.query.activityInstID),
        processTemplateCode: this.$route.query.processDefName, //流程模板编码
        activityDefId: this.$route.query.activityDefID, //活动节点定义ID
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
        flushPortalUrl: this.$route.query.flushPortalUrl // OA跳转回刷
      },
      buttonList: [],
      submitBtnVisible: true, //TODO
      cancelBtnVisible: true, //TODO
      nextHandleVis: false, //提交下一处理组件
      processTraceVis: false, //流程跟踪组件
      submitNextHandleInfo: null, //提交下一处理表单数据
      productInfoList: [], //产品信息
      resourceInfo: {}, //资源信息
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true //资源信息中有产品信息
    }
  },
  created () {
    document.title = '终止流程驳回页'
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    this.getProcessInstDetailById()
    // this.getWorkItemDetail()
    this.getFlowBtnList()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      if (!val) {
        return ''
      }
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    //项目类型
    getProjectType () {
      API.dictValByCode('PROJECT-TYPE')
        .then(res => {
          this.typeOptions = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    //项目级别
    getProjectLevel () {
      API.dictValByCode('PROJECT-LEVEL')
        .then(res => {
          this.levelList = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 获取当前工作项详情--是否显示审批操作按钮
    getWorkItemDetail () {
      flowAPI.getWorkItemDetail(this.processParams.workItemId)
        .then(res => {
          if (res.currentState === 4 || res.currentState === 10) {
            this.getFlowBtnList()
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取当前工作项详情失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //根据流程实例ID获取业务流水号
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(this.processParams.processInstId)
        .then(res => {
          this.processParams.businessSerialNumber = res.businessSerialNumber
          this.docParams.approveNo = this.processParams.businessSerialNumber
          this.approveNo = res.businessSerialNumber
          this.queryTermDetail()
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
    // 获取流程指定节点按钮配置
    getFlowBtnList () {
      let params = {
        processTemplateCode: this.processParams.processTemplateCode, //131
        activityDefId: this.processParams.activityDefId//'manualActivity1'
      }
      flowAPI.getButtonList(params)
        .then(res => {
          this.buttonList = res
          this.judgeBtnVisible()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取按钮失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 判断按钮是否展示
    judgeBtnVisible () {
      this.submitBtnVisible = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.nextProcessing)
      this.cancelBtnVisible = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.cancellation)
    },
    // 获取立项流程详细信息
    async queryTermDetail () {
      // await this.getProjectType()
      // await this.getProjectLevel()
      let param = {
        approveNo: this.processParams.businessSerialNumber
      }
      termAPI.queryTermDetail(param)
        .then(res => {
          if (res.projectApprove) {
            let extendedAttributes = JSON.parse(res.projectApprove.extendedAttributes)
            this.ruleForm = extendedAttributes
          }
          this.projectApprove = res.projectApprove
          this.projectCode = res.projectBaseInfo.projectCode
          this.projectBaseInfo = res.projectBaseInfo
          this.projectAttribute = res.projectAttribute
          // this.costBudgetList = res.costs
          this.costBudgetList = this.transformList(res.projectCost, res.costBudgetList)
          this.projectTeamList = res.projectTeamList
          this.subProjectInfoList = res.subProjectInfoList || []
          this.subProjectInfoList.forEach(item => {
            item.versionNo = res.projectApprove.versionNo
            item.isUpdate = false
          })
          this.projectMileStones = res.projectMileStones
          this.isShowMilestone = this.projectMileStones && this.projectMileStones.length > 0
          if (!this.isShowMilestone) {
            this.deleteNavItem('milestone')
          }
          this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
          //产品信息
          this.productInfoList = res.projectProductInfoList || []
          this.hasProductInfo = this.productInfoList && this.productInfoList.length > 0
          if (!this.hasProductInfo) {
            this.deleteNavItem('product-info')
          }
          //资源信息
          this.resourceInfo = res.projectResourceInfoDto || {}
          this.hasResourceInfo = !!((this.resourceInfo && JSON.stringify(this.resourceInfo) !== '{}'))
          if (!this.hasResourceInfo) {
            this.deleteNavItem('resource-info')
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
    //删除菜单项
    deleteNavItem (id) {
      let index = -1
      this.navMenus.some((ele, i) => {
        if (ele.id === id) {
          index = i
          return true
        }
      })
      if (index > -1) {
        this.navMenus.splice(index, 1)
      }
    },
    // 转换数组
    transformList (actualArr, planArr) {
      actualArr.forEach((item, index) => {
        planArr.forEach((iter, i) => {
          if (item.timeYear === iter.timeYear) {
            iter.actualBudgetOutsourcing = actualArr[index].budgetOutsourcing // 实际委外
            iter.actualBudgetInsourcing = actualArr[index].budgetInsourcing // 实际委内
            iter.actualStaffTime = actualArr[index].staffTime // 实际人员工时（人月）
            iter.actualLaborCosts = actualArr[index].laborCosts // 实际人工成本
            iter.actualTravelExpenses = actualArr[index].travelExpenses // 实际差旅费
            iter.actualConferenceExpenses = actualArr[index].conferenceExpenses // 实际会议费
            iter.actualAssetDepreciation = actualArr[index].assetDepreciation // 实际资产折旧/摊销
            iter.actualOtherCosts = actualArr[index].otherCosts // 实际其他成本
            iter.actualTotalAmount = actualArr[index].totalAmount // 实际totalAmount
          }
        })
      })
      return planArr
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
    // 获取保存接口的参数：附件的ids，附件、流程id
    getDelIds (ids, attachs, approveNo) {
      this.attachmentIds = ids
      this.attachments = attachs
      // this.approveNo = approveNo
    },
    // 确认提交下一处理
    confirmNextHandle (val) {
      this.submitNextHandleInfo = val
      this.submitProjectApprove()
    },
    // 提交审批
    submitProjectApprove () {
      let params = {
        workItemId: this.processParams.workItemId,
        nextActivityDefId: this.submitNextHandleInfo.nextLinkShow,
        participants: this.submitNextHandleInfo.participants,
        approveNo: this.processParams.businessSerialNumber
      }
      termAPI.resubmitTerminate(params)
        .then(res => {
          this.$message({
            message: '终止申请创建成功。',
            type: 'success',
            showClose: true
          })
          this.nextHandleVis = false
          this.closeProcessInfo()
          // this.$refs['approveTimeForm'].clearValidate()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '提交失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 取消下一处理
    closeNextHandle () {
      this.nextHandleVis = false
    },
    //校验必传附件类型
    judgeAttachType () {
      let needUplodTypes = []
      let haveFileTypes = [] // 保存必填项中有文件的类型
      let attachments = this.attachments.filter(item => {
        return item.requiredFlag === '1'
      }) // 过滤必填项
      attachments.forEach(item => {
        if (item.fileName) {
          haveFileTypes.push(item.attachmentTypeName)
        }
      }) // 将有文件的必填项push进haveFileTypes
      attachments.forEach(item => {
        if (!haveFileTypes.some(i => i === item.attachmentTypeName)) {
          needUplodTypes.push(item.attachmentTypeName)
        }
      }) // 判断哪一项中没有文件
      if (needUplodTypes.length === 0) {
        return true
      } else {
        this.$message({
          type: 'error',
          message: '请上传' + needUplodTypes.toString() + '附件!'
        })
      }
    },
    // 保存流程编辑信息
    saveTermInfo (confirm = false) {
      let validType = this.judgeAttachType()
      this.$refs['ruleForm'].validate((valid) => {
        if (valid && validType) {
          if (this.ruleForm.stopTime !== null) {
            this.ruleForm.stopTime = new Date(this.ruleForm.stopTime)
              .getTime()
          }
          let urlString = 'approveNo=' + this.approveNo + '&projectCode=' + this.projectCode
          let obj = {
            stopTime: this.formatDate(this.ruleForm.stopTime),
            reason: this.ruleForm.reason,
            achievement: this.ruleForm.achievement,
            existRisk: this.ruleForm.existRisk,
            executeResult: this.ruleForm.executeResult,
            other: this.ruleForm.other
          }
          let params = {
            projectCode: this.projectCode,
            attachmentIds: this.attachmentIds,
            extendedAttributes: JSON.stringify(obj),
            approveNo: this.processParams.businessSerialNumber,
            projectName: this.projectBaseInfo.projectName,
            businessFormUrl: '/terminateFlow/terminateFlowEdit?addTerminate=false&type=BT-STOP&' + urlString
          }
          termAPI.saveTerminate(params)
            .then(res => {
              this.approveNo = res.approveNo
              if (confirm) { //提交下一处理：保存成功后弹出下一步组件
                this.nextHandleVis = true
              } else {
                // 提示保存成功是否提交申请
                this.$confirm(' ', '终止申请保存成功，是否提交申请?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  showClose: false,
                  customClass: 'self-message-box-delete',
                  cancelButtonClass: 'self-message-box-delete-cancel',
                  confirmButtonClass: 'self-message-box-delete-confirm'
                })
                  .then(() => {
                    this.submitLauchInfo()
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消提交申请'
                    })
                  })
                // 保存清空校验
                this.$refs['ruleForm'].clearValidate()
              }
            })
            .catch(e => {
              if (!e.selfError) {
                this.$message({
                  message: e.message || '服务器异常，请稍后再试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        }
      })
    },
    // 提交下一处理
    submitLauchInfo () {
      this.saveTermInfo(true)
    },
    // 作废流程编辑
    cancellation () {
      let params = {
        approveNo: this.processParams.businessSerialNumber
      }
      this.$confirm(' ', '是否要作废?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          termAPI.deleteTerminate(params)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '作废成功。'
              })
              this.closeProcessInfo()
            })
            .catch(e => {
              this.loading = false
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '作废失败，请稍后重试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消作废'
          })
        })
    },
    // 流程跟踪
    processTrace () {
      this.$router.push({
        path: '/processTrace',
        query: {
          businessSerialNumber: this.processParams.businessSerialNumber,
          processInstId: this.processParams.processInstId,
          userId: this.processParams.userId,
          fileCode: this.projectApprove.historyApproveFileId,
          historyFlag: this.projectApprove.historyFlag
        }
      })
    },
    // 关闭流程信息页面
    closeProcessInfo () {
      window.onscroll = null
      // 关闭窗口--需要判断是否OA跳转有回刷地址flushPortalUrl
      if (this.processParams.flushPortalUrl) {
        // window.location.href = 'https://www.baidu.com/' //test
        let paramsString = '?itemId=' + this.$route.query.itemId + '&appId=' + decodeURIComponent(this.$route.query.appID) + '&uniqueId=' + this.$route.query.uniqueId
        window.location.href = decodeURIComponent(this.processParams.flushPortalUrl) + paramsString
      } else {
        if (this.$route.query.isFromRMS === '1' && window.opener) {
          window.opener.refreshBacklogList()
        }
        window.close()
      }
    },
    setMilestoneVisible (show) {
      this.isShowMilestone = show
      if (!show) {
        let index = -1
        this.navMenus.some((ele, i) => {
          if (ele.id === 'milestone') {
            index = i
            return true
          }
        })
        if (index > -1) {
          this.navMenus.splice(index, 1)
        }
      }
    }
  },

  watch: {
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
.write-msg{
  padding: 20px 30px 30px;
  margin-bottom: 30px;
  /deep/{
    .el-textarea {
      textarea{
        border: 1px solid #E5E5E5;
        border-radius: 2px;
      }
      .el-input__count{
        line-height: 12px;
      }
    }
  }
}
.launch-edit5{
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
.time {
  /deep/ .el-form-item__error{
  right: inherit;
  left: 124px;
}
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

.info-relative {
  position: relative;
}
.info-absolute {
  width: 6px;
  position: absolute;
  top: 50%;
  right: -6px;
}
.accountingNo{
  margin-left: 5px;
  @include color();
}
/deep/ .write-msg .el-form-item__label {
  padding: 0 !important;
}
</style>
