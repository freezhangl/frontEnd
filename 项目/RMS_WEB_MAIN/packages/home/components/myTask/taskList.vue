<template>
  <div class="task-list">
    <div class="header">
      <div class="tabs" >
        <el-tabs v-model="businessCategoryCode" @tab-click="handleClick" v-if="hasAuthTag">
          <!-- <el-tab-pane label="计划" name="BC-PLAN"></el-tab-pane> -->
          <el-tab-pane v-if="proTabShow" label="项目" name="BC-PROJECT"></el-tab-pane>
          <el-tab-pane v-if="planTabShow" label="计划" name="BC-PLAN"></el-tab-pane>
          <el-tab-pane v-if="othTabShow" label="其他" name="BC-OTHER"></el-tab-pane>
        </el-tabs>
      </div>
      <span class="more" @click="more" v-if="moreTipShow">更多
        <i class="el-icon-arrow-right"></i>
      </span>
    </div>
    <div
      class="task-details"
      v-if="taskList.length > 0">
      <div
        class="task-detail"
        v-for="(taskData, index) in taskList"
        :key="index">
        <div class="task-content" ref="task-content">
          <el-link :underline="false" @click="gotoDetail(taskData)">
            <el-tooltip
              v-if="taskData.showToolTip"
              :content="taskData.taskTitle || taskData.processInstName || taskData.title"
              effect="dark"
              placement="top">
              <span class="title">{{taskData.taskTitle || taskData.processInstName || taskData.title}}</span>
            </el-tooltip>
            <span class="title" v-else>{{taskData.taskTitle || taskData.processInstName || taskData.title}}</span>
          </el-link>
        </div>
        <div class="relevant-information">
          <el-tooltip
            v-if="taskData.name"
            :content="taskData.name"
            effect="dark"
            :disabled="showTooltip(taskData.name, 57, true)"
            placement="top">
            <span class="principal">{{taskData.name }}</span>
          </el-tooltip>
          <el-tooltip
            v-else
            :content="taskData.planCount"
            effect="dark"
            :disabled="showTooltip(taskData.planCount, 57, true)"
            placement="top">
            <span class="principal">{{taskData.planCount}}</span>
          </el-tooltip>
          <span>{{ taskData.createdDate || taskData.startTime || taskData.createtime | formatDate }}</span>
        </div>
      </div>
    </div>
    <div class="no-data" v-else>
      <div>暂无数据</div>
    </div>
  </div>
</template>
<script>
import API from '../../serve/index'
import { formatDate, isShowToolTip } from '@lib/common/util/common'
import { WORKBENCH } from '@lib/common/const/const'
import { mapGetters } from 'vuex'
export default {
  name: 'taskList',
  props: {
    actived: { type: String, default: '' } //父组件选中的大类
  },
  data () {
    return {
      businessCategoryCode: 'BC-PROJECT', //tab页签选中的业务大类BC-PROJECT,BC-OTHER
      taskList: [], //数据列表
      pageNum: 1, //页数
      pageSize: 10, //每页展示的数量
      moreTextShow: true
      //activatedTag: '01'
    }
  },
  computed: {
    ...mapGetters({
      hasAuthTag: 'USERENTITY/hasAuthTag',
      outUserAuth: 'USERENTITY/outUserAuth'
    }),
    proTabShow () {
      let showbacklog = this.actived === '我的待办' && this.hasAuthTag(WORKBENCH.BACKLOG_PROJECT)
      let showapply = this.actived === '在途申请' && this.hasAuthTag(WORKBENCH.APPLY_PROJECT)
      let showdraft = this.actived === '我的草稿' && this.hasAuthTag(WORKBENCH.DRAFT_PROJECT)
      let showtoberead = this.actived === '我的待阅' && this.hasAuthTag(WORKBENCH.TOBEREAD_PROJECT)
      return showbacklog || showapply || showdraft || showtoberead
    },
    othTabShow () {
      let showbacklog = this.actived === '我的待办' && this.hasAuthTag(WORKBENCH.BACKLOG_OTHER)
      let showapply = this.actived === '在途申请' && this.hasAuthTag(WORKBENCH.APPLY_OTHER)
      let showdraft = this.actived === '我的草稿' && this.hasAuthTag(WORKBENCH.DRAFT_OTHER)
      let showtoberead = this.actived === '我的待阅' && this.hasAuthTag(WORKBENCH.TOBEREAD_OTHER)
      return showbacklog || showapply || showdraft || showtoberead
    },
    // planTabShow () {
    //   return this.actived === '我的待办'
    // }
    planTabShow () {
      let showbacklog = this.actived === '我的待办' && this.hasAuthTag(WORKBENCH.BACKLOG_PLAN)
      let showapply = this.actived === '在途申请' && this.hasAuthTag(WORKBENCH.APPLY_PLAN)
      let showdraft = this.actived === '我的草稿' && this.hasAuthTag(WORKBENCH.DRAFT_PLAN)
      let showtoberead = this.actived === '我的待阅' && this.hasAuthTag(WORKBENCH.TOBEREAD_PLAN)
      return showbacklog || showapply || showdraft || showtoberead
    },
    moreTipShow () {
      return (this.proTabShow || this.othTabShow) && this.moreTextShow
    }
  },

  methods: {
    /**
     * 是否显示Tooltip
     * @param val 需要显示的内容
     * @param len 文本框长度
     * @param isUse 是否使用Tooltip
     * @param id 文本框id
     * @returns {boolean}
     */
    showTooltip (val, len, isUse, id) {
      if (isUse) {
        let con = document.getElementsByTagName('body')[0]
        let span = document.createElement('span')
        span.id = id
        span.style.position = 'absolute'
        span.style.left = '30px'
        span.style.visibility = 'hidden'
        con.appendChild(span)
        span.innerText = val
        let showTip = document.getElementById(id).offsetWidth > len
        con.removeChild(span)
        return !showTip
      } else {
        return true
      }
    },
    //tab切换
    handleClick (tab, event) {
      this.businessCategoryCode = tab.name
      this.taskList = []
      this.$emit('refreshTaskNum', this.actived)
      switch (this.actived) {
        case '我的待办':
          switch (tab.name) {
            case 'BC-PROJECT' :
              this.moreTextShow = true
              this.getBacklogList()
              break
            case 'BC-PLAN' :
              this.moreTextShow = false
              this.getPlanList()
              break
            case 'BC-OTHER':
              this.moreTextShow = true
              this.getBacklogList()
              break
            default :
              this.moreTextShow = true
          }
          break
        case '在途申请':
          this.getApplyForList()
          break
        case '我的草稿':
          this.getDraftList()
          break
        case '我的待阅':
          this.getToBeReadList()
          break
      }
      //console.log('this.moreTipShow', this.moreTipShow)
    },
    //更多按钮跳转
    more () {
      switch (this.actived) {
        case '我的待办':
          this.jumpTo('myBacklog')
          break
        case '在途申请':
          this.jumpTo('myApplyFor')
          break
        case '我的草稿':
          this.jumpTo('myDraft')
          break
        case '我的待阅':
          this.jumpTo('myToBeRead')
          break
      }
    },
    //跳转函数
    jumpTo (name) {
      this.$router.push({
        name: name,
        params: {
          businessCategoryCode: this.businessCategoryCode
        }
      })
    },
    //获取草稿列表
    getDraftList () {
      if (this.businessCategoryCode) {
        let param = {
          businessCategoryCode: this.businessCategoryCode,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        API.getDraftList(param)
          .then(res => {
            this.taskList = res.records
            this.$nextTick(() => {
              this.taskList.forEach(ele => {
                let width = this.$refs['task-content'][0].offsetWidth
                let show = isShowToolTip(ele.taskTitle, width - 20)
                this.$set(ele, 'showToolTip', show)
                ele.name = ele.userName
              })
            })
          })
          .catch(e => {
            if (!e.selfError) {
              this.$message({
                message: e.message || '服务器异常,请稍后再试!',
                type: 'error',
                showClose: true
              })
            }
          })
      } else {
        this.taskList = []
      }
    },
    //获取我的待办中的计划列表
    getPlanList () {
      if (this.businessCategoryCode === 'BC-PLAN') {
        const params = {}
        API.getPlanList(params)
          .then(res => {
            if (res) {
              if (res.managerAuditAmount === 0) {
                res.managerAddr = '#'
              }
              if (res.interfaceAuditAmount === 0) {
                res.interfaceAddr = '#'
              }
              if (res.taskResultAuditAmount === 0) {
                res.taskResultAddr = '#'
              }
              this.taskList = [
                { processInstName: '你需要处理的计划条数（项目经理）：', planCount: res.managerAuditAmount.toString(), url: res.managerAddr },
                { processInstName: '你需要处理的计划条数（接口人）：', planCount: res.interfaceAuditAmount.toString(), url: res.interfaceAddr },
                { processInstName: '你需要处理的成果条数：', planCount: res.taskResultAuditAmount.toString(), url: res.taskResultAddr }
              ]
            } else {
              this.taskList = [
                { processInstName: '你需要处理的计划条数（项目经理）：', planCount: '0', url: '#' },
                { processInstName: '你需要处理的计划条数（接口人）：', planCount: '0', url: '#' },
                { processInstName: '你需要处理的成果条数：', planCount: '0', url: '#' }
              ]
            }
            this.$nextTick(() => {
              this.taskList.forEach(ele => {
                // console.log('this.$refs[task-content][0]', this.$refs['task-content'][0])
                let width = this.$refs['task-content'][0].offsetWidth
                let show = isShowToolTip(ele.processInstName, width - 20)
                this.$set(ele, 'showToolTip', show)
              })
            })
          })
          .catch(e => {
            if (!e.selfError) {
              this.$message({
                message: e.message || '服务器异常,请稍后再试!',
                type: 'error',
                showClose: true
              })
            }
          })
      } else {
        this.taskList = []
      }
    },
    //获取待办列表
    getBacklogList () {
      const params = {}
      if (this.businessCategoryCode) {
        params.businessCategoryCode = this.businessCategoryCode
        // params.businessCategoryCode = '01'
        API.getInHandList(params)
          .then(res => {
            this.taskList = res.records
            this.$nextTick(() => {
              this.taskList.forEach(ele => {
                let width = this.$refs['task-content'][0].offsetWidth
                let show = isShowToolTip(ele.processInstName, width - 20)
                this.$set(ele, 'showToolTip', show)
                ele.name = ele.bizObject.createdName
              })
            })
          })
          .catch(e => {
            if (!e.selfError) {
              this.$message({
                message: e.message || '服务器异常,请稍后再试!',
                type: 'error',
                showClose: true
              })
            }
          })
      } else {
        this.taskList = []
      }
    },
    //获取申请列表
    getApplyForList () {
      const params = {}
      if (this.businessCategoryCode) {
        params.businessCategoryCode = this.businessCategoryCode
        params.processInstState = 2
        params.pageNum = this.pageNum
        params.pageSize = this.pageSize
        API.getApplyingList(params)
          .then(res => {
            this.taskList = res.records
            this.$nextTick(() => {
              this.taskList.forEach(ele => {
                let width = this.$refs['task-content'][0].offsetWidth
                let show = isShowToolTip(ele.processInstName, width - 20)
                this.$set(ele, 'showToolTip', show)
                ele.name = ele.approverName
              })
            })
          })
          .catch(e => {
            if (!e.selfError) {
              this.$message({
                message: e.message || '服务器异常,请稍后再试!',
                type: 'error',
                showClose: true
              })
            }
          })
      } else {
        this.taskList = []
      }
    },
    //获取待阅列表
    getToBeReadList () {
      const params = {}
      if (this.businessCategoryCode) {
        params.businessCategoryCode = this.businessCategoryCode
        // params.businessCategoryCode = '01'
        API.getToBeReadList(params)
          .then(res => {
            this.taskList = res.records
            this.$nextTick(() => {
              this.taskList.forEach(ele => {
                let width = this.$refs['task-content'][0].offsetWidth
                let show = isShowToolTip(ele.title, width - 20)
                this.$set(ele, 'showToolTip', show)
                ele.name = ele.bizObject.createdName
              })
            })
          })
          .catch(e => {
            if (!e.selfError) {
              this.$message({
                message: e.message || '服务器异常,请稍后再试!',
                type: 'error',
                showClose: true
              })
            }
          })
      } else {
        this.taskList = []
      }
    },
    //跳转至详情页
    gotoDetail (taskData) {
      switch (this.actived) {
        case '我的待阅':
          this.jumpToNotification(taskData)
          break
        case '我的待办':
          if (this.businessCategoryCode === 'BC-PROJECT' || this.businessCategoryCode === 'BC-OTHER') {
            this.jumpToPersonWorkItem(taskData.actionURL)
          } else {
            this.jumpToPlan(taskData.url)
          }
          break
        case '在途申请':
          this.jumpToApplication(taskData)
          break
        case '我的草稿':
          this.jumpToDraft(taskData.businessFormUrl)
          break
      }
    },
    //跳转到计划
    //计划数量为0时阻止跳转
    jumpToPlan (url) {
      if (url === '#') {
        return false
      } else {
        let { href } = this.$router.resolve({
          path: url,
          query: {
            isFromRMS: '1'
          }
        })
        window.open(href, '_blank')
      }
    },
    // 跳转到待阅
    jumpToNotification (data) {
      API.confirmNotification(data.notificationid)
        .then(res => {
          if (res) {
            // let { href } = this.$router.resolve({
            //   path: data.actionurl
            // })
            // window.open(href, '_blank')
            this.$emit('refreshToNotificationNum', '')
            let url1 = window.location.href
            url1 = url1.substring(0, url1.indexOf('#'))
            let url2 = url1 + data.actionurl.substring(data.actionurl.indexOf('#'), data.actionurl.length)
            window.open(url2 + '&isFromRMS=1', '_blank')
            // window.open(data.actionurl + '&isFromRMS=1', '_blank')
            this.getToBeReadList()
          } else {
            this.$message({
              message: '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '服务器异常，请稍后再试！',
            type: 'error',
            showClose: true
          })
        })
    },
    // 跳转到待办
    jumpToPersonWorkItem (url) {
      // API.getWorkItemUrl(id)
      //   .then(res => {
      //     window['refreshBacklogList'] = () => {
      //       this.getBacklogList()
      //       this.$emit('refreshBackLogNum', '')
      //     }
      //     if (res.indexOf(':') === -1) {
      //       let { href } = this.$router.resolve({
      //         path: res
      //       })
      //       window.open(href, '_blank')
      //     } else {
      //       window.open(res, '_blank')
      //     }
      //   })
      //   .catch(e => {
      //     if (!e.selfError) {
      //       this.$message({
      //         message: e.message || '服务器异常，请稍后再试！',
      //         type: 'error',
      //         showClose: true
      //       })
      //     }
      //   })
      window['refreshBacklogList'] = () => {
        this.getBacklogList()
        this.$emit('refreshBackLogNum', '')
      }
      let url1 = window.location.href
      url1 = url1.substring(0, url1.indexOf('#'))
      let url2 = url1 + url.substring(url.indexOf('#'), url.length)
      window.open(url2 + '&isFromRMS=1', '_blank')
      // 之前有相对路径，现在全部返回的完整路径
      // if (url.indexOf(':') === -1) {
      //   let { href } = this.$router.resolve({
      //     path: url2,
      //     query: {
      //       isFromRMS: '1'
      //     }
      //   })
      //   window.open(href, '_blank')
      // } else {
      //   window.open(url2 + '&isFromRMS=1', '_blank')
      // }
    },
    // 跳转到申请
    jumpToApplication (data) {
      let url = ''
      switch (data.businessTypeCode) {
        case 'BT_WOTK_TIME_APPROVAL':
          url = '/timeSheet/timeApproval'
          break
        case 'BT-ANNOUNCEMENT':
          url = '/announcement/approval'
          break
        case 'BT-APPROVE':
          url = '/launchFlow/lauFlowDetail'
          break
        case 'BT-CHANGE':
          url = '/changeFlow/changeFlowViewDetail'
          break
        case 'BT-STOP':
          url = '/terminateFlow/terminateFlowDetail'
          break
        case 'BT-FINISH':
          url = '/finalFlow/finalFlowDetail'
          break
        case 'BT-MILESTONE-FINISH':
          url = '/milestone/milestoneProcessDetail'
          break
        case 'BT-PACKAGE-TASK':
          url = '/task/taskDetail'
          break
        case 'BT-DEMAND-ENTRUST-LETTER':
          url = '/groupPlan/entrustmentFlow/entrustmentFlowDetail'
          break
        case 'BT-DEMAND-PLAN-CHANGE':
          url = '/groupPlan/planAdjustFlow/planAdjustFlowDetail'
          break
        case 'BT-DEMAND-APPROVE':
        case 'BT-UNDERTAKER-APPROVE':
          url = '/groupPlan/launchFlow/launchFlowDetail'
          break
        case 'BT-DEMAND-CHANGE':
        case 'BT-UNDERTAKER-CHANGE':
          url = '/groupPlan/changeFlow/changeFlowDetail'
          break
        case 'BT-DEMAND-STOP':
        case 'BT-UNDERTAKER-STOP':
          url = '/groupPlan/terminateFlow/terminateFlowDetail'
          break
        case 'BT-DEMAND-FINISH':
        case 'BT-UNDERTAKER-FINISH':
          url = '/groupPlan/finishFlow/finishFlowDetail'
          break
        case 'BT-DEMAND-MILESTONE-FINISH':
        case 'BT-UNDERTAKER-MILESTONE-FINISH':
          url = '/groupPlan/milestoneFlow/milestoneFlowDetail'
          break
        case 'BT-PRE-APPROVE-IMPORT':
          url = '/groupPreLaunchFlow/groupPreProjectDetail'
          break
        case 'BT-PRE-APPROVE':
          url = '/beforeLaunchFlow/beforeLaunchFlowDetail'
          break
        case 'BT-UNDERTAKER-PRE-APPROVE':
          url = '/groupPlan/beforeLaunchFlow/beforeLaunchFlowDetail'
          break
      }
      let { href } = this.$router.resolve({
        path: url,
        query: {
          processInstID: data.processInstId,
          isFromRMS: '1'
        }
      })
      window.open(href, '_blank')
    },
    // 跳转到草稿
    jumpToDraft (url) {
      let { href } = this.$router.resolve({
        path: url,
        query: {
          isFromRMS: '1'
        }
      })
      window.open(href, '_blank')
    },
    refreshList (name) {
      //console.log('refreshList')
      this.$nextTick(() => {
        if (this.proTabShow) {
          this.businessCategoryCode = 'BC-PROJECT'
          this.moreTextShow = true
        } else if (this.planTabShow) {
          this.businessCategoryCode = 'BC-PLAN'
          this.moreTextShow = false
        } else if (this.othTabShow) {
          this.businessCategoryCode = 'BC-OTHER'
          this.moreTextShow = true
        } else {
          this.businessCategoryCode = ''
        }
        this.taskList = []
        switch (name) {
          case '我的待办':
            if (this.businessCategoryCode === 'BC-PROJECT') {
              this.getBacklogList()
            } else if (this.businessCategoryCode === 'BC-PLAN') {
              this.getPlanList()
            } else if (this.businessCategoryCode === 'BC-OTHER') {
              this.getBacklogList()
            } else {
              this.taskList = []
            }
            break
          case '在途申请':
            this.getApplyForList()
            break
          case '我的草稿':
            this.getDraftList()
            break
          case '我的待阅':
            this.getToBeReadList()
            break
        }
      })
    }
  },

  mounted () {
    if (this.proTabShow) {
      this.businessCategoryCode = 'BC-PROJECT'
      this.moreTextShow = true
    } else if (this.planTabShow) {
      this.businessCategoryCode = 'BC-PLAN'
      this.moreTextShow = false
    } else if (this.othTabShow) {
      this.businessCategoryCode = 'BC-OTHER'
      this.moreTextShow = true
    } else {
      this.businessCategoryCode = ''
    }
    this.refreshList('我的待办')
  },

  watch: {
    //监听父组件选中大类的变化
    // actived: {
    //   immediate: true,
    //   handler (val) {
    //     this.$nextTick(() => {
    //       if (this.proTabShow) {
    //         this.businessCategoryCode = '01'
    //         this.moreTextShow = true
    //       } else if (this.planTabShow) {
    //         this.businessCategoryCode = '05'
    //         this.moreTextShow = false
    //       } else if (this.othTabShow) {
    //         this.businessCategoryCode = '03'
    //         this.moreTextShow = true
    //       } else {
    //         this.businessCategoryCode = ''
    //       }
    //       this.taskList = []
    //       switch (val) {
    //         case '我的待办':
    //           this.getBacklogList()
    //           break
    //         case '在途申请':
    //           this.getApplyForList()
    //           break
    //         case '我的草稿':
    //           this.getDraftList()
    //           break
    //         case '我的待阅':
    //           this.getToBeReadList()
    //           break
    //       }
    //     })
    //   }
    // },
    // 删除 20210129
    // outUserAuth: {
    //   deep: true,
    //   immediate: true,
    //   handler (newValue, oldValue) {
    //     if (newValue) {
    //       if (this.proTabShow) {
    //         this.businessCategoryCode = 'BC-PROJECT'
    //         this.moreTextShow = true
    //       } else if (this.planTabShow) {
    //         this.businessCategoryCode = 'BC-PLAN'
    //         this.moreTextShow = false
    //       } else if (this.othTabShow) {
    //         this.businessCategoryCode = 'BC-OTHER'
    //         this.moreTextShow = true
    //       } else {
    //         this.businessCategoryCode = ''
    //       }
    //       this.refreshList('我的待办')
    //     }
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.task-list {
  .header {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;
    height: 44px;
    background: $color-background-normal;
    padding: 0 20px;
    border-radius: 4px 4px 0 0;
    .tabs {
      height: 100%;
      .el-tabs {
        height: 100%;
        /deep/ .el-tabs__header {
          line-height: 44px;
          margin: 0;
          .el-tabs__nav-wrap {
            box-sizing: content-box;
             /deep/ .el-tabs__item {
                font-size: 14px;
                font-weight: 700;
              }
              // .is-active {
              //    color: #0B82FF
              // }
            &::after {
              height: 0;
            }
          }
        }
      }
    }
    .more{
      cursor: pointer;
      font-weight: normal;
      font-size: 14px;
      color: #9D9D9D;
      .el-icon-arrow-right:before {
        font-size: 10px;
        padding-left: 3px
      }
    }
  }
  .task-details {
    padding: 16px 20px;
    .task-detail {
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      height: 20px;
      line-height: 20px;
      padding: 6px 0;
      .task-content {
        width: 50%;
        .el-link {
          width: 100%;
          justify-content: flex-start;
          /deep/ .el-link--inner {
            width: 100%;
          }
          .title{
            width: 100%;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
          }
        }
      }
      .relevant-information {

        font-size: 12px;
        color: #999999;
        .principal {
          display: inline-block;
          width: 57px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          vertical-align: bottom;
        }
      }
    }
  }
  .no-data {
    padding-top: 150px;

    font-size: 14px;
    color: #999999;
    text-align: center;
  }
}
</style>
