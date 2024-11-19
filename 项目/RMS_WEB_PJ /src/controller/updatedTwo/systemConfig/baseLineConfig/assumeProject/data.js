export default {
  'projectBaseInfo': { // 基本信息
    'projectName': true, // 项目名称
    'projectLevel': true, // 项目级别
    'projectType': true, // 项目分类
    'planApprovalTime': true, // 计划立项时间
    'planFinishTime': true, // 计划结项时间
    'projectExpenditureType': true// 费用类别
  },
  'projectProduct': true, // 资源信息
  'projectResource': true, // 产品信息
  'projectTeam': { // 团队信息
    'leaderUndertakeManager': true, // 项目经理
    'projectMember': true, // 项目成员
    'projectExpert': true, // 专家
    'projectInspector': true // 项目观察员
  },
  'projectBudget': true, // 项目预算
  'subProjectInfo': { // 子项目信息
    'projectName': true, // 子项目名称
    'projectManager': true, // 项目经理
    'subProjectAchievementList': true // 任务及预期成果
  },
  'projectMileStone': { // 里程碑信息
    'milestoneName': true, // 里程碑名称
    'milestoneDescription': true, // 里程碑描述
    'planFinishTime': true, // 计划完成时间
    'milestoneLeader': true, // 里程碑责任人
    'resultInformationList': true, // 任务及预期成果
    'linkResultFlag': true // 是否关联任务及预期成果
  }
}
