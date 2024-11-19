<template>
  <!-- 任务进展 -->
  <div class="wrapper-content">
    <div class="wrapper" style="margin-top:20px">
      <div class="add-progress" v-if="isEditable">
        <project-panel :title="'添加进展'">
          <div class="content">
            <div class="write-text">
              <el-form
                ref="ruleForm"
                style="width: 100%;">
                <el-form-item
                  label="进展说明："
                  :required="true"
                  :error="errorMsg"
                  style="margin:0;">
                  <el-input
                    id="id"
                    type="textarea"
                    placeholder="请输入"
                    v-model ="textarea"
                    maxlength="2000"
                    show-word-limit>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="add-btn">
              <el-button type="primary" @click="addTaskProcess">添加进展</el-button>
            </div>
          </div>
        </project-panel>
      </div>
      <div class="history-progress">
        <project-panel :title="'历史进展'+ `(${total})`">
          <div slot="header" class="write-by">填写人：<el-input
            placeholder="请输入"
            suffix-icon="el-icon-search"
            v-model.trim ="userName"
            @change="blurData"></el-input> </div>
          <template v-if="total !== 0">
            <div v-for="(item, index) in historyProcessList" :key="index" class="text-item">
              <hr v-if="index >= 1">
              <div class="history-top-msg">
                <p> <span>填写人：</span> <span>{{item.userName}}</span> </p>
                <p> <span>填写时间：</span> <span>{{item.createdDate}}</span> </p>
              </div>
              <div class="history-content">
                <span>进展说明：</span>
                <pre style="margin-top:0px;font-family: PingFangSC-Regular;font-size:14px;color:#333">{{item.remarks}}</pre>
              </div>
            </div>
          </template>
          <div v-else style="height:80px;text-align:center">
            <span style="display:inline-block;line-height:80px;text-align:center;width:100%">暂无数据</span>
          </div>
        </project-panel>
        <div></div>
      </div>
    </div>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_projectInfo.js'
import APIProject from '@/serve/API_project'
import timestampToDate from '@/utils/DateTimeUtils.js'

export default {
  components: { projectPanel },
  data () {
    return {
      textarea: '',
      historyProcessList: [],
      isEditable: false,
      currentPage: 1, // 当前页书
      pageSize: 10, // 加载条数
      isMoreLoad: true, // 是否还有更多
      scrollDirection: null, // 滚动方向
      scrollAction: { x: 'undefined', y: 'undefined' },
      total: 0,
      userName: '',
      errorMsg: null
    }
  },
  created () {
    this.verificationPermission()
    // this.taskProcessList()
    // this.myFunction()
  },
  mounted () {
    // 页面初始化-页面滚动事件
    window.addEventListener('scroll', this.scrollLoad)
    // this.myFunction()
  },
  // 离开页面删除事件
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.scrollLoad)
    next()
  },
  methods: {
    // 权限校验
    verificationPermission () {
      const param = {
        projectCode: this.$route.params.projectCode
      }
      APIProject.verificationPermission(param)
        .then(res => {
          if (res.includes('00') || res.includes('04')) {
            this.isEditable = true
          }
          this.taskProcessList()
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '校验权限失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // myFunction (id) {
    //   var x = document.getElementById(id)
    //   if (x.value) {
    //     x.value = x.value.replace(/\s+/g, '')
    //   }
    // },
    // 滚动加载
    scrollLoad () {
      this.scrollFunc()
      if (this.scrollDirection === 'down') {
        //页面向下滚动要做的事情
        var scr = document.documentElement.scrollTop || document.body.scrollTop // 向上滚动的那一部分高度
        var clientHeight = document.documentElement.clientHeight // 屏幕高度也就是当前设备静态下你所看到的视觉高度
        var scrHeight = document.documentElement.scrollHeight || document.body.scrollHeight // 整个网页的实际高度，兼容Pc端
        if (scr + clientHeight + 10 >= scrHeight) {
          if (this.isMoreLoad) { //this.isMoreLoad控制滚动是否加载更多
            this.taskProcessList({ isToDown: true })
          }
        }
      }
    },
    // 获取历史进展
    taskProcessList (obj) {
      if (this.userName) {
        this.currentPage = 1
      }
      this.isMoreLoad = false
      if (obj && obj.isToDown) {
        this.currentPage++
      }
      let params = {
        userName: this.userName, // 经理名称
        projectCode: this.$route.params.projectCode, // 项目编码
        currentPage: this.currentPage, // 当前页
        pageSize: this.pageSize // 获取条数
      }
      API.taskProcessList(params)
        .then(res => {
          this.total = res.total
          if (!res.total) {
            // this.$message({
            //   message: '暂无数据!',
            //   type: 'error'
            // })
            // this.historyProcessList = []
          }
          if (res.list.length) {
            if (obj && obj.isToDown) {
              this.historyProcessList = this.historyProcessList.concat(res.list)
            } else {
              this.historyProcessList = res.list
            }
            //时间戳
            this.historyProcessList.forEach(item => {
              item.createdDate = this.$formatDate(item.createdDate, 'YYYY-MM-DD HH:mm:ss')
            })
          }
          if (!res.isLastPage) this.isMoreLoad = true
        })
        .catch(() => {
        })
    },
    //添加任务进展
    addTaskProcess () {
      if (this.testarea === '') {
        this.errorMsg = '进展说明不能为空'
      } else {
        this.errorMsg = null
        this.currentPage = 1
        let params = {
          projectCode: this.$route.params.projectCode,
          // remarks: this.textarea.replace(/[\r\n]/g, '<br />')
          remarks: this.textarea
        }
        API.addTaskProcess(params)
          .then(res => {
            if (res) {
              this.$message({
                message: '添加成功!',
                type: 'success'
              })
              this.textarea = ''
              this.userName = ''
              this.taskProcessList()
            } else {
              this.$message({
                message: '添加失败!',
                type: 'warning'
              })
            }
          })
          .catch(e => {
            this.loading = false
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '...失败，请稍后重试！',
                type: 'error',
                showClose: true
              })
            }
          })
      }
    },
    // 监听滚动方向
    scrollFunc () {
      if (typeof this.scrollAction.x === 'undefined') {
        this.scrollAction.x = window.pageXOffset
        this.scrollAction.y = window.pageYOffset
      }
      var diffX = this.scrollAction.x - window.pageXOffset
      var diffY = this.scrollAction.y - window.pageYOffset
      if (diffX < 0) {
        // Scroll right
        this.scrollDirection = 'right'
      } else if (diffX > 0) {
        // Scroll left
        this.scrollDirection = 'left'
      } else if (diffY < 0) {
        // Scroll down
        this.scrollDirection = 'down'
      } else if (diffY > 0) {
        // Scroll up
        this.scrollDirection = 'up'
      } else {
        // First scroll event
      }
      this.scrollAction.x = window.pageXOffset
      this.scrollAction.y = window.pageYOffset
    },
    blurData () {
      this.taskProcessList()
    }
  }
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px){
  .wrapper{
    width: 1000px !important;
  }
}

@media screen and (max-width: 1364px){
  .wrapper{
    width: 960px !important;
  }
}
  .wrapper-content {
    background: #f6f6f6;
    min-height: calc(100vh - 70px);
  }
  .wrapper{
    background: #fff;
    padding: 20px 30px;
    width: 1180px;
    margin: 0 auto;
    box-sizing: border-box;
    .project-panel{
      // width: 1120px;
      margin:0 auto;
      border: 1px solid #D8D8D8;
      &:nth-child(1){
        margin-bottom: 20px;
      }
      /deep/{
        .panel-header{
          border-bottom: 1px solid #D8D8D8;
        }
        .panel-body{
          margin-bottom:0;
        }
      }
    }
    .write-by{
      white-space: nowrap;
      width: 300px;
      .el-input{
        width: 220px;
      }
    }
    .add-progress{
      .content{
        .write-text{
          display: flex;
          span{
            white-space: nowrap;
          }
          /deep/{
            .el-textarea__inner{
              height: 62px;
            }
            .el-form-item__content{
              margin-left:100px;
            }
          }
        }
        /deep/.el-input__count {
          right: 35px !important;
          width: 20px;
          height: 4px;
          bottom: 20px;
        }
      }
      .add-btn{
        text-align: right;
        padding: 20px 0 10px 0;
        .el-button{
          width: 89px;
          height: 30px;
          border-radius: 2px;
        }
      }
    }
    .history-progress{
      hr{
        margin:0;
        height:0;
        border:none;
        border-top: 1px solid #D8D8D8;
      }
      /deep/ .panel-body{
        padding:0;
      }
      p{
        margin:0;
      }
      .history-top-msg{
        display: flex;
        padding: 24px 42px 0;
        p{
          margin-right: 104px;
          display: flex;
          span{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            line-height: 22px;
          }
          span:nth-child(1){
            color: rgba(0,0,0,0.85);
            text-align: right;
            margin-right: 8px;
          }
          span:nth-child(2){
            color: #666666;
            width: 204px;
          }
        }
      }
      .history-content{
        display: flex;
        margin:28px 0 32px;
        padding: 0 8px 0 27px;
        pre {
          white-space:pre-wrap;
          white-space:-moz-pre-wrap;
          white-space:-o-pre-wrap;
          word-wrap:break-word;
        }
        p,span{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          line-height: 22px;
        }
        span{
          white-space: nowrap;
          text-align: right;
        }
      }
    }
  }
</style>
