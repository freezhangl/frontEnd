//子路由
const inRouterMap = {
  name: 'projectLife',
  path: '/projectLife',
  component: () => import('@/controller/routerContainer.vue'),
  redirect: {
    name: 'projectLife'
  },
  meta: {
    title: '集中化研发项目管理系统-项目全生命周期管理'
  },
  children: [
    // { //testpage
    //   name: 'testPage',
    //   path: '/projectLife/testPage',
    //   component: () => import('@/controller/projectLife/testPage'),
    //   meta: {
    //     title: '测试页面',
    //     breadHeader: '生命周期管理 / 测试页面 / ',
    //     breadTitle: '测试页面'
    //   }
    // },
    // 我的项目页面
    {
      name: 'myProject',
      path: '/myProject/myProject',
      component: () => import('@/controller/myProject/myProject'),
      meta: {
        title: '我的项目',
        breadHeader: '我的项目管理 / 我的项目 / ',
        breadTitle: '我的项目'
      }
    },
    {
      name: 'projectImport',
      path: '/myProject/projectImport',
      component: () => import('@/controller/myProject/projectImport'),
      meta: {
        title: '项目导入',
        breadHeader: '我的项目管理 / 项目导入 / ',
        breadTitle: '项目导入'
      }
    },
    // 本单位项目管理项目查询
    {
      name: 'unitProjectSearch',
      path: '/projectManage/unitProject/projectSearch',
      component: () => import('@/controller/projectSearch/unitProjectSearch'),
      meta: {
        title: '本单位项目查询',
        breadHeader: '本单位项目管理 / 本单位项目查询 / ',
        breadTitle: '本单位项目查询'
      }
    },
    // 本单位项目管理 - 里程碑查询
    {
      name: 'unitMilestoneSearch',
      path: '/projectManage/unitProject/milestoneSearch',
      component: () => import('@/controller/projectSearch/unitMilestoneSearch'),
      meta: {
        title: '里程碑查询',
        breadHeader: '本单位项目管理 / 里程碑查询 / ',
        breadTitle: '本单位项目查询'
      }
    },
    // 全集团项目管理项目查询
    {
      name: 'groupProjectSearch',
      path: '/projectManage/groupProject/projectSearch',
      component: () => import('@/controller/projectSearch/groupProjectSearch'),
      meta: {
        title: '全集团项目查询',
        breadHeader: '全集团项目管理 / 全集团项目查询 / ',
        breadTitle: '全集团项目查询'
      }
    },
    // 全集团项目管理 - 里程碑查询
    {
      name: 'groupMilestoneSearch',
      path: '/projectManage/groupProject/milestoneSearch',
      component: () => import('@/controller/projectSearch/groupMilestoneSearch'),
      meta: {
        title: '全集团项目查询',
        breadHeader: '全集团项目管理 / 里程碑查询 / ',
        breadTitle: '全集团项目查询'
      }
    },
    // 项目承担单位评分
    {
      name: 'undertakingUnitProjectSource',
      path: '/projectManage/groupProject/undertakingUnitProjectSource',
      component: () => import('@/controller/projectSearch/undertakingUnitProjectSource'),
      meta: {
        title: '项目承担单位评分',
        breadHeader: '全集团项目管理 / 项目承担单位评分 / ',
        breadTitle: '项目承担单位评分'
      }
    },
    // 项目联合攻关单位评分
    {
      name: 'projectJointResearchUnitSource',
      path: '/projectManage/groupProject/projectJointResearchUnitSource',
      component: () => import('@/controller/projectSearch/projectJointResearchUnitSource'),
      meta: {
        title: '项目联合攻关单位评分',
        breadHeader: '全集团项目管理 / 项目联合攻关单位评分 / ',
        breadTitle: '项目联合攻关单位评分'
      }
    },
    // 基线信息配置
    {
      name: 'baseLineConfig',
      path: '/systemConfig/baseLineConfig',
      component: () => import('@/controller/updatedTwo/systemConfig/baseLineConfig'),
      meta: {
        title: '基线信息配置',
        breadHeader: '系统配置 / 基线信息配置 / ',
        breadTitle: '基线信息配置'
      }
    },
    { // 流程审批--我的待办
      name: 'backlog',
      path: '/systemFunction/processManagement/processApprove/backlog',
      component: () => import('@/controller/processApprove/backlog/backlog.vue'),
      meta: {
        title: '我的待办',
        breadHeader: '流程审批 / 我的待办 / ',
        breadTitle: '我的待办'
      }
    },
    { // 流程审批--我的已办
      name: 'haveFinished',
      path: '/systemFunction/processManagement/processApprove/haveFinished',
      component: () => import('@/controller/processApprove/haveFinished/haveFinished.vue'),
      meta: {
        title: '我的已办',
        breadHeader: '流程审批 / 我的已办 / ',
        breadTitle: '我的已办'
      }
    },
    { // 流程审批--我的待阅
      name: 'haveFinished',
      path: '/systemFunction/processManagement/processApprove/toBeRead',
      component: () => import('@/controller/processApprove/toBeRead/toBeRead.vue'),
      meta: {
        title: '我的待阅',
        breadHeader: '流程审批 / 我的待阅 / ',
        breadTitle: '我的待阅'
      }
    },
    { // 流程审批--我的已阅
      name: 'haveFinished',
      path: '/systemFunction/processManagement/processApprove/haveRead',
      component: () => import('@/controller/processApprove/haveRead/haveRead.vue'),
      meta: {
        title: '我的已阅',
        breadHeader: '流程审批 / 我的已阅 / ',
        breadTitle: '我的已阅'
      }
    },
    { // 产品信息维护
      name: 'productInfoConfig',
      path: '/basicConfig/productInfoConfig',
      component: () => import('@/controller/productInfoConfig/productInfoConfig.vue'),
      meta: {
        title: '产品信息维护',
        breadHeader: '项目基础配置 / 产品信息维护 / ',
        breadTitle: '产品信息维护'
      }
    }
  ]
}
//新标签页路由
const outRouterMap = [
  {
    name: 'extraProject',
    path: '/projectInfo/projectInfo-edit',
    component: () => import('@/controller/extraProject/projectForm.vue'),
    meta: {
      title: '项目信息',
      hasPermission: true
      // breadHeader: '我的项目 / 项目信息 / ',
      // breadTitle: '项目信息编辑'
    }
  },
  {
    name: 'editProject',
    path: '/projectInfo/projectInfo-edit/:projectCode',
    component: () => import('@/controller/extraProject/projectForm.vue'),
    meta: {
      title: '项目信息',
      hasPermission: true
      // breadHeader: '我的项目 / 项目信息 / ',
      // breadTitle: '项目信息编辑'
    }
  },
  // // 子项目开发对应的路由
  // {
  //   name: 'extraProject',
  //   path: '/projectInfo/projectInfo-edit',
  //   component: () => import('@/controller/extraProject/projectFormNew.vue'),
  //   meta: {
  //     title: '项目信息',
  //     hasPermission: true
  //     // breadHeader: '我的项目 / 项目信息 / ',
  //     // breadTitle: '项目信息编辑'
  //   }
  // },
  // {
  //   name: 'editProject',
  //   path: '/projectInfo/projectInfo-edit/:projectCode',
  //   component: () => import('@/controller/extraProject/projectFormNew.vue'),
  //   meta: {
  //     title: '项目信息',
  //     hasPermission: true
  //     // breadHeader: '我的项目 / 项目信息 / ',
  //     // breadTitle: '项目信息编辑'
  //   }
  // },
  // 预立项流程详情页面
  {
    name: 'beforeLaunchFlowDetail',
    path: '/beforeLaunchFlow/beforeLaunchFlowDetail',
    component: () => import('@/controller/components/flowManage/components/beforeLaunchFlow/beforeLaunchFlowDetail.vue'),
    meta: {
      title: '预立项流程详情',
      hasPermission: true
    }
  },
  // 预立项流程编辑页面
  {
    name: 'beforeLaunchFlowEdit',
    path: '/beforeLaunchFlow/beforeLaunchFlowEdit',
    component: () => import('@/controller/components/flowManage/components/beforeLaunchFlow/beforeLaunchFlowEdit.vue'),
    meta: {
      title: '预立项流程编辑',
      hasPermission: true
    }
  },
  // 预立项流程审批页面
  {
    name: 'beforeLaunchFlowApproval',
    path: '/beforeLaunchFlow/beforeLaunchFlowApproval',
    component: () => import('@/controller/components/flowManage/components/beforeLaunchFlow/beforeLaunchFlowApproval.vue'),
    meta: {
      title: '预立项流程编辑',
      hasPermission: true
    }
  },
  // 预立项流程驳回页面
  {
    name: 'beforeLaunchFlowReject',
    path: '/beforeLaunchFlow/beforeLaunchFlowReject',
    component: () => import('@/controller/components/flowManage/components/beforeLaunchFlow/beforeLaunchFlowReject.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  // 立项流程详情页面
  {
    name: 'lauFlowDetail',
    path: '/launchFlow/lauFlowDetail',
    component: () => import('@/controller/components/flowManage/lauFlowDetail'),
    meta: {
      title: '立项流程详情',
      hasPermission: true
    }
  },
  // 立项流程编辑页面
  {
    name: 'launchFlowEdit',
    path: '/launchFlow/launchFlowEdit',
    component: () => import('@/controller/components/flowManage/launchFlowEdit'),
    meta: {
      title: '立项流程编辑',
      hasPermission: true
    }
  },
  // 立项流程审批页面
  {
    name: 'launchFlowApproval',
    path: '/launchFlow/launchFlowApproval',
    //:workItemID/:activityDefID/:activityInstID/:processDefID/:processInstID
    component: () => import('@/controller/components/flowManage/launchFlowApproval'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  // 立项流程驳回页面
  {
    name: 'launchFlowReject',
    path: '/launchFlow/launchFlowReject',
    //:workItemID/:activityDefID/:activityInstID/:processDefID/:processInstID
    component: () => import('@/controller/components/flowManage/launchFlowReject'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  // 结项流程详情页面
  {
    name: 'finalFlowDetail',
    path: '/finalFlow/finalFlowDetail',
    component: () => import('@/controller/components/flowManage/finalFlowDetail'),
    meta: {
      title: '结项流程详情',
      hasPermission: true
    }
  },
  // 结项流程编辑页面
  {
    name: 'finalFlowEdit',
    path: '/finalFlow/finalFlowEdit',
    component: () => import('@/controller/components/flowManage/finalFlowEdit'),
    meta: {
      title: '结项流程编辑',
      hasPermission: true
    }
  },
  // 结项流程审批页面
  {
    name: 'finalFlowApproval',
    path: '/finalFlow/finalFlowApproval',
    component: () => import('@/controller/components/flowManage/finalFlowApproval'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  // 结项流程驳回页面
  {
    name: 'finalFlowReject',
    path: '/finalFlow/finalFlowReject',
    component: () => import('@/controller/components/flowManage/finalFlowReject'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  { // 主页详情
    name: 'projectDetail',
    path: '/projectInfo/projectInfo-detail/:projectCode',
    component: () => import('@/controller/projectInfo/projectInfo.vue'),
    meta: {
      title: '项目信息',
      hasPermission: true
    }
  },
  // // 子项目对用的路由
  // { // 主页详情
  //   name: 'projectDetail',
  //   path: '/projectInfo/projectInfo-detail/:projectCode',
  //   component: () => import('@/controller/projectInfo/projectInfoNew.vue'),
  //   meta: {
  //     title: '项目信息',
  //     hasPermission: true
  //   }
  // },
  { // 主页历史版本详情
    name: 'historyVersionDetail',
    path: '/projectInfo/historyVersionDetail',
    component: () => import('@/controller/projectInfo/components/historyVersionDetail'),
    meta: {
      title: '项目信息',
      hasPermission: true
    }
  },
  { // 主页对比历史版本
    name: 'contrastVersion',
    path: '/projectInfo/contrastVersion',
    component: () => import('@/controller/projectInfo/components/contrastVersion'),
    meta: {
      title: '项目信息',
      hasPermission: true
    }
  },
  // 任务审请详情页面
  {
    name: 'taskDetail',
    path: '/task/taskDetail',
    component: () => import('../controller/components/flowManage/components/task/taskDetail.vue'),
    meta: {
      title: '任务申请流程详情',
      hasPermission: true
    }
  },
  // 任务审请编辑页面
  {
    name: 'taskEdit',
    path: '/task/taskEdit',
    component: () => import('../controller/components/flowManage/components/task/taskEdit.vue'),
    meta: {
      title: '任务申请流程编辑',
      hasPermission: true
    }
  },
  // 任务审请审批页面
  {
    name: 'taskApprove',
    path: '/task/taskApprove',
    component: () => import('../controller/components/flowManage/components/task/taskApprove.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  // 任务审请完成提交页面
  {
    name: 'completeSubmit',
    path: '/task/completeSubmit',
    component: () => import('../controller/components/flowManage/components/task/completeSubmit.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  // 任务审请驳回页面
  {
    name: 'taskReject',
    path: '/task/taskReject',
    component: () => import('../controller/components/flowManage/components/task/taskReject.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  // 任务审请完成后审批页面
  {
    name: 'completeApprove',
    path: '/task/completeApprove',
    component: () => import('../controller/components/flowManage/components/task/completeApprove.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  // 里程碑流程编辑页面
  {
    name: 'milestoneProcessEdit',
    path: '/milestone/milestoneProcessEdit',
    component: () => import('@/controller/components/flowManage/components/milestone/milestoneProcessEdit.vue'),
    meta: {
      title: '里程碑流程编辑',
      hasPermission: true
    }
  },
  // 里程碑流程详情页面
  {
    name: 'milestoneProcessDetail',
    path: '/milestone/milestoneProcessDetail',
    component: () => import('../controller/components/flowManage/components/milestone/milestoneProcessDetail.vue'),
    meta: {
      title: '里程碑流程详情',
      hasPermission: true
    }
  },
  // 里程碑流程审批页面
  {
    name: 'milestoneProcessApprove',
    path: '/milestone/milestoneProcessApprove',
    component: () => import('@/controller/components/flowManage/components/milestone/milestoneProcessApprove.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  // 里程碑流程驳回页面
  {
    name: 'milestoneProcessReject',
    path: '/milestone/milestoneProcessReject',
    component: () => import('@/controller/components/flowManage/components/milestone/milestoneProcessReject.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  { //变更流程编辑
    name: 'changeFlowEdit',
    path: '/changeFlow/changeFlowEdit',
    component: () => import('@/controller/components/flowManage/changeFlowEdit'),
    meta: {
      title: '变更流程编辑',
      hasPermission: true
    }
  },
  { //变更流程审批
    name: 'changeFlowApprove',
    path: '/changeFlow/changeFlowApprove',
    component: () => import('@/controller/components/flowManage/changeFlowApprove'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  { //变更流程驳回
    name: 'changeFlowReject',
    path: '/changeFlow/changeFlowReject',
    component: () => import('@/controller/components/flowManage/changeFlowReject'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  { //变更流程查看流程、待阅、已阅、已办、我的申请
    name: 'changeFlowViewDetail',
    path: '/changeFlow/changeFlowViewDetail',
    component: () => import('@/controller/components/flowManage/changeFlowViewDetail'),
    meta: {
      title: '变更流程查看',
      hasPermission: true
    }
  },
  { //变更流程-变更详情对比页面
    name: 'changeFlowContrastDetails',
    path: '/changeFlow/changeFlowContrastDetails',
    component: () => import('@/controller/components/flowManage/changeFlowContrastDetails'),
    meta: {
      title: '变更详情',
      hasPermission: true
    }
  },
  // 变更流程待阅、已阅页面---废弃
  {
    name: 'changeFlowDetail',
    path: '/launchFlow/changeFlowDetail',
    component: () => import('@/controller/components/flowManage/changeFlowDetail'),
    meta: {
      title: '立项流程待阅',
      hasPermission: true
    }
  },
  { // 终止流程编辑页
    name: 'terminateFlowEdit',
    path: '/terminateFlow/terminateFlowEdit',
    component: () => import('@/controller/components/flowManage/components/terminateFlow/terminateFlowEdit.vue'),
    meta: {
      title: '终止流程编辑',
      hasPermission: true
    }
  },
  { // 终止流程查看页
    name: 'terminateFlowDetail',
    path: '/terminateFlow/terminateFlowDetail',
    component: () => import('@/controller/components/flowManage/components/terminateFlow/terminateFlowDetail.vue'),
    meta: {
      title: '终止流程查看',
      hasPermission: true
    }
  },
  { // 终止流程审批页
    name: 'terminateFlowApprove',
    path: '/terminateFlow/terminateFlowApprove',
    component: () => import('@/controller/components/flowManage/components/terminateFlow/terminateFlowApprove.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  { // 终止流程驳回页
    name: 'terminateFlowReject',
    path: '/terminateFlow/terminateFlowReject',
    component: () => import('@/controller/components/flowManage/components/terminateFlow/terminateFlowReject.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  /***************预立项批量导入--审批页面*************** */
  //批量预立项--审批详情页面
  {
    name: 'groupPreProjectApproval',
    path: '/groupPreLaunchFlow/groupPreProjectApproval',
    component: () => import('@/controller/components/flowManage/components/projectImportFlow/groupPreProjectApproval'),
    meta: {
      title: '批量预立项流程审批',
      hasPermission: true
    }
  },
  //批量预立项--驳回页面
  {
    name: 'groupPreProjectReject',
    path: '/groupPreLaunchFlow/groupPreProjectReject',
    component: () => import('@/controller/components/flowManage/components/projectImportFlow/groupPreProjectReject'),
    meta: {
      title: '批量预立项流程驳回',
      hasPermission: true
    }
  },
  //批量预立项--审批详情页面
  {
    name: 'groupPreProjectDetail',
    path: '/groupPreLaunchFlow/groupPreProjectDetail',
    component: () => import('@/controller/components/flowManage/components/projectImportFlow/groupPreProjectDetail'),
    meta: {
      title: '批量预立项流程详情',
      hasPermission: true
    }
  },
  // 批量预立项--审批编辑页面
  {
    name: 'groupPreProjectEdit',
    path: '/groupPreLaunchFlow/groupPreProjectEdit',
    component: () => import('@/controller/components/flowManage/components/projectImportFlow/groupPreProjectEdit'),
    meta: {
      title: '项批预立量编辑',
      hasPermission: true
    }
  },
  /******************************集团统筹项目路由配置****************************************** */
  // 项目新增/编辑、及项目详情
  { // 集团统筹 - 项目详情页
    name: 'groupProjectDetail',
    path: '/groupPlan/projectDetail/:projectCode',
    component: () => import('@/controller/groupPlan/projectDetail/projectDetail.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  { // 集团统筹 - 新增页
    name: 'groupProjectEdit',
    path: '/groupPlan/projectEdit',
    component: () => import('@/controller/groupPlan/projectEdit/projectEdit.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  { // 集团统筹 - 编辑页
    name: 'groupProjectEdit',
    path: '/groupPlan/projectEdit/:projectCode',
    component: () => import('@/controller/groupPlan/projectEdit/projectEdit.vue'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  { // 集团统筹 - 历史版本页
    name: 'groupProjectHistory',
    path: '/groupPlan/projectHistoryDetail',
    component: () => import('@/controller/groupPlan/tabPages/projectInfo/historyVersionDetail'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  { // 集团统筹 - 版本对比页
    name: 'groupContrastVersion',
    path: '/groupPlan/projectContrastVersion',
    component: () => import('@/controller/groupPlan/tabPages/projectInfo/contrastVersion'),
    meta: {
      title: '',
      hasPermission: true
    }
  },
  // 项目详情--项目流程
  /***************集团统筹项目流程--委托函流程*************** */
  { // 委托函流程详情
    name: 'GroupEntrustmentFlowDetail',
    path: '/groupPlan/entrustmentFlow/entrustmentFlowDetail',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/entrustmentFlow/entrustmentFlowDetail.vue'),
    meta: {
      title: '委托函流程详情',
      hasPermission: true
    }
  },
  { // 委托函流程新增/编辑
    name: 'GroupEntrustmentFlowEdit',
    path: '/groupPlan/entrustmentFlow/entrustmentFlowEdit',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/entrustmentFlow/entrustmentFlowEdit.vue'),
    meta: {
      title: '委托函流程编辑',
      hasPermission: true
    }
  },
  { // 委托函流程审批
    name: 'GroupEntrustmentFlowApprove',
    path: '/groupPlan/entrustmentFlow/entrustmentFlowApprove',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/entrustmentFlow/entrustmentFlowApprove.vue'),
    meta: {
      title: '委托函流程审批',
      hasPermission: true
    }
  },
  { // 委托函流程驳回
    name: 'GroupEntrustmentFlowReject',
    path: '/groupPlan/entrustmentFlow/entrustmentFlowReject',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/entrustmentFlow/entrustmentFlowReject.vue'),
    meta: {
      title: '委托函流程驳回',
      hasPermission: true
    }
  },
  { // 委托函完成审批
    name: 'GroupEntrustmentFlowCompleteApprove',
    path: '/groupPlan/entrustmentFlow/entrustmentFlowCompleteApprove',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/entrustmentFlow/entrustmentFlowCompleteApprove.vue'),
    meta: {
      title: '委托函完成审批',
      hasPermission: true
    }
  },
  { // 委托函完成审批--无评分评价
    name: 'GroupEntrustmentFlowCompleteApproveNoScore',
    path: '/groupPlan/entrustmentFlow/entrustmentFlowCompleteApproveNoScore',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/entrustmentFlow/entrustmentFlowCompleteApproveNoScore.vue'),
    meta: {
      title: '委托函完成审批',
      hasPermission: true
    }
  },
  { // 委托函完成申请
    name: 'GroupEntrustmentFlowCompleteSubmit',
    path: '/groupPlan/entrustmentFlow/entrustmentFlowCompleteSubmit',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/entrustmentFlow/entrustmentFlowCompleteSubmit.vue'),
    meta: {
      title: '委托函完成申请',
      hasPermission: true
    }
  },
  /***************集团统筹项目流程--计划调整流程*************** */
  { // 计划调整流程详情
    name: 'GroupPlanAdjustFlowDetail',
    path: '/groupPlan/planAdjustFlow/planAdjustFlowDetail',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/planAdjustFlow/planAdjustFlowDetail.vue'),
    meta: {
      title: '计划调整流程详情',
      hasPermission: true
    }
  },
  { // 计划调整流程新增/编辑
    name: 'GroupPlanAdjustFlowEdit',
    path: '/groupPlan/planAdjustFlow/planAdjustFlowEdit',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/planAdjustFlow/planAdjustFlowEdit.vue'),
    meta: {
      title: '计划调整流程编辑',
      hasPermission: true
    }
  },
  { // 计划调整流程审批
    name: 'GroupPlanAdjustFlowApprove',
    path: '/groupPlan/planAdjustFlow/planAdjustFlowApprove',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/planAdjustFlow/planAdjustFlowApprove.vue'),
    meta: {
      title: '计划调整流程编辑',
      hasPermission: true
    }
  },
  { // 计划调整流程驳回
    name: 'GroupPlanAdjustFlowReject',
    path: '/groupPlan/planAdjustFlow/planAdjustFlowReject',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/planAdjustFlow/planAdjustFlowReject.vue'),
    meta: {
      title: '计划调整流程驳回',
      hasPermission: true
    }
  },
  /***************集团统筹项目流程--立项流程*************** */
  { // 立项流程详情
    name: 'GroupLaunchFlowDetail',
    path: '/groupPlan/launchFlow/launchFlowDetail',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/launchFlow/launchFlowDetail.vue'),
    meta: {
      title: '立项流程详情',
      hasPermission: true
    }
  },
  { // 立项流程新增/编辑
    name: 'GroupLaunchFlowEdit',
    path: '/groupPlan/launchFlow/launchFlowEdit',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/launchFlow/launchFlowEdit.vue'),
    meta: {
      title: '立项流程编辑',
      hasPermission: true
    }
  },
  { // 立项流程审批
    name: 'GroupLaunchFlowApprove',
    path: '/groupPlan/launchFlow/launchFlowApprove',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/launchFlow/launchFlowApprove.vue'),
    meta: {
      title: '立项流程审批',
      hasPermission: true
    }
  },
  { // 立项流程驳回
    name: 'GroupLaunchFlowReject',
    path: '/groupPlan/launchFlow/launchFlowReject',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/launchFlow/launchFlowReject.vue'),
    meta: {
      title: '立项流程驳回',
      hasPermission: true
    }
  },
  /***************集团统筹项目流程--预立项流程*************** */
  { // 预立项流程详情
    name: 'GroupBeforeLaunchFlowDetail',
    path: '/groupPlan/beforeLaunchFlow/beforeLaunchFlowDetail',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/beforeLaunchFlow/beforeLaunchFlowDetail.vue'),
    meta: {
      title: '预立项流程详情',
      hasPermission: true
    }
  },
  { // 预立项流程新增/编辑
    name: 'GroupBeforeLaunchFlowEdit',
    path: '/groupPlan/beforeLaunchFlow/beforeLaunchFlowEdit',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/beforeLaunchFlow/beforeLaunchFlowEdit.vue'),
    meta: {
      title: '预立项流程编辑',
      hasPermission: true
    }
  },
  { //预立项流程审批
    name: 'GroupBeforeLaunchFlowApprove',
    path: '/groupPlan/beforeLaunchFlow/beforeLaunchFlowApprove',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/beforeLaunchFlow/beforeLaunchFlowApprove.vue'),
    meta: {
      title: '预立项流程审批',
      hasPermission: true
    }
  },
  { // 预立项流程驳回
    name: 'GroupBeforeLaunchFlowReject',
    path: '/groupPlan/beforeLaunchFlow/beforeLaunchFlowReject',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/beforeLaunchFlow/beforeLaunchFlowReject.vue'),
    meta: {
      title: '预立项流程驳回',
      hasPermission: true
    }
  },
  /***************集团统筹项目流程--变更流程*************** */
  { // 变更流程详情
    name: 'GroupChangeFlowDetail',
    path: '/groupPlan/changeFlow/changeFlowDetail',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/changeFlow/changeFlowDetail.vue'),
    meta: {
      title: '变更流程详情',
      hasPermission: true
    }
  },
  { // 变更流程新增/编辑
    name: 'GroupChangeFlowEdit',
    path: '/groupPlan/changeFlow/changeFlowEdit',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/changeFlow/changeFlowEdit.vue'),
    meta: {
      title: '变更流程编辑',
      hasPermission: true
    }
  },
  { // 变更流程审批
    name: 'GroupChangeFlowApprove',
    path: '/groupPlan/changeFlow/changeFlowApprove',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/changeFlow/changeFlowApprove.vue'),
    meta: {
      title: '变更流程审批',
      hasPermission: true
    }
  },
  { // 变更流程驳回
    name: 'GroupChangeFlowReject',
    path: '/groupPlan/changeFlow/changeFlowReject',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/changeFlow/changeFlowReject.vue'),
    meta: {
      title: '变更流程驳回',
      hasPermission: true
    }
  },
  { // 变更流程-变更详情对比页面
    name: 'GroupChangeFlowContrastDetails',
    path: '/groupPlan/changeFlow/changeFlowContrastDetails',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/changeFlow/changeFlowContrastDetails.vue'),
    meta: {
      title: '变更详情',
      hasPermission: true
    }
  },
  /***************集团统筹项目流程--里程碑流程*************** */
  { // 里程碑流程详情
    name: 'GroupMilestoneFlowDetail',
    path: '/groupPlan/milestoneFlow/milestoneFlowDetail',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/milestoneFlow/milestoneFlowDetail.vue'),
    meta: {
      title: '里程碑流程详情',
      hasPermission: true
    }
  },
  { // 里程碑流程新增/编辑
    name: 'GroupMilestoneFlowEdit',
    path: '/groupPlan/milestoneFlow/milestoneFlowEdit',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/milestoneFlow/milestoneFlowEdit.vue'),
    meta: {
      title: '里程碑流程编辑',
      hasPermission: true
    }
  },
  { // 里程碑流程审批无评价
    name: 'GroupMilestoneFlowApprove',
    path: '/groupPlan/milestoneFlow/milestoneFlowApprove',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/milestoneFlow/milestoneFlowApprove.vue'),
    meta: {
      title: '里程碑流程审批',
      hasPermission: true
    }
  },
  { // 里程碑流程审批有评价
    name: 'GroupMilestoneFlowApprove',
    path: '/groupPlan/milestoneFlow/milestoneFlowApproveJudgment',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/milestoneFlow/milestoneFlowApprove.vue'),
    meta: {
      title: '里程碑流程审批',
      hasPermission: true
    }
  },
  { // 里程碑流程驳回
    name: 'GroupMilestoneFlowReject',
    path: '/groupPlan/milestoneFlow/milestoneFlowReject',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/milestoneFlow/milestoneFlowReject.vue'),
    meta: {
      title: '里程碑流程驳回',
      hasPermission: true
    }
  },
  /***************集团统筹项目流程--结项流程*************** */
  { // 结项流程详情
    name: 'GroupFinishFlowDetail',
    path: '/groupPlan/finishFlow/finishFlowDetail',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/finishFlow/finishFlowDetail.vue'),
    meta: {
      title: '结项流程详情',
      hasPermission: true
    }
  },
  { // 结项流程新增/编辑
    name: 'GroupFinishFlowEdit',
    path: '/groupPlan/finishFlow/finishFlowEdit',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/finishFlow/finishFlowEdit.vue'),
    meta: {
      title: '结项流程编辑',
      hasPermission: true
    }
  },
  { // 结项流程审批
    name: 'GroupFinishFlowApprove',
    path: '/groupPlan/finishFlow/finishFlowApprove',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/finishFlow/finishFlowApprove.vue'),
    meta: {
      title: '结项流程审批',
      hasPermission: true
    }
  },
  { // 结项流程审批-打分页面
    name: 'GroupFinishFlowApproveScore',
    path: '/groupPlan/finishFlow/finishFlowApproveScore',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/finishFlow/finishFlowApproveScore.vue'),
    meta: {
      title: '结项流程审批',
      hasPermission: true
    }
  },
  { // 结项流程驳回
    name: 'GroupFinishFlowReject',
    path: '/groupPlan/finishFlow/finishFlowReject',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/finishFlow/finishFlowReject.vue'),
    meta: {
      title: '结项流程驳回',
      hasPermission: true
    }
  },
  /***************集团统筹项目流程--终止流程*************** */
  { // 终止流程详情
    name: 'GroupTerminateFlowDetail',
    path: '/groupPlan/terminateFlow/terminateFlowDetail',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/terminateFlow/terminateFlowDetail.vue'),
    meta: {
      title: '终止流程详情',
      hasPermission: true
    }
  },
  { // 终止流程新增/编辑
    name: 'GroupTerminateFlowEdit',
    path: '/groupPlan/terminateFlow/terminateFlowEdit',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/terminateFlow/terminateFlowEdit.vue'),
    meta: {
      title: '终止流程编辑',
      hasPermission: true
    }
  },
  { // 终止流程审批
    name: 'GroupTerminateFlowApprove',
    path: '/groupPlan/terminateFlow/terminateFlowApprove',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/terminateFlow/terminateFlowApprove.vue'),
    meta: {
      title: '终止流程审批',
      hasPermission: true
    }
  },
  { // 终止流程驳回
    name: 'GroupTerminateFlowReject',
    path: '/groupPlan/terminateFlow/terminateFlowReject',
    component: () => import('@/controller/groupPlan/tabPages/projectProcess/flowComponents/terminateFlow/terminateFlowReject.vue'),
    meta: {
      title: '终止流程驳回',
      hasPermission: true
    }
  }
]

// 这里保存的是来自root的初始化后的router实例
let router = null
export default { inRouterMap, outRouterMap }
export function getRouter () {
  if (!router) {
    return null
  }
  return router
}

export function setRouter (routerIns) {
  router = routerIns
}
