<template>
  <div class="change-flow-contrast-detail">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <div class="head-title">
          <span class="version-name" v-if="newProjectInfo && newProjectInfo.projectBaseInfo">
            <el-tooltip :content="newProjectInfo.projectBaseInfo.projectName" placement="top" :disabled="!nameToolTip">
              <span class="head-name">{{newProjectInfo.projectBaseInfo.projectName}}</span>
            </el-tooltip>
            {{newVersionName}}
          </span>
          <span class="version-name">{{oldVersionName}}</span>
        </div>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">

      <contrast-details
        v-if="newProjectInfo && oldProjectInfo"
        :is-change="true"
        :left-info="newProjectInfo"
        :right-info="oldProjectInfo"></contrast-details>

    </div>
  </div>
</template>
<script>
import API from '@/serve/API_project'
import projectDocumentUpload from '../projectDocumentUpload'
import detailTableMilestone from '../../extraProject/components/basic/milestone/detailTableMilestone'
import basicInfo from '../../extraProject/components/basic/detail'
import teamInfo from '../../extraProject/components/teamInfo/detail'
import projectBudget from '../../extraProject/components/budget/detail'
import subproject from '../../extraProject/components/subproject'
import changeReason from '../changeReason'
import contrastDetails from '../contrastDetails'
// import { rightProjectInfo, leftProjectInfo } from '../contrastDetails/mockData'
import { isShowToolTip } from '@/utils/common.js'
import { getStore } from '@/store'
export default {
  name: 'changeFlowContrastDetails',
  data () {
    return {
      oldProjectInfo: null, //原项目信息
      newProjectInfo: null, //新项目信息
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      newVersionName: '',
      oldVersionName: '',
      nameToolTip: false,
      typeOptions: [],
      levelList: [],
      sourceList: [],
      devPropertyList: [],
      pjCostTypeList: [],
      versionList: [], //版本列表
      resultsTypeOptions: []
    }
  },
  components: {
    contrastDetails
  },
  computed: {
  },
  mounted () {
  },
  created () {
    this.getResultsType()
    this.queryChangeApproveDetail()
  },
  methods: {
    //回到顶部
    backToTop () {

    },
    // 查询项目版本列表
    getProjectVersion () {
      let params = {
        projectCode: this.$route.query.projectCode,
        userAccount: getStore().getters['USERENTITY/userInfo'].userAuth.uid
      }
      API.getProjectVersion(params)
        .then(res => {
          if (res) {
            this.versionList = res
          }
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    async queryChangeApproveDetail () {
      // await this.getProjectType()
      // await this.getProjectLevel()
      // await this.getDics()
      // this.oldProjectInfo = rightProjectInfo
      // this.newProjectInfo = leftProjectInfo //TODO：debug
      // this.nameToolTip = isShowToolTip(this.newProjectInfo.projectBaseInfo.projectName, 250)
      // await this.getProjectVersion()
      let params = {
        approveNo: this.$route.query.approveNo,
        projectCode: this.$route.query.projectCode
      }
      API.queryChangeApproveDetail(params)
        .then(res => {
          /* this.versionList.forEach((ver, index) => {
            if (ver.versionName === res.newVersionName) {
              this.newVersionName = `#${this.versionList.length - index} ${res.newVersionName}`
            }
            if (ver.versionName === res.oldVersionName) {
              this.oldVersionName = `#${this.versionList.length - index} ${res.oldVersionName}`
            }
          }) */
          if (res.newProjectInfo.subProjectInfoList && res.newProjectInfo.subProjectInfoList.length > 0) {
            res.newProjectInfo.subProjectInfoList.forEach(item => {
              item.versionNo = res.newProjectInfo.versionNo
              item.isUpdate = false
              let type = ''
              this.resultsTypeOptions.forEach(iter => {
                if (iter.valueCode === item.subprojectType) {
                  type = iter.name
                }
              })
              if (type !== '') {
                item.subprojectType = type
              }
            })
          }

          if (res.oldProjectInfo.subProjectInfoList && res.oldProjectInfo.subProjectInfoList.length > 0) {
            res.oldProjectInfo.subProjectInfoList.forEach(item => {
              item.versionNo = res.oldProjectInfo.versionNo
              item.isUpdate = false
              let type = ''
              this.resultsTypeOptions.forEach(iter => {
                if (iter.valueCode === item.subprojectType) {
                  type = iter.name
                }
              })
              if (type !== '') {
                item.subprojectType = type
              }
            })
          }
          this.newVersionName = res.newVersionName
          this.oldVersionName = res.oldVersionName
          this.oldProjectInfo = res.oldProjectInfo
          this.newProjectInfo = res.newProjectInfo
          this.nameToolTip = isShowToolTip(this.newProjectInfo.projectBaseInfo.projectName, 250)
          let allArr = null
          res.oldProjectInfo.costBudgetList.forEach((item, index) => {
            if (item && item.timeYear === 'ALL') {
              allArr = item
              res.oldProjectInfo.costBudgetList.splice(index, 1)
            }
          })
          res.oldProjectInfo.costBudgetList.push(allArr)
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取变更详情失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    getResultsType () { //查询任务/成果类型
      API.dictValByCode('EXPECTED-RESULT-TYPE')
        .then(res => {
          if (res && res.length > 0) {
            this.resultsTypeOptions = res
          } else {
            this.resultsTypeOptions = []
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询成果类型失败',
            type: 'error',
            showClose: true
          })
        })
    },
    mapCodes (list, data, key) {
      list.some(item => {
        if (data.projectBaseInfo[key] === item.valueCode) {
          data.projectBaseInfo[`${key}Value`] = item.name
          return true
        }
      })
    },
    getDics () {
      let param = {
        codes: 'PROJECT-SOURCE,DEVELOP-PROPERTY,PROJECT-EXPENDITURE-TYPE'
      }
      API.dictValByCodes(param)
        .then(res => {
          res.forEach(dicItem => {
            switch (dicItem.code) {
              case 'PROJECT-SOURCE':
                this.sourceList = dicItem.dictionarys
                break
              case 'DEVELOP-PROPERTY':
                this.devPropertyList = dicItem.dictionarys
                break
              case 'PROJECT-EXPENDITURE-TYPE':
                this.pjCostTypeList = dicItem.dictionarys
                break
            }
          })
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    mapCodeToName () {

    },
    //项目类型
    getProjectType () {
      API.dictValByCode('PROJECT-TYPE')
        .then(res => {
          this.typeOptions = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    //项目级别
    getProjectLevel () {
      API.dictValByCode('PROJECT-LEVEL')
        .then(res => {
          this.levelList = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    }
  }
}
</script>
<style  lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px){
  /deep/ .head-con{
    width: 1000px !important;
  }
  /deep/ .main-container{
    width: 1000px !important;
  }
  /deep/ .nav-menu{
    left: calc(50% + 520px) !important;
  }
}

@media screen and (max-width: 1364px){
  /deep/ .head-con{
    width: 960px !important;
  }
  /deep/ .main-container{
    width: 960px !important;
  }
  /deep/ .nav-menu{
    left: calc(50% + 500px) !important;
  }
}

.change-flow-contrast-detail{
  background : #f6f6f6;
  .back-top{
    position: fixed;
    bottom: 20px;
    right : 10px;
    cursor: pointer;
    img{
      width: 50px;
      height: 50px;
    }
  }
  .top-head{
    height: 50px;
    background : #fff;
    box-shadow: 0 4px 4px 0 rgba(220,223,230,0.50);
    margin-bottom: 20px;
    i{
      margin-right: 10px;
      cursor: pointer;
      &:before {
        margin-right: 5px;
      }
    }
    .head-con{
      height: 50px;
      line-height: 50px;
      width: 1180px;
      margin: 0 auto;
      position: relative;
      font-size: 16px;
      .head-title{
        display: flex;
        width: 100%;
        .version-name{
          width: 50%;
          height: 50px;
          line-height: 50px;
        }
        .head-name{
          @include background-color($color-blue,0.1);
          @include border($color-blue,0.5);
          @include color();
          border-radius: 2px;
          padding: 0 4px;
          margin-right: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          max-width: 250px;
          text-align: center;
          height: 30px;
          line-height: 30px;
          vertical-align: middle;
          cursor: pointer;
        }
      }
      .logo-img{
        position: absolute;
        top: 15px;
        right: 0;
      }
    }
  }

  .main-container{
    width: 1180px;
    margin: 0 auto;
    height: calc(100vh - 70px);
    .project-title{

      font-size: 26px;
      font-weight: 600;
      color: #333333;
      text-align: center;
      line-height: 26px;
      margin-top: 15px;
      margin-bottom: 15px;
    }

    .nav-menu{
      position: fixed;
      left: calc(50% + 630px);
      top : 100px;
      border-left: 1px solid #e5e5e5;
      padding : 20px 10px;
      z-index: 9;

      .nav-menu-item{
        display: block;
        position: relative;
        margin: 12px 0;

        &:hover{
          @include color();
        }

        &.item-active{
          @include color();

          &::after{
            display: inline-block;
            position: absolute;
            content :'';
            left : -17px;
            top : 3px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            @include border();
            border-width: 4px !important;
            background: #fff;
          }
        }

      }
    }

    }
    .main-content{
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
</style>
