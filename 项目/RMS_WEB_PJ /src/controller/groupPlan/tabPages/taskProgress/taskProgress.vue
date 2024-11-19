<template>
  <div class="wrapper-content">
    <div class="tabSwitch">
      <template>
        <div v-if="showStatus">
          <el-tabs
            @tab-click="handleClick"
            v-model="activeName"
            type="card">
            <el-tab-pane
              v-for="(item,index) in projectCompanyTab"
              :key="index"
              :name="item.isView"
              :label="item.companyName.length>item.organizationName.length?item.companyName:item.organizationName">
              <tab-companent :company-code="companyCode[index]" v-if="projectCompanyTab[0].companyCode" ref="tabComponent"></tab-companent>
            </el-tab-pane>
          </el-tabs>
          <!-- projectCompanyTab没数据返回展示无数据页面 -->
          <tab-companent v-if="projectCompanyTab.length === 0"></tab-companent>
        </div>
        <div v-else>
          <tab-companent :company-code="userInfo.userAuth.companyCode"></tab-companent>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import tabCompanent from './tabComponent.vue'
import API from '@/serve/API_groupPlan.js'
export default {
  components: {
    tabCompanent
  },
  data () {
    return {
      showStatus: false,
      companyCode: [],
      userInfo: this.$store.getters['USERENTITY/userInfo'],
      currentIndex: 0,
      projectCompanyTab: [],
      activeName: '888'
    }
  },
  methods: {
    // 需求单位tab展示
    projectCompany () {
      let params = {
        // userCode: this.userInfo.userAuth.uid,
        projectCode: this.$route.params.projectCode
      }
      API.lastVerProjectCompanyList(params)
        .then(res => {
          if (res && res.length > 0) {
            let isViewDefault = res.some(item => {
              return item.isView === '888'
            })
            if (!isViewDefault) {
              res[0].isView = '888'
              this.projectCompanyTab = res
            } else {
              let app = []
              res.forEach(item => {
                if (item.isView === '888') {
                  app.unshift(item)
                } else {
                  app.push(item)
                }
              })
              this.projectCompanyTab = app
            }
            let arr = []
            this.projectCompanyTab.forEach(item => {
              arr.push(item.companyCode)
            })
            this.companyCode = arr
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    handleClick (tab, event) {
      // this.currentIndex = parseInt(tab.index)
      // this.activeName = tab.name
      this.$refs.tabComponent[tab.index].taskProcessList({ currentPage: 1 })
    },
    judgeUndertakeUnit () {
      switch (this.$route.query.projectCategory) {
        case 'd':
          switch (this.$route.query.developPackage) {
            case 'IS_RD_1': // 集团统筹需求单位一般支撑包项目
              this.showStatus = false
              break
            case 'IS_RD_0': // 集团统筹需求单位非一般支撑包项目
              this.showStatus = true
              this.projectCompany()
              break
          }
          break
        case 'u':
          switch (this.$route.query.developPackage) {
            case 'IS_RD_1': // 集团统筹承担单位一般支撑包项目
              this.showStatus = false
              break
            case 'IS_RD_0': // 集团统筹承担单位非一般支撑包项目
              this.showStatus = false
              // this.projectCompany()
              break
          }
          break
      }
    }
  },
  created () {
    this.judgeUndertakeUnit()
    window.onscroll = null
  }
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px){
  .tabSwitch{
    width: 1000px !important;
  }
}
@media screen and (max-width: 1364px){
  .tabSwitch{
    width: 960px !important;
  }
}
  .wrapper-content {
    background: #f6f6f6;
    // min-height: calc(100vh - 70px);
  }
  .tabSwitch {
    width: 1180px;
    margin: 0 auto;
    margin-top: 18px;
    font-size: 14px !important;
    font-family: PingFangSC-Medium !important;
    line-height: 21px;
    /deep/.el-tabs {
    .el-tabs__header {
      border-bottom: 0px;
      margin-bottom: 0px !important;
      .el-tabs__nav-wrap {
        border-radius: 0;
        span.el-tabs__nav-prev {
          line-height: 32px;
          i {
            font-size: 18px !important;
            font-weight: 600 !important;
             @include color();
          }
        }
        span.el-tabs__nav-next {
          line-height: 32px;
          i {
            font-size: 18px !important;
            font-weight: 600 !important;
             @include color();
          }
        }
        // span.is-disabled {
        //   pointer-events: none;
        //   opacity: 0.6;
        //   cursor: default;
        // }
        .el-tabs__nav-scroll {
          .el-tabs__item {
            height: 30px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            background: #fff;
            letter-spacing: 0;
            text-align: center;
            line-height: 16px;
            padding: 7px 14.5px!important;
            border-radius: 2px;
            border-bottom: 1px solid #E4E7ED;
            &:hover {
              @include color();
            }
            &.is-active{
              color:#fff !important;
              border-bottom: 1.5px solid #0B82FF;
              @include background-color();
              @include border-bottom-color();
            }
          }
        }
      }
     }
    }
  }
</style>
