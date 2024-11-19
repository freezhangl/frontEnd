export default {
  // 操作 集合
  operationList: [
    { value: '01', label: '所有' },
    { value: '02', label: '查看' },
    { value: '03', label: '编辑' },
    { value: '04', label: '项目业务流程提交' },
    { value: '05', label: '进展添加' },
    { value: '06', label: '成果附件' }
  ],
  // 操作 集合1
  projectTypeList: [
    { value: '01', label: '集团统筹-需求方' },
    { value: '02', label: '集团统筹-承担方' },
    { value: '03', label: '单位自立' }
  ],
  // 项目立项状态 集合
  approveStateList: [
    { value: '1', label: '草稿' },
    { value: '2', label: '审批中' },
    { value: '3', label: '驳回' },
    { value: '4', label: '已完成' }
  ],
  // 项目类型
  proTypeList: [
    { value: '0', label: '类型一' },
    { value: '1', label: '类型二' },
    { value: '2', label: '类型三' }
  ],
  // 项目类别
  categoryList: [
    { value: '0', label: '技术研究' },
    { value: '1', label: '产品研发' },
    { value: '2', label: '现网支撑' }
  ],
  // 项目状态
  proStateList: [
    { value: '0', label: '草稿' },
    { value: '1', label: '已立项' },
    { value: '2', label: '已终止' },
    { value: '3', label: '已结项' },
    { value: '4', label: '已关闭' }
  ],
  // 项目来源
  sourceList: [
    { value: '1', label: '公司研发' },
    { value: '2', label: '国拨' },
    { value: '3', label: '教育部基金' }
  ],
  // 项目级别
  proLevelList: [
    { value: '0', label: '一级' },
    { value: '1', label: '二级' },
    { value: '2', label: '三级' }
  ],
  // 费用类型
  spendList: [
    { value: '0', label: '费用化（OPEX）' },
    { value: '1', label: '资本化（CAPEX）' }
  ],
  // 是否研发包项目
  packageList: [
    { value: '0', label: '否' },
    { value: '1', label: '是' } ],
  options: [
    {
      value: '企标规范',
      label: '企标规范'
    },
    {
      value: '集采/选型测试',
      label: '集采/选型测试'
    },
    {
      value: '验收测试',
      label: '验收测试'
    },
    {
      value: '入网测试',
      label: '入网测试'
    },
    {
      value: '补丁测试',
      label: '补丁测试'
    },
    {
      value: '技术验证测试',
      label: '技术验证测试'
    },
    {
      value: '报告方案-技术研究类',
      label: '报告方案-技术研究类'
    },
    {
      value: '报告方案-市场/咨询类',
      label: '报告方案-市场/咨询类'
    },
    {
      value: '产品-原型',
      label: '产品-原型'
    },
    {
      value: '产品-商用/准商用',
      label: '产品-商用/准商用'
    },
    {
      value: '标准化-文稿',
      label: '标准化-文稿'
    },
    {
      value: '标准化-立项',
      label: '标准化-立项'
    },
    {
      value: '标准化-标准',
      label: '标准化-标准'
    },
    {
      value: '标准化-白皮书',
      label: '标准化-白皮书'
    },
    {
      value: '标准化-研究报告',
      label: '标准化-研究报告'
    },
    {
      value: '支撑集团公司领导报告',
      label: '支撑集团公司领导报告'
    },
    {
      value: '支撑院领导对外报告',
      label: '支撑院领导对外报告'
    },
    {
      value: '论文',
      label: '论文'
    },
    {
      value: '书籍',
      label: '书籍'
    },
    {
      value: '培训材料',
      label: '培训材料'
    },
    {
      value: '专利',
      label: '专利'
    },
    {
      value: '其他',
      label: '其他'
    }
  ],
  projectStatus: [
    {
      value: '草稿',
      label: '草稿',
      hoverlabel: '草稿'
    },
    {
      value: '立项审批中',
      label: '立项审批中',
      hoverlabel: '立项审批中'
    },
    {
      value: '已立项',
      label: '已立项',
      hoverlabel: '已立项'
    },
    {
      value: '变更审批中',
      label: '变更审批中',
      hoverlabel: '变更审批中'
    },
    {
      value: '终止审批中',
      label: '终止审批中',
      hoverlabel: '终止审批中'
    },
    {
      value: '已终止',
      label: '已终止',
      hoverlabel: '已终止'
    },
    {
      value: '结项审批中',
      label: '结项审批中',
      hoverlabel: '结项审批中'
    },
    {
      value: '已结项',
      label: '已结项',
      hoverlabel: '已结项'
    },
    {
      value: '已关闭',
      label: '已关闭',
      hoverlabel: '已关闭'
    }
  ],
  //展开收起状态
  statusArr: [
    {
      status: true,
      index: 0
    },
    {
      status: true,
      index: 1
    },
    {
      status: true,
      index: 2
    },
    {
      status: true,
      index: 3
    },
    {
      status: true,
      index: 4
    }
  ],
  //审批按钮编码
  approvalButtons: {
    writeOpinions: 'B001', // { value: 'B001', label: '填写处理意见' },
    nextProcessing: 'B002', // { value: 'B002', label: '提交下一处理' },
    writeOpinions1: 'B0021', //填写处理意见（特殊组件的正常审批）
    nextProcessing1: 'B0022', //提交下一处理（特殊组件的正常审批）
    processTrace: 'B003', // { value: 'B003', label: '流程跟踪' },
    turnTo: 'B004', // { value: 'B004', label: '转办' },
    sendRead: 'B005', // { value: 'B005', label: '送阅知' },
    multTaskMeet1: 'B0061', // { value: 'B006', label: '填写处理意见' },
    multTaskMeet2: 'B0062', // { value: 'B006', label: '提交下一处理' },
    multProMeet1: 'B0071', // { value: 'B007', label: '填写处理意见' },
    multProMeet2: 'B0072', // { value: 'B007', label: '提交下一处理' },
    approvalNotice: 'B008', // { value: 'B008', label: '立项批复通知' },
    cancellation: 'B009', // { value: 'B009', label: '作废' },
    close: 'B010', // { value: 'B010', label: '关闭' },
    save: 'B011' // { value: 'B011', label: '保存' },
  },
  approvalButtonsObj: {
    'B001': { icon: 'svgfont-btn-edit', label: '退回', name: 'back' },
    'B002': { icon: 'svgfont-btn-submit', label: '提交', name: 'submit' },
    'B003': { icon: 'svgfont-', label: '转办', name: 'turnTo' },
    'B004': { icon: 'svgfont-btn-read', label: '送阅知', name: 'sendRead' },
    'B005': { icon: 'svgfont-btn-edit', label: '立项批复通知', name: 'approvalNotice' },
    'B006': { icon: 'svgfont-btn-cancellation', label: '作废', name: 'cancellation' },
    'B007': { icon: 'svgfont-btn-close', label: '关闭', name: 'close' },
    'B008': { icon: 'svgfont-btn-edit', label: '填写处理意见', name: 'writeOpinions' },
    'B009': { icon: 'svgfont-btn-submit', label: '提交下一处理', name: 'nextProcessing' },
    'B010': { icon: 'svgfont-btn-trace', label: '流程跟踪', name: 'processTrace' },
    'B011': { icon: 'svgfont-btn-save', label: '保存', name: 'save' }
  }
}
