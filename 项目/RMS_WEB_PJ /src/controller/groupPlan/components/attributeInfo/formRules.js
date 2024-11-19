export const formRules = [{
  key: 'devMode', //开展模式
  value: ['["DM_A"]', '["DM_A","DM_B"]', '["DM_B","DM_A"]'],
  attrs: [
    {
      key: 'selfResearchContent', //自研内容
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    }
  ]
}, {
  key: 'devMode',
  value: ['["DM_B"]', '["DM_A","DM_B"]', '["DM_B","DM_A"]'],
  attrs: [
    {
      key: 'internalDemandUnitRd', //内部委托研发单位
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    },
    {
      key: 'internalDemandUnitRdManager', //内部委托研发单位负责人
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    },
    {
      key: 'internalDemandUnitRdContent', //内部委托研发内容
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    },
    {
      key: 'externalProjectUnitRd', //外部委托研发单位
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    },
    {
      key: 'externalProjectUnitRdManager', //外部委托研发单位<br>负责人
      attrs: {
        'isRequire': '1',
        'isReadonly': '0',
        'isVisible': '0'
      }
    },
    {
      key: 'externalProjectUnitRdContent', //外部委托研发内容
      attrs: {
        'isRequire': '1',
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
