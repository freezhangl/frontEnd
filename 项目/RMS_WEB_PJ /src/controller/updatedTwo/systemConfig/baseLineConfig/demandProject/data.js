export default {
  'projectBaseInfo': { // 基本信息
    'projectName': true, // 项目名称
    'planApprovalTime': true, // 计划立项时间
    'planFinishTime': true, // 计划结项时间
    'projectExpenditureType': true // 费用类别
  },
  'projectTeam': { // 团队信息
    // 'demandUnit': true, // 需求单位
    // 'projectManager': true, // 项目经理
    // 'projectMember': true, // 项目成员
    // 'undertakeUnit': true, // 承担单位
    // 'undertakeManager': true, // 承担单位项目经理
    // 'undertakeMember': true, // 承担单位项目成员
    'leaderDemandUnit': true, // 牵头需求单位
    'leaderDemandManager': true, // 牵头需求单位项目经理
    'leaderDemandMember': true, // 牵头需求单位项目成员
    'partnerDemandUnit': true, // 配合需求单位
    'partnerDemandManager': true, // 配合需求单位项目经理（按部门拆分）
    'partnerDemandMember': true, // 配合需求单位项目成员（按部门拆分）
    'leaderUndertakeUnit': true, // 牵头承担单位
    'leaderUndertakeManager': true, // 牵头承担单位项目经理
    'leaderUndertakeMember': true, // 牵头承担单位项目成员
    'partnerUndertakeUnit': true, // 配合承担单位
    'partnerUndertakeManager': true, // 配合承担单位项目经理（按部门拆分）
    'partnerUndertakeMember': true, // 配合承担单位项目成员（按部门拆分）
    'uniteAssaultUnit': true, // 联合攻关单位
    'uniteAssaultManager': true // 联合攻关单位项目经理（按单位拆分）
  },
  'subProjectInfo': { // 子项目信息（可添加多个）
    'projectName': true, // 子项目名称
    'leaderDemandUnit': true, // 牵头需求单位
    'leaderDemandManager': true, // 牵头需求单位经理
    'leaderUndertakeUnit': true, // 牵头承担单位
    'leaderUndertakeManager': true, // 牵头承担单位经理
    'researchField': true, // 研究领域
    'marketBusiness': true, // 所属市场业务
    'developmentMode': true, // 承担方开展模式
    'researchContent': true, // 自研内容
    'demandContent': true// 委托方研发内容
  },
  'projectAchievement': { // 研究任务及预期成果
    'achievementName': true, // 任务名称
    'achievementType': true, // 成果类型
    'demandUnit': true, // 需求单位
    'demandUnitDept': true, // 需求单位部门
    'demandUnitResponsibleName': true, // 成果需求人
    'undertakeUnit': true, // 承担单位
    'undertakeUnitDept': true, // 承担单位部门
    'responsiblePerson': true, // 成果负责人
    'deliveryTime': true, // 预期交付时间
    'budgetOutsourcing': true, // 合作开发费-委外
    'budgetInsourcing': true, // 合作开发费-委内
    'staffTime': true, // 自有人工（填人月）
    'totalAmount': true // 合计金额
  },
  'projectMileStone': { // 里程碑信息
    'milestoneName': true, // 里程碑名称
    'milestoneDescription': true, // 里程碑描述
    'planFinishTime': true, // 计划完成时间
    'demandUnitList': true, // 需求单位
    'milestoneReviewer': true, // 里程碑评审人
    'commitmentUnitList': true, // 承担单位
    'milestoneLeader': true, // 里程碑责任人
    'resultInformationList': true // 任务及预期成果
  }
}
