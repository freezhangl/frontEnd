<template>
  <div class="independentProjectContent">
    <div class="searchContent">
      <el-form
        :model="searchForm"
        ref="searchForm"
        :inline="true"
        label-width="120px"
        label-position="right">
        <el-form-item label="年份: " prop="projectYear">
          <el-date-picker
            v-model="searchForm.projectYear"
            format="yyyy"
            type="year"
            placeholder="全部年份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目状态: " class="formStatus" prop="projectDetailsStatus">
          <template>
            <div class="proStatus">
              <SpAdvancedSelect
                :data.sync="searchForm.projectDetailsStatus"
                :list="projectStatus"
                key-id="projectStatusContent"
                is-more-type="even"
                value-txt="value"
                label-txt="label"
                placeholder="全部"
                @changeEvent="currentValue"
              ></SpAdvancedSelect>
              <el-tooltip
                :content="'活动中项目包含：草稿、预立项审批中、预立项、立项审批中、立项、变更审批中、终止审批中、结项审批中项目'"
                placement="top"
                effect="dark">
                <i class="el-icon-info accountingNo"></i>
              </el-tooltip>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="项目名称: " prop="projectName">
          <el-input v-model.trim="searchForm.projectName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="search-btn">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="searchProject('independentProject')">查询</el-button>
          <el-button
            class="normal-btn"
            icon="el-icon-refresh-left"
            @click="resetProjectList('independentProject')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="project-list">
      <div class="table-head" v-if="isShowCreateBtn">
        <span style="float: right;">
          <el-button class="normal-btn" @click="openNewWindow">计划外新增</el-button>
          <el-button
            class="normal-btn"
            style="width: 160px"
            @click="openPlansCreate"
          >按集团批复计划创建</el-button>
        </span>
      </div>
      <el-table :data="projectList" style="width: 100%" :show-header="true">
        <el-table-column
          prop="projectName"
          label="项目名称"
          :highlight-current-row="true"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span @click="openDetailWindow(scope.row.projectCode)" class="jump-detail">
              <i class="el-icon-document"></i>
              <span style="font-weight: bold">
                {{scope.row.projectName}}
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="projectCode"
          label="项目编号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="当前状态"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.projectDetailsStatus | projectStatusFilter }}
          </template>
        </el-table-column>
        <el-table-column
          label="本单位项目分类"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.projectTypeValue }}
          </template>
        </el-table-column>
        <el-table-column
          prop="projectManagerName"
          label="项目经理"
          show-overflow-tooltip></el-table-column>
        <el-table-column
          label="是否研发包"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.developPackage | developPackageFilter }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 计划创建弹框 -->
    <el-dialog
      v-dialogDrag
      title="创建项目-选择本年度研发计划"
      :visible.sync="plansCreate"
      width="925px"
      :before-close="planCreateCancle"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <!-- 选择项 -->
      <el-form
        ref="plansCreateForm"
        :model="plansCreateForm"
        :inline="true"
        label-width="100px">
        <div class='plan-create'>
          <div style="width:680px;display:inline-block;">
            <el-form-item
              style="margin-right:20px"
              label="项目名称:"
              prop="projectName"
            >
              <el-input
                @keyup.enter.native="getPlanList"
                v-model.trim="plansCreateForm.projectName"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div style="margin-bottom: 10px">
          <el-form-item
            style="margin-right:20px"
            label="项目编码:"
            prop="projectCode"
          >
            <el-input
              @keyup.enter.native="getPlanList"
              v-model.trim="plansCreateForm.projectCode"
              clearable
              style="width:220px"></el-input>
          </el-form-item>
          <el-form-item
            label="项目类别:"
            prop="projectType"
          >
            <el-tooltip
              placement="top-start"
              :content="getTooltipName(plansCreateForm.projectCategory,projectTypeOption)"
              :disabled="!getTooltipName(plansCreateForm.projectCategory,projectTypeOption)">
              <el-select
                @keyup.enter.native="getPlanList"
                v-model="plansCreateForm.projectCategory"
                placeholder="请选择"
                style="width:220px"
                clearable>
                <el-option
                  v-for="item in projectTypeOption"
                  :key="item.valueCode"
                  :label="item.name"
                  :value="item.valueCode"
                >
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    :content="item.name"
                    :disabled="!showToolTip(item.name, 180)">
                    <span>{{item.name}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>
          <el-form-item style="margin-right:0;margin-bottom:10px">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="planCreateSearch">查询</el-button>
            <el-button
              class="normal-btn"
              icon="el-icon-refresh-left"
              @click="palnCreateReset">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- table -->
      <el-table
        v-loading="loading"
        :data="planCreateList"
        :header-cell-style="tableHeadStyle"
        max-height="276px"
        :is-pagination="false"
        @refresh="getPlanList">
        <el-table-column label="" width="48">
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.planProjectCode"
              v-model="radioPlan"
              @change.native="planCreateSelect(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          class-name="padding-col"
          label="项目编码"
          prop="projectCode"
          align="left"
          :show-overflow-tooltip="true"
          :resizable="false"></el-table-column>
        <el-table-column label="项目名称" class-name="padding-col" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="plan-create-name" style="cursor:pointer;" @click="goInfo(scope.row.planProjectCode)">{{scope.row.projectName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="padding-col"
          label="项目类别"
          prop="projectCategoryName"
          align="center"
          :show-overflow-tooltip="true"
          :resizable="false"></el-table-column>
        <el-table-column
          class-name="padding-col"
          label="期间归属"
          prop="periodBelongType"
          align="center"
          :show-overflow-tooltip="true"
          :resizable="false"></el-table-column>
        <el-table-column
          class-name="padding-col"
          label="计划立项日期"
          prop="planStartDate"
          align="center"
          :show-overflow-tooltip="true"
          :resizable="false"></el-table-column>
        <el-table-column
          class-name="padding-col"
          label="计划结项日期"
          prop="planEndDate"
          align="center"
          :show-overflow-tooltip="true"
          :resizable="false"></el-table-column>
        <!-- <el-table-column label="操作" class-name="padding-col" align="center">
          <template slot-scope="scope">
            <span style="cursor:pointer;color:#0b82ff" @click="editProject(scope.row.projectCode, scope.row.versionNo)">编辑</span>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <!-- <div style="text-align: center;margin-top: 18px;" v-show="planCreateList.length > 0">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizeList"
          :page-size="pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="pageTotal">
        </el-pagination>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="planCreateCancle">取 消</el-button>
        <el-button type="primary" @click="planCreateSure">按计划创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/serve/API_project'
import singleAPI from '@/serve/API_single'

import { isShowToolTip } from '@/utils/common.js'
import { mapGetters } from 'vuex'
export default {
  name: 'showIndependentProject',
  components: {

  },
  data () {
    return {
      tableHeadStyle: {
        background: '#F4F4F4',
        color: 'rgba(0,0,0,0.85)'
      },
      loading: false,
      projectList: [],
      timer: [],
      // projectStatus: [
      //   {
      //     value: 0,
      //     label: '草稿'
      //   },
      //   {
      //     value: 10,
      //     label: '预立项审批中'
      //   },
      //   {
      //     value: 11,
      //     label: '已预立项'
      //   },
      //   {
      //     value: 1,
      //     label: '立项审批中'
      //   },
      //   {
      //     value: 2,
      //     label: '已立项'
      //   },
      //   {
      //     value: 3,
      //     label: '变更审批中'
      //   },
      //   {
      //     value: 4,
      //     label: '终止审批中'
      //   },
      //   {
      //     value: 5,
      //     label: '结项审批中'
      //   },
      //   {
      //     value: 6,
      //     label: '已终止'
      //   },
      //   {
      //     value: 7,
      //     label: '已结项'
      //   },
      //   {
      //     value: 8,
      //     label: '已关闭'
      //   }
      // ],
      projectStatus: [
        {
          value: [0, 1, 2, 3, 4, 5, 10, 11].toString(),
          label: '活动中项目'
        },
        {
          value: 6,
          label: '已终止'
        },
        {
          value: 7,
          label: '已结项'
        },
        {
          value: 8,
          label: '已关闭'
        }
      ],
      projectStatusContent: '',
      year: '', //传参的字段
      searchForm: {
        projectYear: null,
        projectName: '',
        projectDetailsStatus: [[0, 1, 2, 3, 4, 5, 10, 11].toString()],
        projectCategory: 'PC-SELF-UNIT'
      },
      typeOptions: [], //项目类型
      plansCreateForm: {
        projectName: '',
        projectCode: '',
        projectCategory: ''
      },
      projectTypeOption: [], // 项目类别的集合
      planCreateList: [],
      plansCreate: false, //控制计划创建显隐
      currentPage: 1, // 当前页码
      pageSize: 10,
      pageSizeList: [10, 20],
      pageTotal: 0,
      radioPlan: '',
      planCreateSelected: {}, // 当前选中的table行数据
      isShowCreateBtn: true
    }
  },
  // props: {
  //   searchForm: {
  //     type: Object,
  //     default: null
  //   },
  //   projectList: {
  //     type: Array,
  //     default: null
  //   }
  // },
  filters: {
    projectStatusFilter: function (val) {
      switch (parseInt(val)) {
        case 0 :
          return '草稿'
        case 10 :
          return '预立项审批中'
        case 11 :
          return '已预立项'
        case 1 :
          return '立项审批中'
        case 2 :
          return '已立项'
        case 3 :
          return '变更审批中'
        case 4 :
          return '终止审批中'
        case 5 :
          return '结项审批中'
        case 6 :
          return '已终止'
        case 7 :
          return '已结项'
        case 8 :
          return '已关闭'
        default:
          return ''
      }
    },
    developPackageFilter: function (val) {
      switch (val) {
        case '1':
          return '是'
        case '0':
          return '否'
        case 'IS_RD_1':
          return '是'
        case 'IS_RD_0':
          return '否'
      }
    }
  },
  computed: {
    ...mapGetters({
      menuResCode: 'USERENTITY/menuResCode'
    })
  },
  mounted () {
  },
  created () {
    this.getCheckCreateProject()
    this.intercept()
    this.myProjectList() //获取项目列表数据
  },
  methods: {
    // 是否可创建项目
    getCheckCreateProject () {
      API.checkCreateProject()
        .then(res => {
          this.isShowCreateBtn = res
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    //输入框添加浮显
    getTooltipName (item, list) {
      let toolTipName = ''
      list.forEach((iitem) => {
        if (iitem.valueCode === item) {
          toolTipName = iitem.name
        }
      })
      return toolTipName
    },
    getProjectType () {
      //项目类型
      API.dictValByCode('PROJECT-TYPE')
        .then(res => {
          this.typeOptions = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 日期格式化
    formatYDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY')
    },
    // 计划外新增打开新窗口
    openNewWindow () {
      let { href } = this.$router.resolve({
        path: '/projectInfo/projectInfo-edit',
        query: {
          menuResCode: this.menuResCode
        }
      })
      // 打开新的窗口
      let $window = window.open(href, '_blank')

      if (this.timer['newEdit']) {
        window.clearInterval(this.timer['newEdit'])
      }

      this.timer['newEdit'] = setInterval(() => {
        if ($window && $window.closed) {
          if (this.timer['newEdit']) {
            window.clearInterval(this.timer['newEdit'])
          }
          this.myProjectList()
          // this.$emit('myProjectList')
        }
      }, 500)
    },
    openDetailWindow (projectCode) {
      // 判断是否具有权限
      API.verificationPermission({ projectCode: projectCode })
        .then(res => {
          if (res.indexOf('00') > -1 || res.indexOf('01') > -1) {
            let { href } = this.$router.resolve({
              path: '/projectInfo/projectInfo-detail/' + projectCode
            })
            // 打开新的窗口
            let $window = window.open(href, '_blank')

            if (this.timer[projectCode]) {
              window.clearInterval(this.timer[projectCode])
            }

            this.timer[projectCode] = setInterval(() => {
              if ($window && $window.closed) {
                if (this.timer[projectCode]) {
                  window.clearInterval(this.timer[projectCode])
                }
                this.myProjectList()
                // this.$emit('myProjectList')
              }
            }, 500)
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '用户权限校验失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    openPlansCreate () {
      this.plansCreate = true
      this.getProjectTypeList()
    },
    // 计划创建查询
    planCreateSearch () {
      this.getPlanList()
    },
    // 计划重置
    palnCreateReset () {
      this.plansCreateForm.projectName = ''
      this.plansCreateForm.projectCode = ''
      this.plansCreateForm.projectCategory = ''
      this.planCreateList = []
      this.getPlanList()
    },
    // table选择
    planCreateSelect (index, row) {
      this.planCreateSelected = this.planCreateList[index]
    },
    // 跳转研发计划详情
    goInfo (planProjectCode) {
      // let routerUrl = this.$router.resolve({
      //   name: 'planInfo',
      //   query: { planProjectCode: planProjectCode, state: 1, auth: 3 }
      // })
      // window['refreshBacklogLsit'] = () => {
      // }
      // window.open(routerUrl.href, '_blank')
      let { href } = this.$router.resolve({
        path: '/plan/planCompany/editProject',
        query: {
          status: 'unedit',
          from: 2,
          planProjectCode: planProjectCode
        }
      })
      // 打开新的窗口
      let $window = window.open(href, '_blank')
    },
    //编辑项目
    editProject (projectCode, versionNo) {
      this.$router.push({
        path: '/projectInfo/projectInfo-edit/' + projectCode,
        query: {
          versionNo: versionNo //获取版本列表中最新的版本
        }
      })
    },
    // 关闭计划创建弹框
    planCreateCancle () {
      this.plansCreate = false
      this.palnCreateReset()
    },
    // 确定创建
    planCreateSure () {
      if (this.radioPlan === '') {
        this.$message({
          message: '请选择要创建的项目！',
          type: 'error',
          showClose: true
        })
        return
      }
      let str = this.planCreateSelected.projectCode + '/' + this.planCreateSelected.planYear
      singleAPI.savePlan(str)
        .then(res => {
          if (res) {
            this.$message({
              message: '创建成功',
              type: 'success',
              showClose: true
            })
            this.plansCreate = false
            this.palnCreateReset()
            this.myProjectList()
            setTimeout(() => {
              let { href } = this.$router.resolve({
                // path: '/projectInfo/projectInfo-detail/' + this.planCreateSelected.projectCode
                path: '/projectInfo/projectInfo-edit/' + this.planCreateSelected.projectCode,
                query: {
                  versionNo: res //获取版本列表中最新的版本
                }
              })
              window.open(href, '_blank')
            }, 1000)
          }
        })
        .catch(err => {
          this.loading = false
          if (err.selfError) return
          this.$message({
            message: err.message,
            type: 'error',
            showClose: true
          })
        })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getPlanList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getPlanList()
    },
    getPlanList () {
      this.radioPlan = ''
      let params = {
        projectName: this.plansCreateForm.projectName,
        projectCode: this.plansCreateForm.projectCode,
        projectCategory: this.plansCreateForm.projectCategory
        // pageNum: this.currentPage,
        // pageSize: this.pageSize
      }
      API.planInfo(params)
        .then(res => {
          this.pageTotal = res.total
          if (res.selfProjectBaseInfoResultDto && res.selfProjectBaseInfoResultDto.length > 0) {
            res.selfProjectBaseInfoResultDto.forEach(item => {
              if (item.periodBelong === 'BE-1') {
                item.periodBelongType = '年度新立'
              }
              if (item.periodBelong === 'BE-2') {
                item.periodBelongType = '结转项目'
              }
              item.planStartDate = this.formatYDate(item.planStartDate)
              item.planEndDate = this.formatYDate(item.planEndDate)
              this.projectTypeOption.forEach(ite => {
                if (item.projectCategory === ite.valueCode) {
                  item.projectCategoryName = ite.name
                }
              })
            })
            this.planCreateList = res.selfProjectBaseInfoResultDto
          }
        })
        .catch(err => {
          this.loading = false
          if (err.selfError) return
          this.$message({
            message: err.message,
            type: 'error',
            showClose: true
          })
        })
    },
    // 查询项目类别
    getProjectTypeList () {
      API.dictValByCode('ITEM_CATEGORY')
        .then(res => {
          if (res && res.length > 0) {
            this.projectTypeOption = res
            // this.plansCreateForm.projectCategory = res[0].valueCode
            this.getPlanList()
          } else {
            this.projectTypeOption = []
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询项目类别失败',
            type: 'error',
            showClose: true
          })
        })
    },
    // 调整时间传参格式
    dateTransfer (date) {
      let y = date.getFullYear()
      return y
    },
    async myProjectList () {
      let params = {
        projectName: this.searchForm.projectName,
        projectDetailsStatus: this.searchForm.projectDetailsStatus === null ? null : this.searchForm.projectDetailsStatus.toString(),
        projectYear: this.searchForm.projectYear === null ? null : this.formatDate(this.searchForm.projectYear),
        projectCategory: this.searchForm.projectCategory
      }
      await this.getProjectType()
      API.queryProjects(params)
        .then(res => {
          this.projectList = res
          this.projectList.forEach(item => {
            this.typeOptions.map(typeItem => {
              if (item.projectType === typeItem.valueCode) {
                item.projectType = typeItem.name
              }
            })
          })
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取项目列表失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    intercept () {
      this.projectStatusContent = ''
      this.searchForm.projectDetailsStatus.forEach(element => {
        this.projectStatus.map(item => {
          if (item.value === element) {
            this.projectStatusContent = this.projectStatusContent + item.label + ' '
          }
        })
      })
    },
    currentValue (val) {
      this.searchForm.projectDetailsStatus = val
      this.intercept()
    },
    searchProject (e) {
      this.myProjectList()
    },
    resetProjectList (e) {
      this.$refs.searchForm.resetFields()
      // this.searchForm.projectDetailsStatus = null
      // this.projectStatusContent = ''
      this.searchForm.projectDetailsStatus = [[0, 1, 2, 3, 4, 5, 10, 11].toString()]
      this.myProjectList()
    }
  }
}
</script>
<style lang="scss" scoped>
.independentProjectContent{
  background: #F6F6F6;
  .searchContent{
    background: white;
    margin-bottom: 10px;
    /deep/.el-form{
      margin: 0 20px 10px 20px;
      padding: 10px 0;
    }
    /deep/ .el-form-item .el-input__inner{
      color: #999999;
      font-size: 14px;
    }
    .search-btn{
      width: 170px;
      height: 30px;
      float: right;
      margin-right: 5px;
      margin-bottom: 8px;
    }
    .proStatus{
      .accountingNo{
        @include color();
        position: relative;
        left: 220px;
        top: -40px;
      }
    }
  }
  .project-list {
    background-color: #fff;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    padding: 10px 25px 20px;
    z-index: -100;
    button{
      font-size: 14px;
      border-radius: 2px;
      width: 97px;
      height: 30px;
    }
    .table-head {
      padding: 15px 0px;
      line-height: 40px;
      margin-bottom: 40px;
      .el-button {
        width: 98px;
        height: 30px;
        border-radius: 2px;
      }
    }
    /deep/ .el-table__row{
      td{
        &:nth-child(1){
          cursor: pointer;
          &:hover {
            @include color()
          }
        }
      }
    }
    // .jump-detail {
    //   cursor: pointer;
    //   white-space: nowrap;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    //   &:hover {
    //     @include color()
    //   }
    // }

    // /deep/ .el-table th {
    //   background-color: #fff !important;
    //   color: #666666 !important;
    //   font-weight: normal !important;
    //   font-family: PingFangSC-Regular !important;
    //   font-size: 14px;
    // }

    .plan-create {
      /deep/ .el-input__inner {
        width: 100%;
      }
    }
  }
  /deep/ .el-radio .el-radio__label {
    display: none;
  }
  /deep/ .plan-create-name:hover {
    color:#0b82ff;
  }
  /deep/ .el-dialog {
   .plan-create {
      /deep/ .el-input__inner {
        width: 560px !important;
      }
    }
  }
   /deep/ .el-pager li{
    background: #ffffff;
    border: 1px solid #E5E5E5;
    border-radius: 2px;
    font-size: 12px;
    color: #12171F;
    text-align: center;
  }
  /deep/ .el-pagination .btn-prev{
    background: #ffffff;
    border: 1px solid #E5E5E5;
    border-radius: 2px;
  }
  /deep/ .el-pagination .btn-next{
    background: #ffffff;
    border: 1px solid #E5E5E5;
    border-radius: 2px;
  }
}
.plan-create {
  /deep/ .el-input__inner {
    width: 560px !important;
  }
}
// 下拉超出省略号显示
.el-select-dropdown__item {
  /deep/ span {
    box-sizing: border-box;
    display: inline-block;
    max-width: 180px!important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
