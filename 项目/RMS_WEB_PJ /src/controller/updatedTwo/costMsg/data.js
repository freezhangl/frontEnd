var typeArr = [
  { cname: '合作开发费-委内', name: 'budgetInCommittee' },
  { cname: '合作开发费-委外', name: 'budgetOutsourcing' },
  { cname: '自有人工（人月）', name: 'laborBudget' },
  { cname: '自有人工成本（万元）', name: 'laborCosts' },
  { cname: '差旅费（万元）', name: 'travelExpenses' },
  { cname: '会议费（万元）', name: 'conferenceExpenses' },
  { cname: '资产折旧/摊销（万元）', name: 'assetDepreciation' },
  { cname: '其他成本（万元）', name: 'otherCosts' }
]
var arr = []
for (let i = 0; i < 7; i++) {
  arr.push({
    year: 2018 + i,
    cname: '',
    groupReply:
      // 集团批复
      {
        cdfInsource: 118 + i, // 合作开发费-委内
        cdfOutsource: 118 + i, // 合作开发费-委外
        theirOwnManpower: 118 + i, // 自有人工（人月）
        theirOwnManpowerCost: 118 + i, // 自有人工成本（万元）
        travelCharge: 118 + i, // 差旅费（万元）
        coferemceExpense: 118 + i, // 会议费（万元）
        amortize: 118 + i, // 资产折旧/摊销（万元）
        otherCost: 118 + i // 其他成本（万元）
      },
    planCost:
      // 计划成本
      {
        cdfInsource: 118 + i, // 合作开发费-委内
        cdfOutsource: 118 + i, // 合作开发费-委外
        theirOwnManpower: 118 + i, // 自有人工（人月）
        theirOwnManpowerCost: 118 + i, // 自有人工成本（万元）
        travelCharge: 118 + i, // 差旅费（万元）
        coferemceExpense: 118 + i, // 会议费（万元）
        amortize: 118 + i, // 资产折旧/摊销（万元）
        otherCost: 118 + i // 其他成本（万元）
      },
    axtualOutlay:
      // 实际支出
      {
        cdfInsource: 118 + i, // 合作开发费-委内
        cdfOutsource: 118 + i, // 合作开发费-委外
        theirOwnManpower: 118 + i, // 自有人工（人月）
        theirOwnManpowerCost: 118 + i, // 自有人工成本（万元）
        travelCharge: 118 + i, // 差旅费（万元）
        coferemceExpense: 118 + i, // 会议费（万元）
        amortize: 118 + i, // 资产折旧/摊销（万元）
        otherCost: 118 + i // 其他成本（万元）
      }
  })
}

arr.push({
  year: '',
  cname: '合计',
  groupReply:
    // 集团批复
    {
      cdfInsource: 118, // 合作开发费-委内
      cdfOutsource: 118, // 合作开发费-委外
      theirOwnManpower: 118, // 自有人工（人月）
      theirOwnManpowerCost: 118, // 自有人工成本（万元）
      travelCharge: 118, // 差旅费（万元）
      coferemceExpense: 118, // 会议费（万元）
      amortize: 118, // 资产折旧/摊销（万元）
      otherCost: 118 // 其他成本（万元）
    },
  planCost:
    // 计划成本
    {
      cdfInsource: 118, // 合作开发费-委内
      cdfOutsource: 118, // 合作开发费-委外
      theirOwnManpower: 118, // 自有人工（人月）
      theirOwnManpowerCost: 118, // 自有人工成本（万元）
      travelCharge: 118, // 差旅费（万元）
      coferemceExpense: 118, // 会议费（万元）
      amortize: 118, // 资产折旧/摊销（万元）
      otherCost: 118 // 其他成本（万元）
    },
  axtualOutlay:
    // 实际支出
    {
      cdfInsource: 118, // 合作开发费-委内
      cdfOutsource: 118, // 合作开发费-委外
      theirOwnManpower: 118, // 自有人工（人月）
      theirOwnManpowerCost: 118, // 自有人工成本（万元）
      travelCharge: 118, // 差旅费（万元）
      coferemceExpense: 118, // 会议费（万元）
      amortize: 118, // 资产折旧/摊销（万元）
      otherCost: 118 // 其他成本（万元）
    }
})
var rowArr = []
for (let i = 0; i < typeArr.length; i++) {
  let obj = {}
  for (let j = 0, len = arr.length; j < len; j++) {
    obj[arr[j].year + 'groupReply'] = arr[j].groupReply[typeArr[i].name]
    obj[arr[j].year + 'planCost'] = arr[j].planCost[typeArr[i].name]
    obj[arr[j].year + 'axtualOutlay'] = arr[j].axtualOutlay[typeArr[i].name]
  }
  rowArr.push(obj)
}
export { arr, rowArr }
