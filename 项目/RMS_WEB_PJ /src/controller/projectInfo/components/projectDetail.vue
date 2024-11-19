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
              <el-dropdown-item
                v-for="(item,index) in versionList"
                :key="item.versionNo"
                icon="el-icon-document"
                :command="item"
                :class="{'active-version':item.versionNo === curVersion.versionNo}">
                <span class="pop-vname" v-if="index!=0">{{item.numVersionName}}</span>
                <span class="pop-vname" v-if="index==0">{{item.numVersionName}}(最新)</span>
                <span class="pop-bottom">{{item.createdBy}} {{formatDate(item.versionCreatedDate)}}</span>
              </el-dropdown-item>
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
          <span v-if="isCloseVisible" class="vicon-btn" @click="closeProject">
            <i class="el-icon-circle-close"></i>
            <span>关闭项目</span>
          </span>
          <span class="tips" v-if="showChangeTips">
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

          <div id="property-info">
            <!-- <div style="background:#fff;height:50px;margin-bottom: 20px;">属性信息1</div> -->
            <attributeInfoPreview
              v-if="projectAttribute"
              :receive-data="projectBaseInfo"
              :project-attribute="projectAttribute"></attributeInfoPreview>
            <attributeInfoPreviewDefault
              :receive-data="projectBaseInfo"
              v-if="!projectAttribute"></attributeInfoPreviewDefault>
          </div>

          <div id="product-info" v-if="hasProductInfo">
            <product-info-detail
              ref="productInfo"
              :receive-data="productInfoList"></product-info-detail>
          </div>

          <div id="resource-info" v-if="hasResourceInfo">
            <res-info-detail
              ref="resourceInfo"
              :receive-data="resourceInfo"></res-info-detail>
          </div>

          <div id="team-info">
            <teamInfo :receive-data="projectTeamList"></teamInfo>
          </div>

          <div id="project-budget">
            <projectBudget :receive-data="costBudgetList"></projectBudget>
          </div>

          <div id="sub-project">
            <subproject :receive-data="subProjectInfoList"></subproject>
          </div>

          <div id="milestone" v-if="isShowMilestone">
            <milestoneInfo :receive-data="projectMileStones" @detailTableMilestoneShowOrHide="setMilestoneVisible"></milestoneInfo>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_project'
import basicInfo from '../../extraProject/components/basic/detail'
import teamInfo from '../../extraProject/components/teamInfo/detail'
import projectBudget from '../../extraProject/components/budget/detail'
import milestoneInfo from '../../extraProject/components/basic/milestone/detailListMilestone'
import subproject from '../../extraProject/components/subproject/detail'
import attributeInfoPreview from '../../extraProject/components/attributeInfo/detail'
import attributeInfoPreviewDefault from '../../extraProject/components/attributeInfo/detailDefault'
import ProductInfoDetail from '../../extraProject/components/product/productInfoDetail.vue'
import ResInfoDetail from '../../extraProject/components/resource/resInfoDetail.vue'
import { getStore } from '@/store'

export default {
  data () {
    return {
      editFlag: false,
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      isEditable: false, // 是否有编辑权限
      showBackTop: false,
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      costBudgetList: [], // 项目预算
      projectTeamList: [], // 团队信息
      subProjectInfoList: [], // 预期成果
      projectMileStones: [], // 里程碑信息
      productInfoList: [], //产品信息
      resourceInfo: {}, //资源信息
      navMenus: [
        {
          name: '基本信息',
          id: 'basic-info'
        },
        {
          name: '属性信息',
          id: 'property-info'
        },
        { name: '产品信息', id: 'product-info' },
        { name: '资源信息', id: 'resource-info' },
        {
          name: '团队信息',
          id: 'team-info'
        },
        {
          name: '项目预算',
          id: 'project-budget'
        },
        {
          name: '子项目',
          id: 'sub-project'
        },
        {
          name: '里程碑',
          id: 'milestone'
        }
      ],
      isShowMilestone: true,
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true, //资源信息中有产品信息
      projectCode: this.$route.params.projectCode || '',
      versionList: [], //版本列表
      curVersion: {
        numVersionName: '',
        versionName: '',
        versionNo: ''
      }, //当前版本
      showChangeTips: false, //是否提示用户发起变更流程
      isCloseVisible: false, //是否具有关闭项目权限
      resultsTypeOptions: []
    }
  },
  components: {
    basicInfo,
    teamInfo,
    projectBudget,
    milestoneInfo,
    subproject,
    attributeInfoPreview,
    attributeInfoPreviewDefault,
    ResInfoDetail,
    ProductInfoDetail
  },
  computed: {},
  mounted () {
    this.getProjectVersion()
    this.verificationPermission()
    // this.getProjectInfo()
    this.isShowChangeTip()
    this.buttonIsVisiable('1') //编辑按钮权限
    this.buttonIsVisiable('2') //关闭按钮权限
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm')
    },
    // 查询项目版本列表
    getProjectVersion () {
      let params = {
        projectCode: this.projectCode,
        userAccount: getStore().getters['USERENTITY/userInfo'].userAuth.uid
      }
      API.getProjectVersion(params)
        .then(res => {
          if (res) {
            res.forEach((item, index) => {
              item.numVersionName = `#${res.length - index} ${item.versionName}`
            })
            this.versionList = res
            this.getRightVersion()
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
    // 获取当前版本信息
    getRightVersion () {
      API.getRightVersionByProCode({ projectCode: this.projectCode })
        .then(res => {
          if (res) {
            this.versionList.some(item => {
              if (item.versionNo === res.versionNo) {
                this.curVersion = item
                this.getProjectDetail(res.versionNo)
              }
            })
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
        path: '/projectInfo/historyVersionDetail',
        query: {
          versionNo: item.versionNo,
          projectCode: this.projectCode
        }
      })
    },
    //编辑项目
    editProject () {
      if (this.projectBaseInfo && this.projectBaseInfo.carryOverFlag === '1') {
        this.$message({
          message: '当前项目处于结转中，不允许编辑！',
          type: 'error',
          showClose: true
        })
        return
      }
      this.$router.push({
        path: '/projectInfo/projectInfo-edit/' + this.$route.params.projectCode,
        query: {
          versionNo: this.versionList[0].versionNo //获取版本列表中最新的版本
        }
      })
    },
    //关闭项目
    closeProject () {
      let params = {
        projectCode: this.projectCode,
        userAccount: getStore().getters['USERENTITY/userInfo'].userAuth.uid
      }
      this.$confirm(' ', '是否关闭项目？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          API.closeProject(params)
            .then(res => {
              this.$message({
                message: '项目成功关闭！',
                type: 'success',
                showClose: true
              })
              // this.getProjectInfo() //重新获取项目信息
              this.getProjectDetail(this.curVersion.versionNo) //重新获取项目信息
              this.buttonIsVisiable('2') //关闭按钮权限
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
        .catch(e => {
          this.$message({
            type: 'info',
            message: '已取消关闭项目'
          })
        })
    },
    //是否提示发起变更
    isShowChangeTip () {
      API.isShowChangeTip({ projectCode: this.projectCode })
        .then(res => {
          this.showChangeTips = res
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
    //编辑和关闭按钮是否可见，type:1编辑，2关闭
    buttonIsVisiable (type) {
      let params = {
        projectCode: this.projectCode,
        type: type
      }
      API.buttonIsVisiable(params)
        .then(res => {
          if (type === '1') {
            this.isEditable = res
          }
          if (type === '2') {
            this.isCloseVisible = res
          }
        })
        .catch(e => {
        })
    },
    verificationPermission () {
      const param = {
        // permissionCode: '03',
        projectCode: this.$route.params.projectCode
        // projectType: '03'
      }
      API.verificationPermission(param)
        .then(res => {
          let flag = false
          if (res.indexOf('00') > -1 || res.indexOf('02') > -1) {
            flag = true
          } else {
            flag = false
          }
          this.editFlag = flag
        })
    },
    // 获取详情信息(全部)
    getProjectInfo () {
      API.queryEffectiveProjectInfo(this.$route.params.projectCode)
        .then(res => {
          this.projectBaseInfo = res.projectBaseInfo
          this.projectAttribute = res.projectAttribute
          this.costBudgetList = res.costBudgetList
          this.projectTeamList = res.projectTeamList
          this.subProjectInfoList = res.subProjectInfoList
          this.projectMileStones = res.projectMileStones
          this.productInfoList = res.projectProductInfoList
          this.resourceInfo = res.projectResourceInfoDto
          document.title = res.projectBaseInfo.projectName || '未定义'
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
    },
    //获取对应版本的项目详情
    getProjectDetail (versionNo) {
      let params = {
        projectCode: this.projectCode,
        versionNo: versionNo,
        allSubProjectInfo: false
      }
      API.projectInfoByVersion(params)
        .then(res => {
          this.projectBaseInfo = res.projectBaseInfo
          this.projectAttribute = res.projectAttribute
          this.costBudgetList = res.costBudgetList
          this.projectTeamList = res.projectTeamList
          this.subProjectInfoList = res.subProjectInfoList || []
          this.subProjectInfoList.forEach(item => {
            item.versionNo = versionNo
            item.isUpdate = false
          })
          this.projectMileStones = res.projectMileStones
          // this.productInfoList = res.projectProductInfoList
          // this.resourceInfo = res.projectResourceInfoDto
          //产品信息
          this.productInfoList = res.projectProductInfoList || []
          this.hasProductInfo = this.productInfoList && this.productInfoList.length > 0
          if (!this.hasProductInfo) {
            this.deleteNavItem('product-info')
          }
          //资源信息
          this.resourceInfo = res.projectResourceInfoDto || {}
          this.hasResourceInfo = !!((this.resourceInfo && JSON.stringify(this.resourceInfo) !== '{}'))
          if (!this.hasResourceInfo) {
            this.deleteNavItem('resource-info')
          }
          document.title = res.projectBaseInfo.projectName || '未定义'
        })
        .catch(e => {
          this.projectBaseInfo = []
          this.projectAttribute = {}
          this.costBudgetList = []
          this.projectTeamList = []
          this.subProjectInfoList = []
          this.projectMileStones = []
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
    }
  },
  created () {
    this.projectCode = this.$route.params.projectCode || ''
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
.self-message-box-delete .el-message-box__content .el-message-box__status{
  top: -27px;
}
</style>
