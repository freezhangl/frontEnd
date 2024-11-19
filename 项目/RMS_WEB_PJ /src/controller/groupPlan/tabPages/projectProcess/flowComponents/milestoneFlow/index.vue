<template>
  <div class="milestoneProcessList">
    <div v-if="milestoneList.length>0">
      <project-panel
        class="project-panel"
        :title="item.milestoneName"
        style="border:1px solid #E9E9E9"
        :show-expand='false'
        v-for="item in milestoneList"
        :key="item.id">
        <template v-slot:img>
          <img src="@/assets/icons/里程碑.svg" alt="" style="margin-right:10px">
        </template>
        <template v-slot:header style="display:flex">
          <el-button
            v-if="(!item.applicationStatus||item.applicationStatus==='')&&item.milestoneLeaderUid===userId"
            @click="startProgress(item.milestoneCode)"
            class="normal-btn reset">发起流程</el-button>
          <el-button
            v-if="item.applicationStatus==='0'&&item.milestoneLeaderUid===userId"
            @click="editProgress(item.milestoneFinishApplicationId,item.milestoneCode,item.businessSerialNumber)"
            class="normal-btn reset">编辑流程</el-button>
          <el-button
            v-if="item.applicationStatus&&item.applicationStatus!==''"
            @click="watchProgress(item.milestoneFinishApplicationId,item.businessSerialNumber)"
            class="normal-btn reset">查看流程</el-button>
        </template>
        <div class="progress-body">
          <el-form
            label-width="110px"
            :inline="true">
            <el-row>
              <el-col :span="8">
                <el-form-item label="里程碑负责人：" prop="milestoneLeader">
                  <el-tooltip
                    :content="item.milestoneLeader"
                    placement="top"
                    effect="dark">
                    <div>{{item.milestoneLeader}}</div>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="计划完成时间：" prop="planFinishTime">
                  <el-tooltip
                    :content="item.planFinishTime"
                    placement="top"
                    effect="dark">
                    <div>{{item.planFinishTime}}</div>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态：" prop="status">
                  <el-tooltip
                    :content="item.status"
                    placement="top"
                    effect="dark">
                    <div>{{item.status}}</div>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="!(item.applicationStatus==='' || item.applicationStatus==='草稿')">
              <el-col :span='8'>
                <el-form-item
                  label="发起人："
                  prop="progressStarter">
                  <el-tooltip
                    :content="item.progressStarter"
                    placement="top"
                    effect="dark">
                    <div>{{item.progressStarter?item.progressStarter:item.milestoneLeader}}</div>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span='8'>
                <el-form-item
                  label="流程发起时间："
                  prop="progressStartTime"
                >
                  <el-tooltip
                    :content="item.progressStartTime"
                    placement="top"
                    effect="dark">
                    <div>{{item.progressStartTime}}</div>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span='8'>
                <el-form-item
                  label="流程结束时间："
                  prop="progressEndTime"
                >
                  <el-tooltip
                    :content="item.progressEndTime"
                    placement="top"
                    effect="dark">
                    <div>{{item.progressEndTime}}</div>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </project-panel>
    </div>
    <div class="nolist" v-else style="padding-top:30px;text-align:center;color:#333333;">暂无里程碑流程信息</div>
  </div>
</template>
<script>
import API from '@/serve/API_milestoneManagement'
import businessAPI from '@/serve/API_businessFlow'
import projectPanel from '@/controller/components/projectPanel'
import { getStore } from '@/store'
export default {
  components: {
    projectPanel
  },
  data () {
    return {
      developPackage: this.$route.query.developPackage, //是否研发包项目,0否，1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectCP: '',
      urlParam: '/groupPlan/milestoneFlow/', // 里程碑流程单据新增/编辑/详情对应的url前缀
      businessType: '', // 业务单据类型值编码
      milestoneList: [],
      projectCode: '',
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid
    }
  },
  created () {
    this.projectCode = this.$route.params.projectCode || ''

    this.projectCategory = this.$route.query.projectCategory || ''
    let isPackage = this.$route.query.developPackage === 'IS_RD_0' ? 's' : 'g'
    this.projectCP = this.projectCategory + isPackage
    switch (this.projectCategory) {
      case 'd':
        this.businessType = 'BT-DEMAND-MILESTONE-FINISH'
        break
      case 'u':
        this.businessType = 'BT-UNDERTAKER-MILESTONE-FINISH'
        break
    }
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    this.getMilestoneList()
  },
  methods: {
    getMilestoneList () {
      let searchParams = { projectCode: this.projectCode }
      API.getMilestoneList(searchParams)
        .then(res => {
          res.forEach(element => {
            res.forEach(element => {
              switch (element.status) {
                case '0':
                  element.status = '草稿'
                  break
                case '1':
                  element.status = '已生效'
                  break
                case '2':
                  element.status = '已完成'
                  break
                case '3':
                  element.status = '已作废'
                  break
                case '4':
                  element.status = '审批中'
                  break
                case '5':
                  element.status = '已终止'
                  break
                case null:
                  element.status = ''
                  break
                case '':
                  element.status = ''
              }
            })
            this.milestoneList = res
          })
          this.milestoneList = res
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '里程碑完成流程列表获取失败',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //发起里程碑流程
    startProgress (milestoneCode) {
      let param = {
        businessType: this.businessType, // 立项单据业务类型编码
        projectCode: this.projectCode
      }
      businessAPI.validateApprove(param)
        .then(res => {
          if (res === true) {
            this.$router.push({
              path: this.urlParam + 'milestoneFlowEdit',
              query: {
                projectCode: this.projectCode, // 项目编码
                newMilestone: 'true', // true发起流程 false编辑流程，
                milestoneCode: milestoneCode,
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
                // milestoneFinishApplicationId: milestoneFinishApplicationId //里程碑完成申请表id
              }
            })
          } else {
            this.$message({
              message: '不能重复发起里程碑流程或当前项目信息未填写完整，请检查！',
              type: 'warning',
              showClose: true
            })
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起里程碑流程失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 编辑流程
    editProgress (milestoneFinishApplicationId, milestoneCode, businessSerialNumber) {
      let param = {
        approveNo: businessSerialNumber, // 修改单据时必填业务流水号
        businessType: this.businessType, // 立项单据业务类型编码
        projectCode: this.projectCode
      }
      businessAPI.validateApprove(param)
        .then(res => {
          if (res === true) {
            this.$router.push({
              path: this.urlParam + 'milestoneFlowEdit',
              query: {
                projectCode: this.projectCode,
                newMilestone: 'false',
                milestoneFinishApplicationId: milestoneFinishApplicationId,
                milestoneCode: milestoneCode,
                businessSerialNumber: businessSerialNumber,
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
              }
            })
          } else {
            this.$message({
              message: '不能编辑里程碑申请或当前项目信息未填写完整，请检查！',
              type: 'warning',
              showClose: true
            })
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '编辑里程碑流程失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 查看流程
    watchProgress (milestoneFinishApplicationId, businessSerialNumber) {
      if (!milestoneFinishApplicationId) {
        this.$message({
          type: 'warning',
          message: '该里程碑为历史数据，无审批流程'
        })
        return
      }
      this.$router.push({
        path: this.urlParam + 'milestoneFlowDetail',
        query: {
          projectCode: this.projectCode,
          milestoneFinishApplicationId: milestoneFinishApplicationId,
          approveNo: businessSerialNumber,
          developPackage: this.developPackage,
          projectCategory: this.projectCategory
        }
      })
    },
    scrollWindow () {
      let doc = document.documentElement || document.body
      let sTop = doc.scrollTop
      let cHei = doc.clientHeight
      let sHei = doc.scrollHeight

      if (sTop > 500) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.milestoneProcessList /deep/{
  .project-panel .panel-body.is-expand{
    padding: 20px 30px;
  }
  .nolist{
    // margin-top: 15px;
    height: 80px;
    box-sizing: border-box;
    background-color: #fff;
    -webkit-box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    padding: 10px 25px 20px;
    z-index: -100;
  }
 .el-form-item {
    margin-bottom: 0px;
 }
.project-panel {
  margin-bottom: 20px;
  .panel-body{
    margin-bottom: 0;
  }
  &:last-child{
    margin-bottom: 0px;
  }
  .panel-header{
     -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 50px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0 30px;
    padding-right: 20px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom: 1px solid #E5E5E5;
  }
}
}
</style>
