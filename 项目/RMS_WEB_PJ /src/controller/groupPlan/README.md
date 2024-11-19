groupPlan（集团统筹）下的目录结构：
  components---->存放各类组件
    basic---->基本信息
    attribute---->属性信息
    teamInfo---->团队信息
    budget---->预算成本
    subproject---->子项目
    milestone---->里程碑
    attachments---->文档资料(流程单据页面中使用的附件上传下载组件)
  
  tabPages---->存放各tab标签页面
    projectInfo---->项目信息
    taskProgress---->任务进展
    costInfo---->成本信息
    projectProgress---->项目流程
    timeInfo---->工时信息
    projectDoc---->文档资料
    purchaseInfo---->采购信息
    undertakeView---->承担单位视图
  
  projectDetail---->存放集团统筹四类项目的详情页面
    DGprojectDetail---->集团统筹需求单位一般支撑包项目详情页(demandGeneralProjectDetail)
    DSprojectDetail---->集团统筹需求单位非一般支撑包项目详情页(demandSpecialProjectDetail)
    UGprojectDetail---->集团统筹承担单位一般支撑包项目详情页(undertakeGeneralProjectDetail)
    USprojectDetail---->集团统筹承担单位非一般支撑包项目详情页(undertakeSpecialProjectDetail)

  （*注:暂时分开，后续按需合并）

  projectEdit---->存放集团统筹四类项目的新增/编辑页面
    DGprojectEdit---->集团统筹需求单位一般支撑包项目新增/编辑页(demandGeneralProjectEdit)
    DSprojectEdit---->集团统筹需求单位非一般支撑包项目新增/编辑页(demandSpecialProjectEdit)
    UGprojectEdit---->集团统筹承担单位一般支撑包项目新增/编辑页(undertakeGeneralProjectEdit)
    USprojectEdit---->集团统筹承担单位非一般支撑包项目新增/编辑页(undertakeSpecialProjectEdit)

  （*注:暂时分开，后续按需合并）

为了方便使用组件/页面引入，对集团统筹项目下的各类型进行以下名词缩写定义：
  需求方(demand)---->D
  承担方(undertake)---->U
  一般支撑包(general)---->G
  非一般支撑包(special)---->S

对于统一的组件不需要细分，若各类项目组件存在较大差异，处理成多个组件时需要进行命名区分：
  例如：
    case1：预算成本：只有需求方与承担方差异，则在components/budget/下区分文件夹命名：Dbudget与Ubudget；
    case2：预算成本：承担方、需求方、一般/非一般支撑包四个都不一样，则在components/budget/下建四个文件夹：DGbudget、DSbudget、UGbudget、USbudget

对于项目编辑、项目详情页面下的tab切换页面内容也类似。

