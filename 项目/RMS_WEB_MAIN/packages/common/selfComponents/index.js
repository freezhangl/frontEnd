import Vue from 'vue'
import SpTable from './table'
import SubHomepage from './subHomepage'
import projectPanel from './projectPanel'
import fInput from './list/fInput'
import fTextarea from './list/fTextarea'
import fNaturalNumbers from './list/fNaturalNumbers'
import fNumber from './list/fNumber'
import fDate from './list/fDate'
import fSelect from './list/fSelect'
import fAdvancedSelect from './list/fAdvancedSelect'
import fOn from './list/fSwitch'
import fRadio from './list/fRadio'
import fCheckbox from './list/fCheckbox'
import fRelatedSelect from './list/fRelatedSelect' //联级选择
import fChooseDepartment from './list/fChooseDepartment' //部门选择
import fDemandUnit from './list/fDemandUnit' //需求单位
import fChargeUnit from './list/fChargeUnit' //承担单位
import fActivityList from './list/fActivityList' //研发活动清单
import fPeopleOptions from './list/fPeopleOptions' //人员选择
import fProjectManage from './list/fProjectManage' //项目经理
import fChooseUnit from './list/fChooseUnit' //公司选择
import fProjectDirector from './list/fProjectDirector' //项目总监
import fOrganizationManager from './list/fOrganizationManager' //组织主辅负责人
import approvalOpinion from './process/approvalOpinion' //审批意见组件（表格）
import countersign from './process/countersign' //专家会签
import countersignChild from './process/countersignChild' //部门会签
import nextHandle from './process/nextHandle' //下一处理
import processSubmit from './process/processSubmit' //审批组件
import processGroupPlan from './process/processGroupPlan' //审批组件其他会签合并至同意
import processTransfer from './process/processTransfer' //流程转办
import processToRead from './process/processToRead' //送阅知
import formProjectAdd from './components/formProjectAdd' //封装组件新增
import formProjectEdit from './components/formProjectEdit' //封装组件编辑
import formProjectPreview from './components/formProjectPreview' //封装组件预览
import formProjectApprove from './components/formProjectApprove' //封装组件预览
// import previewPdf from './previewPdf' //pdf预览
import SpAdvancedSelect from './advancedSelect' // 动态表单-多选-左右滚动展示效果

let components = {
  SpTable,
  SubHomepage,
  projectPanel,
  fInput,
  fTextarea,
  fNaturalNumbers,
  fNumber,
  fDate,
  fSelect,
  fAdvancedSelect,
  fOn,
  fRadio,
  fCheckbox,
  fRelatedSelect,
  fChooseDepartment,
  fDemandUnit,
  fChargeUnit,
  fActivityList,
  fPeopleOptions,
  fProjectManage,
  fChooseUnit,
  fProjectDirector,
  fOrganizationManager,
  approvalOpinion,
  countersign,
  countersignChild,
  nextHandle,
  processSubmit,
  processGroupPlan,
  processTransfer,
  processToRead,
  formProjectAdd,
  formProjectEdit,
  formProjectPreview,
  formProjectApprove,
  // previewPdf,
  SpAdvancedSelect
}

for (let k in components) {
  Vue.component(k, components[k])
}

export default Object.keys(components)
