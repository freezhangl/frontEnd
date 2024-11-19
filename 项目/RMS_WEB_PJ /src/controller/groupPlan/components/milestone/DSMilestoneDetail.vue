
<template>
  <div class="detailListMilestone" v-if="receiveData && receiveData.length>0">
    <projectPanel title="里程碑" @changeExpand="changeExpand" :show-expand="showExpand">
      <div class="body-con">
        <!-- 列表 -->
        <projectPanel
          :title="listItem.milestoneName"
          class="addcon"
          style="border: 1px solid #E9E9E9;"
          :class="{'highlightStyleTitle':getHighlightStyle(listItem,'milestoneName'),'allHighlightStyle':getAllHighlightStyle(listItem)}"
          v-for="listItem in receiveData"
          :key="listItem.id"
          :expand-prop="setExpand(listItem)">
          <template v-slot:img>
            <div style="width:16px;margin-right:10px">
              <img src="@/assets/icons/里程碑.svg" alt="" style="margin-right:10px">
            </div>
          </template>
          <el-form
            :model="listItem"
            label-position='right'
            :ref="'listItem'+listItem.id"
            label-width="120px">
            <el-row style="padding-left:60px">
              <el-col :span="15">
                <el-form-item
                  label="里程碑名称:"
                  prop="milestoneName"
                  :class="{'highlightStyle':getHighlightStyle(listItem,'milestoneName')}"
                >
                  <span>{{listItem.milestoneName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="计划完成时间:"
                  prop="planFinishTime"
                  :class="{'highlightStyle':getHighlightStyle(listItem,'planFinishTime')}"
                >
                  <span>{{listItem.planFinishTime}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="padding-left:60px">
              <el-col :span="15">
                <el-form-item
                  label="需求单位:"
                  prop="demandUnit1"
                  :class="{'highlightStyle':getHighlightStyle(listItem,'demandUnitName')}">
                  <div
                    class="item"
                    v-for="item in listItem.demandUnit"
                    :key="item.id"
                    :class="{'highlightStyle':item.highlightProp}">
                    <span>{{item.demandUnitName}}</span>
                    <span>;</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="里程碑评审人:"
                  prop="milestoneReviewer"
                  :class="{'highlightStyle':getHighlightStyle(listItem,'milestoneReviewer')}">
                  <span>{{listItem.milestoneReviewer}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="padding-left:60px">
              <el-col :span="15">
                <el-form-item
                  label="承担单位:"
                  prop="undertaker">
                  <div
                    class="item"
                    v-for="item in listItem.commitmentUnit"
                    :key="item.id"
                    :class="{'highlightStyle':item.highlightProp}">
                    <span>{{item.commitmentUnitName}}</span>
                    <span>;</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="里程碑责任人:"
                  prop="milestoneLeader"
                  :class="{'highlightStyle':getHighlightStyle(listItem,'milestoneLeader')}">
                  <span>{{listItem.milestoneLeader}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="180px"
                  label-position="right"
                  label="里程碑描述:"
                  prop="milestoneDescription"
                  :class="{'highlightStyle':getHighlightStyle(listItem,'milestoneDescription')}"
                >
                  <span>{{listItem.milestoneDescription}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="180px"
                  label-position="right"
                  label="预期成果信息:"
                  prop='resultList'
                >
                  <div class="tabcon1">
                    <div
                      class="item"
                      v-for="(item,i) in listItem.resultList"
                      :key="item.id"
                      v-show='listItem.resultList'
                      :class="{'highlightStyle':item.highlightProp}">
                      <span>{{item.achievementName}}</span>
                      <span v-if="i+1!=listItem.resultList.length">;</span>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </projectPanel>
      </div>
    </projectPanel>
  </div>
</template>
<script>
import selfTable from '@/components/table/index'
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_project'
export default {
  props: ['receiveData', 'showExpand'],
  components: {
    projectPanel
  },
  data () {
    return {
      // maxAndMin: { MAX: 0, MIN: 0 },
      milestoneLeaderOptions: [],
      milestoneShowProps: ['milestoneName', 'planFinishTime', 'demandUnit1', 'milestoneReviewer', 'undertaker', 'milestoneLeader', 'milestoneDescription', 'linkResultFlag']
    }
  },
  mounted () {
    // this.isShowMilestone()
  },
  created () {
  },
  watch: {
    receiveData (newValue, oldValue) {
      // if (newValue) {
      //   this.$emit('detailTableMilestoneShowOrHide', newValue.length > 0)
      // }
      // debugger
      if (newValue && newValue.length > 0 && newValue.toString()) {
        this.$emit('detailTableMilestoneShowOrHide', newValue.length > 0)
      } else {
        this.$emit('detailTableMilestoneShowOrHide', false)
      }
    }
  },
  methods: {
    isShowMilestone () { //查询当前用户所在公司里程碑数量配置 如果最大值为 0 则不展示
      API.isShowMilestones()
        .then(res => {
          // res = { MAX: 2, MIN: 1 }
          this.maxAndMin = res
          this.$emit('detailTableMilestoneShowOrHide', res.MAX > 0)
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询当前用户所在公司里程碑数量配置失败',
            type: 'error',
            showClose: true
          })
        })
    },
    milestoneLeaderFormatter (val) {
      // 里程碑责任人过滤
      let status = ''
      this.milestoneLeaderOptions.some(item => {
        if (val === item.projectRole) {
          status = item.userName
        }
      })
      return status
    },
    changeExpand (isExpand) {
      this.$emit('changeExpand', isExpand)
    },
    getHighlightStyle (listItem, prop) {
      if (listItem.highlightProps && listItem.highlightProps[prop]) {
        return true
      } else {
        return false
      }
    },
    getAllHighlightStyle (listItem) {
      if (listItem.newMileStones) {
        return true
      }
      return false
    },
    //是否需要展开
    setExpand (listItem) {
      //新增里程碑和无变化里程碑不需要展开，返回false
      /* if (listItem.newMileStones || listItem.sameMileStones) {
        return false
      }
      return true */
      return listItem.isExpanded !== 'undefined' && !listItem.isExpanded
    }
  }
}
</script>
<style lang="scss" scoped>
.body-con /deep/{
    .el-form-item .el-input__inner{
      width : 100%;
    }
    .el-select{
      width:100%;
    }
    .el-date-editor{
      width:100%;
    }
    .project-panel .panel-body{
      margin-bottom: 0;
    }
    .project-panel .panel-body.is-expand {
      padding: 20px 30px 0px 15px;
      height: auto;
    }
    .addcon{
       border: 1px solid #E9E9E9;
       margin-bottom: 20px;
       &:last-child{
         margin-bottom: 0;
       }
       .wrap{
         word-wrap:break-word
        //  width: 100%;
        //  white-space: nowrap;
        //  overflow: hidden;
       }
    }
    .tabcon1 /deep/{
        padding: 0px 15px;
        // border: 1px solid #E5E5E5;
        float: left;
        width: 100%;
        box-sizing: border-box;
        border-radius: 4px;
        font-size: 14px;
      .butt{
        float: right;
        height: 100%;
        i{
          // color: #0b82ff;
        }
      }
      .item{
        float: left;
        margin-right: 10px;
      }
      .close{
        cursor: pointer;
        font-size: 16px;
        color: #6666;
        margin-left: 3px;
      }
    }
    .highlightStyleTitle .header-title{
      color: #FF3F3B !important;
    }
    .highlightStyle{
      color: #FF3F3B;
    }
    .highlightStyle .el-form-item__content{
      color: #FF3F3B;
    }
    .allHighlightStyle{
      border: 1px solid #FF3F3B !important;
    }
  }
</style>
