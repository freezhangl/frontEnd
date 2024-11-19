export default {
  /**
   * ~自立项目模拟数据
   * 字段说明：
   *  cname 中文名称
   *  name  后台字段名称（绑定label）
   *  type  不同渲染类型
   *   type -> optionList  有内容选项
   *   type -> notConfig   无选项
   *    causeTxt -> 无选项说明
   *   type -> optionTitle 标题选项
   *  value 选择状态
   */
  obj: [
    {
      cname: '基本信息',
      name: 'projectBaseInfo',
      type: 'optionList',
      conList: [
        { cname: '项目名称', value: false, name: 'projectName' },
        { cname: '项目来源', value: false, name: 'projectSource' },
        { cname: '项目类别', value: false, name: 'projectCategory' },
        { cname: '研发性质', value: false, name: 'developProperty' },
        { cname: '项目分类', value: false, name: 'projectType' },
        { cname: '项目级别', value: false, name: 'projectLevel' },
        { cname: '计划立项时间', value: false, name: 'planApprovalTime' },
        { cname: '计划结项时间', value: false, name: 'planFinishTime' },
        { cname: '费用类别', value: false, name: 'projectExpenditureType' }
      ],
      checkList: []
    },
    { cname: '属性信息', type: 'notConfig', causeTxt: '（此处不配置，动态表单模块配置）' },
    { cname: '产品信息', type: 'optionTitle', value: false, name: 'projectProduct' },
    { cname: '资源信息', type: 'optionTitle', value: false, name: 'projectResource' },
    {
      cname: '人员信息',
      type: 'optionList',
      name: 'projectTeamList',
      conList: [
        { cname: '项目经理', value: false, name: 'managerName' },
        { cname: '项目成员', value: false, name: 'memberName' },
        { cname: '项目观察员', value: false, name: 'inspector' },
        { cname: '专家', value: false, name: 'expert' }
      ],
      checkList: []
    },
    { cname: '项目预算', type: 'optionTitle', value: false, name: 'costBudgetList' },
    { cname: '子项目信息', type: 'optionTitle', value: false, name: 'projectAchievementList' },
    { cname: '里程碑信息', type: 'optionTitle', value: false, name: 'projectMileStones' }
  ]
}
