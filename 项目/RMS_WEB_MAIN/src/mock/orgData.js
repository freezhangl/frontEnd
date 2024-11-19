var orgList = [
  {
    id: 1,
    cname: '集团总公司',
    children: [
      { id: 2, cname: '组织分布', children: [] },
      { id: 3, cname: '组织分部', children: [] },
      { id: 4,
        cname: '中移信息技术有限公司',
        children: [
          { id: 5, cname: '综合业务部' },
          { id: 6, cname: '人力部' },
          { id: 7, cname: '安全管理部' },
          { id: 8, cname: '北京业务支持中心' },
          { id: 9, cname: '采购中心' },
          { id: 10, cname: '大数据平台部' },
          { id: 10, cname: '大数据应用部' },
          { id: 10, cname: '电子渠道运营中心' },
          { id: 10, cname: '工程建设部' },
          { id: 10, cname: '国际业务运营中心' },
          { id: 10, cname: '基础平台部' }
        ]
      }
    ]
  },
  {
    id: '1-1',
    cname: '组织部门2',
    children: []
  }
]
export default orgList
