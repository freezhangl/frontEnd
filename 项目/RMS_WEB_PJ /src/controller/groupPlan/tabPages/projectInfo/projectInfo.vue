<template>
  <div class="project-detail">
    <div class="project-content">
      <div class="back-top" v-if="showBackTop" @click="backToTop">
        <img src="@/assets/icons/backtop.png" alt="">
      </div>
      <div class="main-container">
        <div class="version-info">
          <el-dropdown placement="bottom-start" @command="changeVersion" trigger="click">
            <span class="el-dropdown-link">
              {{curVersion.numVersionName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="version-info-menu">
              <!-- <el-scrollbar> -->
              <el-dropdown-item
                v-for="item in versionList"
                :key="item.versionNo"
                icon="el-icon-document"
                :command="item"
                :class="{'active-version':item.versionNo === curVersion.versionNo}">
                <span class="pop-vname">{{item.numVersionName}}</span>
                <span class="pop-bottom">{{item.createdBy}} {{formatDate(item.versionCreatedDate)}}</span>
              </el-dropdown-item>
              <!-- </el-scrollbar> -->
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <router-link v-if="isEditable" :to="{  path : '/projectInfo/projectInfo-edit/' + this.$route.params.projectCode}">
            <span class="vicon-btn">
              <i class="el-icon-edit"></i>
              <span>编辑</span>
            </span>
          </router-link> -->
          <span v-if="isEditable&&editFlag" class="vicon-btn" @click="editProject">
            <i class="el-icon-edit"></i>
            <span>编辑</span>
          </span>
          <span v-if="closePermission && isCloseVisible" class="vicon-btn" @click="closeProject">
            <i class="el-icon-circle-close"></i>
            <span>关闭项目</span>
          </span>
          <span class="tips" v-if="showChangeTips && approvePermission">
            <i class="el-icon-info"></i>你有一个未生效的项目信息变更，可发起变更流程使之生效
          </span>
        </div>
        <section class="nav-menu">
          <a
            class="nav-menu-item"
            v-for="(menu,idx) in navMenus"
            :key="menu.id"
            @click="slideNav(menu,idx)"
            :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
        </section>

        <div class="main-content">
          <!--  TODO : 将下面内容 替换成对应组件即可 -->
          <div id="basic-info">
            <basicInfo :receive-data="projectBaseInfo"></basicInfo>
          </div>

          <div id="attribute-info">
            <!-- 属性信息 -->
            <attributeInfoPreview
              v-if="JSON.stringify(projectAttribute) !== '{}'"
              :receive-data="projectBaseInfo"
              :project-attribute="projectAttribute"></attributeInfoPreview>
            <attributeInfoPreviewDefault
              :receive-data="projectBaseInfo"
              v-else></attributeInfoPreviewDefault>
          </div>

          <div id="product-info" v-if="projectCategory==='u'&&hasProductInfo">
            <product-info-detail
              ref="productInfo"
              :receive-data="projectProductInfoList"></product-info-detail>
          </div>

          <div id="resource-info" v-if="projectCategory==='u'&&hasResourceInfo">
            <res-info-detail
              ref="resourceInfo"
              :receive-data="projectResourceInfo"></res-info-detail>
          </div>

          <div id="team-info">
            <!-- 需求单位 非研发包 -->
            <DSTeamInfoDetail v-if="projectCP === 'ds'" :project-company-list="projectCompanyList" :project-class="projectBaseInfo.projectClass"></DSTeamInfoDetail>
            <!-- 需求单位 研发包 -->
            <DGTeamInfoDetail v-if="projectCP === 'dg'" :project-company-list="projectCompanyList"></DGTeamInfoDetail>
            <!-- 承担单位 非研发包 -->
            <USTeamInfoDetail v-if="projectCP === 'us'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList"></USTeamInfoDetail>
            <!-- 承担单位 研发包 -->
            <UGTeamInfoDetail v-if="projectCP === 'ug'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList"></UGTeamInfoDetail>
          </div>

          <div id="project-budget" ref="projectBudget">
            <!-- 需求单位 非研发包 -->
            <DSProjectBudget v-if="projectCP === 'ds'" :version-no="curVersion.versionNo"></DSProjectBudget>
            <!-- 需求单位 研发包 -->
            <DGProjectBudget v-if="projectCP === 'dg'" :budget-info="costBudgetList"></DGProjectBudget>
            <!-- 承担单位 非研发包、研发包 -->
            <!-- <UProjectBudget v-if="projectCategory==='u'" :budget-info="budgetData"></UProjectBudget> -->
            <!-- 承担单位 总分、分总模式 -->
            <UBudgetDetail v-if="projectCategory==='u'&&budgetData" :budget-info="budgetData"></UBudgetDetail>
          </div>

          <div id="subproject-info"  ref="subproject">
            <!-- 需求单位 -->
            <DSubprojectInfo
              v-if="projectCategory==='d'"
              :receive-data='subProjectInfoList'
              :project-base-info="projectBaseInfo"
              :version-no="curVersion.versionNo"></DSubprojectInfo>
            <!-- 承担单位 -->
            <USubprojectInfo
              v-if="projectCategory==='u'"
              :receive-data='subProjectInfoList'
              :project-base-info="projectBaseInfo"
              :version-no="curVersion.versionNo"></USubprojectInfo>
          </div>

          <div id="milestone" v-if="isShowMilestone && projectCP!=='dg'">
            <!-- 需求单位 非研发包 -->
            <DSMilestoneInfo v-if="projectCP === 'ds'" :receive-data="projectMileStones"></DSMilestoneInfo>
            <!-- 承担单位 非研发包、研发包 -->
            <UMilestoneInfo v-if="projectCategory==='u'" :receive-data="projectMileStones"></UMilestoneInfo>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_groupPlanProject'
import basicInfo from '@/controller/groupPlan/components/basic/detail'
import DSProjectBudget from '@/controller/groupPlan/components/budget/DSBudget'
import DGProjectBudget from '@/controller/groupPlan/components/budget/DGBudget'
import UBudgetDetail from '@/controller/groupPlan/components/budget/UBudgetDetail'
import DSubprojectInfo from '@/controller/groupPlan/components/subproject/DSubprojectDetail'
import USubprojectInfo from '@/controller/groupPlan/components/subproject/USubprojectDetail'
import DSMilestoneInfo from '@/controller/groupPlan/components/milestone/DSMilestoneDetail'
import UMilestoneInfo from '@/controller/groupPlan/components/milestone/UMilestoneDetail'
import DSTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/DSTeamInfo/DSTeamInfoDetail'
import DGTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/DGTeamInfo/DGTeamInfoDetail'
import USTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/USTeamInfo/USTeamInfoDetail'
import UGTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/UGTeamInfo/UGTeamInfoDetail'
import attributeInfoPreview from '@/controller/groupPlan/components/attributeInfo/detail'
import attributeInfoPreviewDefault from '@/controller/groupPlan/components/attributeInfo/detailDefault'
import ProductInfoDetail from '@/controller/groupPlan/components/productInfo/productInfoDetail.vue'
import ResInfoDetail from '../../components/resourceInfo/resInfoDetail.vue'
import bus from '@/common/bus'

export default {
  data () {
    return {
      meberEditFlag: false, //如果为 true 就代表是项目成员进来的并且可以编辑
      budgetData: null,
      editPermission: false, //编辑权限
      closePermission: false, //关闭项目权限
      // editFlag: true, //debug
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      isEditable: false, // 是否有编辑权限 debug
      showBackTop: false,
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      costBudgetList: [], // 项目预算
      projectCompanyList: [], // 团队信息 - 公司列表
      projectTeamList: [], // 团队信息-承担单位项目观察员和专家
      projectAchievementList: [], // 预期成果
      subProjectInfoList: [], //子项目信息
      projectMileStones: [], // 里程碑信息
      projectProductInfoList: [], //产品信息
      projectResourceInfo: {}, //资源信息
      navMenus: [
        { name: '基本信息', id: 'basic-info' },
        { name: '属性信息', id: 'attribute-info' },
        { name: '产品信息', id: 'product-info' },
        { name: '资源信息', id: 'resource-info' },
        { name: '团队信息', id: 'team-info' },
        { name: '项目预算', id: 'project-budget' },
        { name: '子项目列表', id: 'subproject-info' },
        { name: '里程碑', id: 'milestone' }
      ],
      isShowMilestone: true,
      projectCode: this.$route.params.projectCode || '',
      versionList: [], //版本列表
      curVersion: {
        numVersionName: '',
        versionName: '',
        versionNo: ''
      }, //当前版本
      showChangeTips: false, //是否提示用户发起变更流程
      isCloseVisible: false, //是否展示，表单状态为已终止、已结项
      developPackage: '', //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.params.projectCategory || '', //需求方项目d还是承担方项目u
      projectCP: '', //需求方研发包项目dg，需求方非研发包项目ds，承担方研发包项目ug，承担方非研发包项目us
      approvePermission: false, //项目业务流程权限 03
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true //项目信息中有资源信息
    }
  },
  components: {
    basicInfo,
    DSProjectBudget,
    DGProjectBudget,
    DSubprojectInfo,
    USubprojectInfo,
    DSMilestoneInfo,
    UMilestoneInfo,
    DSTeamInfoDetail,
    DGTeamInfoDetail,
    USTeamInfoDetail,
    UGTeamInfoDetail,
    attributeInfoPreview,
    attributeInfoPreviewDefault,
    ProductInfoDetail,
    ResInfoDetail,
    UBudgetDetail
  },
  computed: {
    editFlag () {
      return this.editPermission
    }
  },
  mounted () {
    this.getProjectVersion()
    this.getPermission() //获取项目权限
    this.getProjectInfo()
    this.isShowChangeTip()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm')
      // return dayjs(val)
      //   .format('YYYY-MM-DD HH:mm')
    },
    // 查询项目版本列表
    getProjectVersion () {
      API.getProjectVersionList(this.projectCode)
        .then(res => {
          if (res) {
            res.forEach((item, index) => {
              item.numVersionName = `#${res.length - index} ${item.versionName}`
              if (item.effective) {
                this.curVersion = item
                this.budgetData = {
                  isEdit: false,
                  projectCode: this.$route.params.projectCode,
                  versionNo: item.versionNo
                }
              }
            })
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
    //选择某一版本
    changeVersion (item) {
      this.$router.push({
        path: '/groupPlan/projectHistoryDetail',
        query: {
          versionNo: item.versionNo,
          projectCode: this.projectCode,
          developPackage: this.developPackage,
          projectCategory: this.projectCategory
        }
      })
    },
    //编辑项目
    editProject () {
      if (this.projectCategory === 'd') {
        API.checkProjectEdit({ projectCode: this.$route.params.projectCode || this.projectCode })
          .then(res => {
            this.$router.push({
              path: '/groupPlan/projectEdit/' + this.$route.params.projectCode,
              query: {
                meberEditFlag: this.meberEditFlag,
                developPackage: this.developPackage,
                projectCategory: this.projectCategory,
                versionNo: this.versionList[0].versionNo //获取版本列表中最新的版本
              }
            })
          })
          .catch(e => {
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '无法编辑项目！',
                type: 'error',
                showClose: true
              })
            }
          })
      } else {
        this.$router.push({
          path: '/groupPlan/projectEdit/' + this.$route.params.projectCode,
          query: {
            meberEditFlag: this.meberEditFlag,
            developPackage: this.developPackage,
            projectCategory: this.projectCategory,
            versionNo: this.versionList[0].versionNo //获取版本列表中最新的版本
          }
        })
      }
    },
    //关闭项目
    closeProject () {
      if (this.projectCategory === 'u') {
        this.$confirm(' ', '您确定是否要关闭项目，关闭后不可再进行费用报账?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(() => {
            API.projectClose(this.projectCode)
              .then(res => {
                this.$message({
                  message: '项目成功关闭！',
                  type: 'success',
                  showClose: true
                })
                this.getProjectInfo() //重新获取项目信息
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
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消关闭'
            })
          })
      } else {
        this.$confirm(' ', '您确定是否要关闭项目?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(() => {
            API.projectClose(this.projectCode)
              .then(res => {
                this.$message({
                  message: '项目成功关闭！',
                  type: 'success',
                  showClose: true
                })
                this.getProjectInfo() //重新获取项目信息
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
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消关闭'
            })
          })
      }
    },
    //是否提示发起变更
    isShowChangeTip () {
      API.isShowChangeTip({ projectCode: this.projectCode })
        .then(res => {
          if (res === 2) {
            this.showChangeTips = res
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
    //获取项目权限
    getPermission () {
      this.verificationPermission('02')
      this.verificationPermission('03') //业务流程提交-关闭项目
    },
    //查询权限
    verificationPermission (authCode) {
      const param = {
        permissionCode: authCode,
        projectCode: this.$route.params.projectCode
      }
      API.checkUserProjectPermission(param)
        .then(res => {
          switch (authCode) {
            case '02':
              this.editPermission = res
              if (!res) {
                this.verificationPermission('14')
              }
              break
            case '03':
              this.closePermission = res
              this.approvePermission = res
              break
            case '14':
              this.editPermission = res
              this.meberEditFlag = res.toString()
              break
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '权限获取失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取详情信息(全部)
    getProjectInfo () {
      let interFaceName = ''
      if (this.$route.query.projectCategory === 'd') {
        interFaceName = 'queryEffectiveProjectInfoD'
      } else {
        interFaceName = 'queryEffectiveProjectInfoU'
      }
      // if (!interFaceName) return
      let params = {
        projectCode: this.$route.params.projectCode,
        allSubProjectInfo: false
      }
      API[interFaceName](params)
        .then(res => {
          this.projectBaseInfo = res.projectBaseInfo
          let status = res.projectBaseInfo.projectDetailsStatus
          //编辑权限 -- 草稿0、已立项2、已预立项11 状态可编辑
          this.isEditable = status === '0' || status === '2' || status === '11'
          this.isCloseVisible = status === '6' || status === '7'
          // 属性信息
          if (res.projectAttribute) {
            this.projectAttribute = res.projectAttribute.extendedAttributes === '[]' || res.projectAttribute.extendedAttributes === '' ? {} : res.projectAttribute
          }
          this.costBudgetList = res.costBudgetList
          this.projectAchievementList = res.projectAchievementList
          this.projectMileStones = res.projectMileStoneList
          if (res.projectMileStoneList === null || res.projectMileStoneList.length === 0) {
            this.isShowMilestone = false
            let index = -1
            this.navMenus.some((ele, i) => {
              if (ele.id === 'milestone') {
                index = i
                return true
              }
            })
            if (index > -1) {
              this.navMenus.splice(index, 1)
            }
          }
          this.subProjectInfoList = res.subProjectInfoList
          document.title = res.projectBaseInfo.projectName || '未定义'
          this.projectCompanyList = res.projectCompanyList
          if (this.projectCategory === 'u') { //承担单位
            this.projectTeamList = res.projectTeamList //项目观察员和专家
          }
          if (this.projectCategory === 'u') {
            //产品信息
            this.projectProductInfoList = res.projectProductInfoList || []
            this.hasProductInfo = this.projectProductInfoList && this.projectProductInfoList.length > 0
            if (!this.hasProductInfo) {
              this.deleteNavItem('product-info')
            }
            //资源信息
            this.projectResourceInfo = res.projectResourceInfo || {}
            this.hasResourceInfo = !!((this.projectResourceInfo && JSON.stringify(this.projectResourceInfo) !== '{}'))
            if (!this.hasResourceInfo) {
              this.deleteNavItem('resource-info')
            }
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
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
    },
    slideNav (menu, idx) {
      if (this.timer) {
        window.clearTimeout(this.timer)
      }

      this.navIdx = idx
      this.clearFlag = false
      document.getElementById(menu.id)
        .scrollIntoView({
          behavior: 'smooth'
        })

      this.timer = setTimeout(() => {
        this.clearFlag = true
      }, 1000)
    },
    scrollWindow () {
      if (!this.clearFlag) {
        return
      }

      let doc = document.documentElement || document.body
      if (doc === null) return
      let sTop = doc.scrollTop
      let cHei = doc.clientHeight
      let sHei = doc.scrollHeight

      if (sTop > 500) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }

      if (sTop + cHei + 5 >= sHei) {
        this.navIdx = this.navMenus.length - 1
        return false
      }

      let posArr = []

      this.navMenus.forEach(menu => {
        posArr.push(document.getElementById(menu.id).offsetTop)
      })

      let _idx = 0

      if (posArr[posArr.length - 1] <= sTop) {
        this.navIdx = posArr.length - 1
      } else {
        for (let i = 0; i < posArr.length - 1; i++) {
          if (sTop >= posArr[i] && sTop < posArr[i + 1]) {
            _idx = i
            break
          }
        }
        this.navIdx = _idx
      }
    },
    setMilestoneVisible (show) {
      this.isShowMilestone = show
      if (!show) {
        let index = -1
        this.navMenus.some((ele, i) => {
          if (ele.id === 'milestone') {
            index = i
            return true
          }
        })
        if (index > -1) {
          this.navMenus.splice(index, 1)
        }
      }
    },
    //删除菜单项
    deleteNavItem (id) {
      let index = -1
      this.navMenus.some((ele, i) => {
        if (ele.id === id) {
          index = i
          return true
        }
      })
      if (index > -1) {
        this.navMenus.splice(index, 1)
      }
    }
  },
  created () {
    this.projectCode = this.$route.params.projectCode || ''
    this.developPackage = this.$route.query.developPackage || ''
    this.projectCategory = this.$route.query.projectCategory || ''
    let isPackage = this.developPackage === 'IS_RD_0' ? 's' : 'g'
    this.projectCP = this.projectCategory + isPackage

    if (this.projectCP === 'dg') { //不展示里程碑
      let index = -1
      this.navMenus.some((ele, i) => {
        if (ele.id === 'milestone') {
          index = i
          return true
        }
      })
      if (index > -1) {
        this.navMenus.splice(index, 1)
      }
    }

    if (this.projectCategory === 'd') {
      this.deleteNavItem('product-info')
      this.deleteNavItem('resource-info')
    }

    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
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

.project-detail{
  .project-content{
    overflow: auto;
    min-height: 100vh;
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

        .logo-img{
          float: right;
          margin-top: 15px;
        }
      }
    }

    .main-container{
      width: 1180px;
      margin: 0 auto;
      .version-info{
        font-size: 14px;
        color: #333333;
        margin-top: 15px;
        margin-bottom: 15px;
        .el-dropdown-link{
          cursor: pointer;
        }
        .vicon-btn{
          margin-left: 25px;
          cursor: pointer;
          i{
            margin-right: 8px;
          }
        }
        .tips{
          font-size: 12px;
          margin-left: 20px;
          @include color();
          i{
            margin-right: 8px;
          }
        }
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
}
.version-info-menu /deep/{
  // height: 300px;
  // overflow-y: auto;
  max-height: 300px;
  overflow-y: auto;
  .el-scrollbar {
    width: 100%;
    height: 100%;
    /deep/.el-scrollbar__wrap{
      overflow-x: hidden;
      height: 99%;
    }
  }
  .pop-bottom{
    display: block;
    font-size: 12px;
    margin-left: 19px;
    line-height: 15px;
    position: relative;
    top: -5px;
    color: #999;
  }
  .el-dropdown-menu__item.active-version{
    @include color($color-blue,0.8);
    .pop-bottom{
      @include color($color-blue,0.8);
    }
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.active-version):hover{
    .pop-bottom{
      @include color($color-blue,0.8);
    }
  }
}
</style>
