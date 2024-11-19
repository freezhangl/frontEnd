export const formRules = [{
  key: 'demandsSources', //需求来源
  value: 'NS_UEE',
  attrs: [
    {
      key: 'externalProjectUnit', //外部需求单位
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    },
    {
      key: 'externalProject', //外部需求单位项目经理
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    }
  ]
}, {
  key: 'demandsSources', //需求来源
  value: 'NS_UIE',
  attrs: [
    {
      key: 'internalDemandUnit', //内部需求单位项目编码
      attrs: {
        'isRequire': '1',
        'isReadonly': '1',
        'isVisible': '0'
      }
    },
    {
      key: 'internalProjectManager', //内部需求单位项目经理
      attrs: {
        'isRequire': '1',
        'isReadonly': '1',
        'isVisible': '0'
      }
    },
    {
      key: 'internalProjectCode', //内部需求单位<br>项目编码
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    },
    {
      key: 'internalProjectName', //内部需求单位项目名称
      attrs: {
        'isRequire': '1',
        'isReadonly': '1',
        'isVisible': '0'
      }
    }
  ]
}, {
  key: 'devMode', //开展模式
  value: ['["DM_B"]', '["DM_A","DM_B"]', '["DM_B","DM_A"]'],
  attrs: [
    {
      key: 'devUnit', //委托研发<br>单位
      attrs: {
        'isRequire': '0',
        'isReadonly': '0',
        'isVisible': '0'
      }
    },
    {
      key: 'devProjectManager', //委托研发单位项目经理
      attrs: {
        'isRequire': '0',
        'isReadonly': '0',
        'isVisible': '0'
      }
    }
  ]
}, {
  key: 'self_projectlevel', //本单位项目级别
  value: ['COMPANY-PL-COLLEGE'], //院级
  attrs: [
    {
      key: 'director_yuan', //院主管
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    },
    {
      key: 'projectDirector', //项目总监
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    }
  ]
}, {
  key: 'self_projectlevel', //本单位项目级别
  value: ['COMPANY-PL-INSTITUTE'], //所级
  attrs: [
    {
      key: 'director_suo', //所主管
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    }
  ]
}, {
  key: 'test_items', //是否测试项目
  value: ['IS_TP_1'], //是
  attrs: [
    {
      key: 'testtype', //测试任务类型
      attrs: {
        'isRequire': '0',
        'isReadonly': '0',
        'isVisible': '0'
      }
    }
  ]
}]
