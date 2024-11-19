import Mock from 'mockjs'

export const orgListData = Mock.mock({
  'records|10': [
    {
      orgId: '@id',
      orgName: '@string("lower",10)',
      orgRoute: '00000000000000000000-',
      shortName: '@string("lower",10)'
    }
  ]
})

export const testData = Mock.mock({
  'string|1-10': '★'
})

export const userSyncData = Mock.mock({
  'userSyncList|10': [
    {
      id: '1',
      userAccount: '@email',
      givenName: '@cname',
      mobilePhone: '15555555555',
      companyName: '@string("lower",10)',
      'operationType|1': ['新增/修改', '失效'],
      syncTime: '2020-03-01 11:00',
      'syncStatus|1': ['1', '0']
    }
  ]
})

export const commomFunction = Mock.mock({
  commomFuncList: [
    { functionIcon: 'jihuashenqing.svg', resName: '计划申请', rootResName: '研发计划', resCode: '13' },
    { functionIcon: 'xiangmuchaxun.svg', resName: '项目查询', rootResName: '项目管理', resCode: '14' },
    { functionIcon: 'gongshitianbao.svg', resName: '工时填报', rootResName: '项目管理', resCode: '15' },
    { functionIcon: 'shujuzidian.svg', resName: '数据字典', rootResName: '系统管理', resCode: '16' },
    { functionIcon: 'xiangmujiesuan.svg', resName: '项目结算', rootResName: '项目管理', resCode: '17' },
    { functionIcon: 'xitongpeizhi.svg', resName: '系统配置', rootResName: '系统管理', resCode: '18' },
    { functionIcon: 'xiangmubiangeng.svg', resName: '项目变更', rootResName: '项目管理', resCode: '19' },
    { functionIcon: 'lichengbei.svg', resName: '里程碑管理', rootResName: '项目管理', resCode: '20' },
    { functionIcon: 'juesefuquan.svg', resName: '角色赋权', rootResName: '基础服务', resCode: '21' }/* ,
    { functionIcon: 'addfunction.svg', resName: '添加功能' } */
  ],
  allFuncList: [
    {
      resName: '研发计划',
      funcList: [
        { id: '1', resCode: '1', resName: '计划编制', functionIcon: 'jihuabianzhi.svg', rootResName: '研发计划' },
        { id: '2', resCode: '2', resName: '计划下达', functionIcon: 'jihuaxiada.svg', rootResName: '研发计划' }
      ]
    },
    {
      resName: '项目管理',
      funcList: [
        { id: '3', resCode: '3', resName: '立项申请', functionIcon: 'lixiangshenqing.svg', rootResName: '项目管理' },
        { id: '4', resCode: '4', resName: '里程碑管理', functionIcon: 'lichengbei.svg', rootResName: '项目管理' },
        { id: '9', resCode: '9', resName: '项目变更', functionIcon: 'xiangmubiangeng.svg', rootResName: '项目管理' },
        { id: '10', resCode: '10', resName: '项目终止', functionIcon: 'xiangmuzhongzhi.svg', rootResName: '项目管理' },
        { id: '11', resCode: '11', resName: '项目结项', functionIcon: 'xiangmujiesuan.svg', rootResName: '项目管理' },
        { id: '12', resCode: '12', resName: '项目查询', functionIcon: 'shuiyinchaxun.svg', rootResName: '项目管理' }
      ]
    },
    {
      resName: '系统管理',
      funcList: [
        { id: '5', resCode: '5', resName: '数据字典', functionIcon: 'shujuzidian.svg', rootResName: '系统管理' },
        { id: '6', resCode: '6', resName: '系统配置', functionIcon: 'xitongpeizhi.svg', rootResName: '系统管理' }
      ]
    },
    {
      resName: '基础服务',
      funcList: [
        { id: '7', resCode: '7', resName: '角色赋权', functionIcon: 'juesefuquan.svg', rootResName: '基础服务' },
        { id: '8', resCode: '8', resName: '水印查询', functionIcon: 'shuiyinchaxun.svg', rootResName: '基础服务' }
      ]
    }
  ]
})

export const announcement = Mock.mock({
  'records|10': [
    {
      'id|+1': 1,
      'announcementTitle': '@cparagraph(2)',
      'topFlag|1': [0, 1],
      'announcementTypeCode|1': ['1', '2', '3'],
      'releaseScope|1': [1, 2],
      'validStartDate': '@date(T)',
      'announcementStatus|1': [0, 1]
    }
  ],
  'total': 130,
  'size': 10,
  'current': 1,
  'searchCount': true,
  'pages': 13
})
