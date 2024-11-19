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
          <div style="width: 16px;margin-right:10px">
            <img src="../../../../../assets/icons/里程碑.svg" alt="">
          </div>
        </template>
        <template v-slot:header style="display:flex">
          <el-button
            v-if="(!item.applicationStatus||item.applicationStatus==='')&&item.milestoneLeaderUid===userId&&isShowStartBtn"
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
                <el-form-item label="里程碑责任人：" prop="milestoneLeader">
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
                    :content="item.progressStarter || item.milestoneLeader"
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
import API from './API_milestoneManagement'
import APIProject from '@/serve/API_project'
import projectPanel from '@/controller/components/projectPanel'
import { getStore } from '@/store'
export default {
  components: {
    projectPanel
  },
  data () {
    return {
      milestoneList: [],
      projectCode: '',
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      isShowStartBtn: false
    }
  },
  created () {
    this.projectCode = this.$route.params.projectCode || ''
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    this.getMilestoneList()
    this.isShowMilestoneStart()
  },
  methods: {
    startProgress (milestoneCode) { //发起里程碑流程
      this.$router.push({
        path: '/milestone/milestoneProcessEdit',
        query: {
          projectCode: this.projectCode, // 项目编码
          operate: '01', // 01发起流程 02编辑流程，
          milestoneCode: milestoneCode
          // milestoneFinishApplicationId: milestoneFinishApplicationId //里程碑完成申请表id
        }
      })
    },
    editProgress (milestoneFinishApplicationId, milestoneCode, businessSerialNumber) { //编辑流程
    // 编辑校验同发起按钮的校验
      if (!this.isShowMilestoneStart) {
        this.$message({
          message: '您没有权限进行编辑',
          type: 'error',
          showClose: true
        })
        return
      }
      this.$router.push({
        path: '/milestone/milestoneProcessEdit',
        query: {
          projectCode: this.projectCode,
          operate: '02', //01发起流程 02编辑流程
          milestoneFinishApplicationId: milestoneFinishApplicationId,
          milestoneCode: milestoneCode,
          businessSerialNumber: businessSerialNumber
        }
      })
    },
    watchProgress (milestoneFinishApplicationId, businessSerialNumber) { //查看流程
      this.$router.push({
        path: '/milestone/milestoneProcessDetail',
        query: {
          projectCode: this.projectCode,
          milestoneFinishApplicationId: milestoneFinishApplicationId,
          approveNo: businessSerialNumber
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
    },
    getMilestoneList () {
      // let searchParams = { projectCode: 'test-001' }
      let searchParams = { projectCode: this.projectCode }
      API.getMilestoneList(searchParams)
        .then(res => {
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
                break
            }
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
    isShowMilestoneStart () {
      APIProject.isShowMilestoneStart(this.projectCode)
        .then(res => {
          this.isShowStartBtn = res
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取发起按钮权限失败',
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
.milestoneProcessList /deep/{
  .project-panel .panel-body.is-expand{
    padding: 20px 30px;
  }
  .project-panel .panel-header .header-title{
    max-width: 800px;
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
    color: #333;
    .el-form-item__label{
      color: #333;
    }
 }
  .el-row:not(:nth-child(1)){
    margin-top: 5px;
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
