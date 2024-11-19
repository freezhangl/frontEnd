import dayjs from 'dayjs'

export function formatDate (val, formater = 'YYYY-MM-DD HH:mm:ss') {
  if (!val) return ''
  return dayjs(val)
    .format(formater)
}

export function roleStateTest (val) {
  return val + 'test'
}

export function isShowToolTip (val, len = 280) {
  // let con = document.getElementById('user-auth-main-right')
  let con = document.getElementsByTagName('body')[0]
  let span = document.createElement('span')
  span.id = 'assistSpan'
  span.style.position = 'absolute'
  span.style.left = '30px'
  span.style.visibility = 'hidden'
  con.appendChild(span)
  span.innerText = val
  let showTip = document.getElementById('assistSpan').offsetWidth > len
  con.removeChild(span)
  return showTip
}

/**
 * 需求单位非一般支撑包，审批意见，牵头和配合 需求单位审批意见过滤处理
 * @param {Array} approvals 审批意见集合
 * @param {Array} projectCompanyList 单位信息
 */
export function setApprovals (approvals, projectCompanyList) {
  //统筹项目需求非一般支撑包
  let demandLeadUnitCode = [] //公司编码
  let demandCoopUnitCode = []
  let demandLeadHQOrgCode = [] //如果是集团公司总部时的组织编码
  let demandCoopHQOrgCode = []
  projectCompanyList.forEach(comp => {
    if (comp.leaderFlag === '1' && comp.type === '1') { //牵头需求
      setDemandUnit(comp, demandLeadHQOrgCode, demandLeadUnitCode)
    } else if (comp.leaderFlag === '0' && comp.type === '1') { //配合需求
      setDemandUnit(comp, demandCoopHQOrgCode, demandCoopUnitCode)
    }
  })
  approvals.forEach(approval => {
    if (approval.segment === '牵头需求部门意见') {
      approval.approvalRecordList = approval.approvalRecordList.filter(ele => {
        return getDemandUnit(ele, demandLeadHQOrgCode, demandLeadUnitCode)
      })
    }
    if (approval.segment === '配合需求部门意见') {
      approval.approvalRecordList = approval.approvalRecordList.filter(ele => {
        return getDemandUnit(ele, demandCoopHQOrgCode, demandCoopUnitCode)
      })
    }
  })
  return approvals
}

function setDemandUnit (comp, demandHQOrgCode, demandUnitCode) {
  if (comp.companyCode === 'hq') {
    demandHQOrgCode.push(comp.organizationCode.slice(0, 8))
  } else {
    demandUnitCode.push(comp.companyCode)
  }
}

function getDemandUnit (ele, demandHQOrgCode, demandUnitCode) {
  if (ele.approveCompanyCode === 'hq') {
    return demandHQOrgCode.indexOf(ele.approveOrgCode.slice(0, 8)) > -1
  } else {
    return demandUnitCode.indexOf(ele.approveCompanyCode) > -1
  }
}
