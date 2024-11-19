<template>
  <div class="my-task">
    <div class="header">
      <span class="title">我的任务</span>
    </div>
    <div class="content">
      <div class="task-overview">
        <div class="task-collect" @click="switchTo(taskCollect.myInHand.name)">
          <div class="task-count">
            {{ taskCollect.myInHand.count &lt; 99 ? taskCollect.myInHand.count : 99 }}
            <span
              v-if="taskCollect.myInHand.count > 99"
              class="countOverflow"
            >+</span>
          </div>
          <div class="task-name">{{taskCollect.myInHand.name}}</div>
          <i v-show="actived === '我的待办'" class="el-icon-caret-bottom"></i>
        </div>
        <div class="cut-off-rule"></div>
        <div class="task-collect" @click="switchTo(taskCollect.applying.name)">
          <div class="task-count">
            {{taskCollect.applying.count &lt; 99 ? taskCollect.applying.count : 99}}
            <span
              v-if="taskCollect.applying.count > 99"
              class="countOverflow"
            >+</span>
          </div>
          <div class="task-name">{{taskCollect.applying.name}}</div>
          <i v-show="actived === '在途申请'" class="el-icon-caret-bottom"></i>
        </div>
        <div class="cut-off-rule"></div>
        <div class="task-collect" @click="switchTo(taskCollect.myDraft.name)">
          <div class="task-count">
            {{taskCollect.myDraft.count &lt; 99 ? taskCollect.myDraft.count : 99}}
            <span
              v-if="taskCollect.myDraft.count > 99"
              class="countOverflow"
            >+</span>
          </div>
          <div class="task-name">{{taskCollect.myDraft.name}}</div>
          <i v-show="actived === '我的草稿'" class="el-icon-caret-bottom"></i>
        </div>
        <div class="cut-off-rule"></div>
        <div class="task-collect" @click="switchTo(taskCollect.myToBeRead.name)">
          <div class="task-count">
            {{taskCollect.myToBeRead.count &lt; 99 ? taskCollect.myToBeRead.count : 99}}
            <span
              v-if="taskCollect.myToBeRead.count > 99"
              class="countOverflow"
            >+</span>
          </div>
          <div class="task-name">{{taskCollect.myToBeRead.name}}</div>
          <i v-show="actived === '我的待阅'" class="el-icon-caret-bottom"></i>
        </div>
      </div>
      <task-list
        ref='taskList'
        :actived="actived"
        @refreshBackLogNum="refreshBackLogNum"
        @refreshToNotificationNum="refreshToNotificationNum"
        @refreshTaskNum="refreshNum"
      ></task-list>
    </div>
  </div>
</template>
<script>
import TaskList from './taskList'
import API from '../../serve/index'
export default {
  name: 'myTask',
  components: { TaskList },
  data () {
    return {
      taskCollect: {
        myInHand: {
          name: '我的待办',
          count: 0
        },
        applying: {
          name: '在途申请',
          count: 0
        },
        myDraft: {
          name: '我的草稿',
          count: 0
        },
        myToBeRead: {
          name: '我的待阅',
          count: 0
        }
      },
      actived: '我的待办'
    }
  },

  methods: {
    //任务类型转换
    switchTo (name) {
      this.actived = name
      switch (name) {
        case '我的待办':
          this.getInHandNum()
          break
        case '在途申请':
          this.getApplyingNum()
          break
        case '我的草稿':
          this.getDraftNum()
          break
        case '我的待阅':
          this.getToBeReadNum()
          break
      }
      this.$refs.taskList.refreshList(name)
    },
    //刷新任务数量
    refreshNum (taskName) {
      switch (taskName) {
        case '我的待办':
          this.getInHandNum()
          break
        case '在途申请':
          this.getApplyingNum()
          break
        case '我的草稿':
          this.getDraftNum()
          break
        case '我的待阅':
          this.getToBeReadNum()
          break
      }
    },
    //获取草稿数量
    getDraftNum () {
      API.getDraftNum()
        .then((res) => {
          this.taskCollect.myDraft.count = res
        })
        .catch((err) => {
          if (!err.selfError) {
            this.$message({
              message: err.message || '服务器异常,请稍后再试!',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取我的申请数量
    getApplyingNum () {
      const params = {}
      params.processInstState = 2
      API.getApplyingNum(params)
        .then((res) => {
          this.taskCollect.applying.count = res
        })
        .catch((err) => {
          console.log(err)
          if (!err.selfError) {
            this.$message({
              message: err || '服务器异常,请稍后再试!',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 查询我的待阅数量
    getToBeReadNum () {
      API.getToBeReadNum()
        .then((res) => {
          this.taskCollect.myToBeRead.count = res
        })
        .catch((err) => {
          if (!err.selfError) {
            this.$message({
              message: err.message || '服务器异常,请稍后再试!',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 查询我的待办数量
    getInHandNum () {
      API.getInHandNum()
        .then((res) => {
          this.taskCollect.myInHand.count = res
        })
        .catch((err) => {
          if (!err.selfError) {
            this.$message({
              message: err.message || '服务器异常,请稍后再试!',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 刷新待办数量
    refreshBackLogNum () {
      this.getInHandNum()
      this.getApplyingNum()
    },
    // 刷新待阅数量
    refreshToNotificationNum () {
      this.getToBeReadNum()
    }
  },

  mounted () {
    this.getDraftNum()
    this.getApplyingNum()
    this.getToBeReadNum()
    this.getInHandNum()
  }
}
</script>
<style lang="scss" scoped>
.my-task {
  margin-right: 7px;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
  .header {
    height: 43px;
    line-height: 43px;
    background: $color-background-normal;
    font-size: 16px;
    padding: 0 20px;
    color: $color-text-normal;
    font-weight: bold;
  }
  .content {
    padding: 0 18px;
    .task-overview {
      height: 138px;
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      .cut-off-rule {
        height: 37.4px;
        border-left: 1.1px solid #0085d0;
        @include border-left-color($color-blue, 0.5);
      }
      .task-collect {
        text-align: center;
        font-size: 20px;
        position: relative;
        cursor: pointer;
        @include color();
        .task-count {
          height: 47px;
          line-height: 47px;
          font-family: MicrosoftYaHei-Bold;
          font-size: 36px;
          font-weight: bold;
          position: relative;
          .countOverflow {
            width: 17px;
            height: 29px;
            line-height: 29px;
            position: absolute;
            top: 0;
            right: -8px;
            font-size: 22px;
            text-align: center;
          }
        }
        .task-name {
          height: 20px;
          line-height: 20px;
          margin-bottom: 15px;

          font-size: 14px;
          color: #333333;
          font-weight: 700;
        }
        i {
          position: absolute;
          left: 50%;
          bottom: -20px;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>
