<template>
  <div class="list-wrapper">
    <p>
      <el-button @click="remind">提醒</el-button>
      <el-button @click="exportData">导出</el-button>
    </p>
    <el-table
      :data="data"
      @selection-change="selectionChange"
      :empty-text="isGet ? '暂无数据' : '请输入查询条件'">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="里程碑名称">
        <template slot-scope="scope">
          <span>
            {{ scope.row.milestoneName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="里程碑当前状态">
        <template slot-scope="scope">{{ status(scope.row.status) }}</template>
      </el-table-column>
      <el-table-column
        label="里程碑计划完成时间">
        <template slot-scope="scope">{{ scope.row.planFinishTime }}</template>
      </el-table-column>
      <el-table-column
        label="里程碑责任人">
        <template slot-scope="scope">{{ scope.row.milestoneLeader }}</template>
      </el-table-column>
      <el-table-column
        label="是否延误">
        <template slot-scope="scope">{{ delayFlag(scope.row) }}</template>
      </el-table-column>
      <el-table-column
        label="所属项目名称">
        <template slot-scope="scope">
          <span @click="toMilestone(scope.row)" class="name-link">
            {{ scope.row.projectName }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-if="total>0"
        @size-change="sizeChange"
        @current-change="currentChange"
        @prev-click="prevClick"
        @next-click="nextClick"
        background
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 50, 100]"
        :current-page.sync="pageNum"
        layout="prev, pager, next, sizes, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getStore } from '@/store'
import ProjectAPI from '@/serve/API_project'
import groupProjectAPI from '@/serve/API_groupPlanProject'
import api from '@/serve/API_projectSearch'
export default {
  props: {
    type: {
      type: String
    },
    form: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      data: [], // 列表数据
      pageNum: 1, // 页码
      pageSize: 10, // 每页显示的数量
      total: 0,
      isGet: false, // 是否请求了数据
      selection: [], // 当前选择的表格数据
      baseUrl: getStore().getters['CONFIG/baseUrl'], // 下载请求url前缀
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      apiType: { // 接口名称
        // key名 = 目录名 + 文件名
        'unit-entrustParentMilestone': { // 本单位 委托项目-单位父项目里程碑
          get: 'queryUnitDemandMilesToneList',
          export: 'queryUnitDemandMilesToneListExport',
          cname: '（本单位）委托项目-单位父项目里程碑'
        },
        'unit-entrustChildMilestone': { // 委托项目-单位子项目里程碑
          get: 'queryUnitUndertakeMilesToneList', // 获取列表数据api名称
          export: 'queryUnitUndertakeMilesToneListExport', // 导出列表数据api名称
          cname: '（本单位）委托项目-单位子项目里程碑'
        },
        'unit-selfIndependentMilestone': { // 自立项目里程碑
          get: 'queryUnitSelfMilesToneList',
          export: 'queryUnitSelfMilesToneListExport',
          cname: '自立项目里程碑'
        },
        'group-entrustParentMilestone': { // 全集团 委托项目-单位父项目里程碑
          get: 'queryDemandMilesToneList', // 获取列表数据api名称
          export: 'queryDemandMilesToneListExport', // 导出列表数据api名称
          cname: '（全集团）委托项目-单位父项目里程碑'
        }
      }
    }
  },
  created () {
    // this.getData()
  },
  methods: {
    // 获取数据
    getData (isReset) {
      this.isGet = true
      if (isReset) {
        this.pageNum = 1 // 页码
        this.pageSize = 10 // 每页显示的数量
      }
      let params = {
        ...this.form,
        pageNum: this.pageNum, // 页码
        pageSize: this.pageSize // 每页显示的数量
      }
      if (params.planEndTime && params.planEndTime.length) {
        params.planFinishStartTime = params.planEndTime[0] // 里程碑计划完成开始时间
        params.planFinishEndTime = params.planEndTime[1] // 里程碑计划完成结束时间
        delete params.planEndTime // 删除原来的时间格式
      }
      const get = this.apiType[this.type].get
      api[get](params)
        .then(res => {
          if (res && res.current === this.pageNum.toString()) {
            this.data = res.milestoneProjects
            this.total = parseInt(res.total)
          }
        })
    },
    // 导出
    async exportData () {
      if (this.selection.length) {
        const exportApi = this.apiType[this.type].export
        axios.request({
          method: 'post',
          url: this.baseUrl + '/rms/milestone/milestoneQuery/v1/3/' + exportApi,
          headers: {
            'Authorization': this.Authorization,
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
          },
          responseType: 'blob',
          data: this.selection.map(item => item.id)
        })
        // api[exportApi](params)
          .then(res => {
            let blob = new Blob([res.data])
            let exportFileName = decodeURI(res.headers['content-disposition'].split('=')[1])
            let fileName = exportFileName.replace('UTF-8\'\'', '')
            // 非IE下载
            if ('download' in document.createElement('a')) {
              let elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else { // IE10+下载
              navigator.msSaveBlob(blob, fileName)
            }
          })
      } else {
        this.$message.warning('请选择需要导出的里程碑！')
      }
    },
    // 选择状态有改变时触发
    selectionChange (selection) {
      this.selection = selection
    },
    // 提醒
    remind () {
      if (this.selection.length) {
        api.remindMilesTone(JSON.stringify(this.selection.map(item => item.id)))
          .then(res => {
            if (res) {
              this.$message.success('提醒成功！')
            }
          })
          .catch(e => {
            this.$message({
              message: e.message || '提示失败，请稍后重试',
              type: 'error',
              showClose: true
            })
          })
      } else {
        this.$message.warning('请选择需要提醒的里程碑！')
      }
    },
    // 改变一页数量
    sizeChange (size) {
      this.pageSize = size
      this.getData()
    },
    // 点击页码
    currentChange (currentPage) {
      this.getData()
    },
    // 上一步
    prevClick (currentPage) {
      this.getData()
    },
    // 下一步
    nextClick (currentPage) {
      this.getData()
    },
    // 是否可以勾选
    isDisable (row) {
      if (row.status === '2' || row.status === '5') { // 已完成|已终止 禁止勾选
        return false
      } else {
        return true
      }
    },
    toMilestone (row) {
      if (this.type === 'unit-selfIndependentMilestone') { // 自立项
        this.unitSelfToLink(row)
      } else if (this.type === 'unit-entrustParentMilestone' || this.type === 'group-entrustParentMilestone') { // 需求单位
        const params = { projectCode: row.projectCode }
        api.queryBaseInfoByCode(params)
          .then(res => {
            this.unitEntrustToLink(res, 'd')
          })
          .catch(e => {
            this.loading = false
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '获取项目信息失败！',
                type: 'error',
                showClose: true
              })
            }
          })
      } else if (this.type === 'unit-entrustChildMilestone') { // 承担单位
        const params = { projectCode: row.projectCode }
        api.queryBaseInfoByCode(params)
          .then(res => {
            this.unitEntrustToLink(res, 'u')
          })
          .catch(e => {
            this.loading = false
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '获取项目信息失败！',
                type: 'error',
                showClose: true
              })
            }
          })
      }
    },
    // 是否 延误
    delayFlag (row) {
      let delayFlag = ''
      if (row.status && parseInt(row.status) === 5) { // 已终止显示 /
        delayFlag = '/'
      } else if (row.delayFlag === '1') {
        delayFlag = '是'
      } else {
        delayFlag = '否'
      }
      return delayFlag
    },
    // 状态判断
    status (val) {
      if (val) {
        let status = ''
        val = parseInt(val)
        switch (val) {
          case 0:
            status = '未完成'
            break
          case 1:
            status = '未完成'
            break
          case 2:
            status = '已完成'
            break
          // case 3:
          //   status = '已作废'
          //   break
          case 4:
            status = '审批中'
            break
          case 5:
            status = '已终止'
            break
          default:
            break
        }
        return status
      }
    },
    // 承担单位 需求单位 跳转页面
    unitEntrustToLink (projectInfo, type) {
      // 判断是否具有权限
      groupProjectAPI.checkUserProjectPermission({ projectCode: projectInfo.projectCode, permissionCode: '01' })
        .then(res => {
          if (res) {
            let path = ''
            if (type === 'u') {
              path = '/groupPlan/projectDetail/' + projectInfo.projectCode + '?developPackage=' + projectInfo.developPackage + '&projectCategory=u'
            } else if (type === 'd') {
              projectInfo.projectCategory = projectInfo.projectCategory === 'PC-DEMAND-UNIT' || projectInfo.projectCategory === 'd' ? 'd' : 'u'
              path = '/groupPlan/projectDetail/' + projectInfo.projectCode + '?developPackage=' + projectInfo.developPackage + '&projectCategory=' + projectInfo.projectCategory
            }
            let { href } = this.$router.resolve({ path })
            // 打开新的窗口
            let $window = window.open(href, '_blank')
          } else {
            this.$message({
              message: '无项目查询权限！',
              showClose: true,
              type: 'warning'
            })
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '用户权限校验失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 自立项 跳转页面
    unitSelfToLink (row) {
      // 判断是否具有权限
      ProjectAPI.verificationPermission({ projectCode: row.projectCode })
        .then(res => {
          let flag = false
          res.forEach(item => {
            if (item === '00' || item === '01') {
              flag = true
            }
          })
          if (flag) {
            let { href } = this.$router.resolve({
              path: '/projectInfo/projectInfo-detail/' + row.projectCode
            })
            // 打开新的窗口
            let $window = window.open(href, '_blank')
          } else {
            this.$message({
              message: '无项目查询权限！',
              showClose: true,
              type: 'warning'
            })
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '用户权限校验失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrapper{
  padding: 20px 30px 30px;
  background-color: #fff;
  & > p{
    text-align: right;
    .el-button {
      @include color($color-blue);
      @include border($color-blue);
    }
  }
  .el-table{
    border: 1px solid #e5e5e5;
    /deep/ tr td.el-table-column--selection > div{
      padding-left: 10px;
    }
    .name-link{
      cursor: pointer;
      @include color($color-blue);
    }
  }
}
.pagination{
  padding: 10px;
  .el-pagination{
    text-align: center;
  }
}
</style>
