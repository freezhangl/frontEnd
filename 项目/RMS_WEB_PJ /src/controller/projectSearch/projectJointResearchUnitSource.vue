<template>
  <div class="content">
    <div class="search-content">
      <el-form
        :model="searchForm"
        label-width="130px"
        ref="searchForm">
        <div>
          <el-form-item label="年份:" prop="projectYear" :label-width="searchMoreFlag=='0'?'55px':'130px'">
            <el-date-picker
              v-model="searchForm.projectYear"
              type="year"
              value-format="yyyy"
              placeholder="选择年份"
              :clearable="true"
              :editable="false"
              popper-class="dateClass"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="需求单位:" prop="demandCompany" :label-width="searchMoreFlag=='0'?'90px':'130px'">
            <el-tooltip
              v-if="searchForm.demandCompany"
              class="item"
              effect="dark"
              :content="changeDemandCompany"
              placement="top-start">
              <el-select
                clearable
                @clear="removeCompany()"
                class="demandItemOne"
                filterable
                placeholder="请选择"
                v-model="searchForm.demandCompany"
              >
                <el-option
                  v-for="item in demandUnitOptions"
                  :key="item.orgCode"
                  :label="item.orgName"
                  :value="item.orgCode"
                  :disabled="item.disabled">
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    :content="item.orgName"
                    :disabled="!showToolTip(item.orgName, 80)">
                    <span class="showToolTipSpanOne">{{item.orgName}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              v-else
              class="demandItemOne"
              filterable
              clearable
              placeholder="请选择"
              v-model="searchForm.demandCompany"
            >
              <el-option
                v-for="item in demandUnitOptions"
                :key="item.orgCode"
                :label="item.orgName"
                :value="item.orgCode"
                :disabled="item.disabled">
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  :content="item.orgName"
                  :disabled="!showToolTip(item.orgName, 80)">
                  <span class="showToolTipSpanOne">{{item.orgName}}</span>
                </el-tooltip>
              </el-option>
            </el-select>
            <el-tooltip
              v-if="searchForm.demandCompanyType"
              class="item"
              effect="dark"
              :content="changeDemandCompanyType"
              placement="top-start">
              <el-select
                class="demandItemTwo"
                style="margin-left: 10px;"
                clearable
                placeholder="全部"
                v-model="searchForm.demandCompanyType"
              >
                <el-option
                  v-for="item in demandUnitTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              v-else
              class="demandItemTwo"
              style="margin-left: 10px;"
              clearable
              placeholder="全部"
              v-model="searchForm.demandCompanyType"
            >
              <el-option
                v-for="item in demandUnitTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联合攻关单位:" prop="undertakeCompany">
            <el-tooltip
              v-if="searchForm.undertakeCompany"
              class="item"
              effect="dark"
              :content="changeUndertakeCompany"
              placement="top-start">
              <el-select
                clearable
                filterable
                placeholder="请选择"
                v-model="searchForm.undertakeCompany"
              >
                <el-option
                  v-for="item in undertakingUnitOptions"
                  :key="item.orgCode"
                  :label="item.orgName"
                  :value="item.orgCode"
                  :disabled="item.disabled">
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    :content="item.orgName"
                    :disabled="!showToolTip(item.orgName, 180)">
                    <span class="showToolTipSpan">{{item.orgName}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              v-else
              clearable
              filterable
              placeholder="请选择"
              v-model="searchForm.undertakeCompany"
            >
              <el-option
                v-for="item in undertakingUnitOptions"
                :key="item.orgCode"
                :label="item.orgName"
                :value="item.orgCode"
                :disabled="item.disabled">
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  :content="item.orgName"
                  :disabled="!showToolTip(item.orgName, 180)">
                  <span class="showToolTipSpan">{{item.orgName}}</span>
                </el-tooltip>
              </el-option>
            </el-select>
          </el-form-item>
          <span
            class="el-icon-arrow-down"
            :style="{'padding-top': '6px','text-align': 'center','box-sizing':'border-box','border': '1px solid #E5E5E5','border-radius': '2px',width:'30px',height:'30px','margin-top': '5px','margin-left':'10px'}"
            @click="tableDataInSearchMore"
            v-if="searchMoreFlag==='0'"/>
          <el-form-item label="集团项目类别:" prop="projectClass" v-if="searchMoreFlag==='1'">
            <el-tooltip
              v-if="searchForm.projectClass"
              class="item"
              effect="dark"
              :content="changeProjectClass"
              placement="top-start">
              <el-select
                clearable
                v-model="searchForm.projectClass"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in projectCategoryOptions"
                  :key="item.valueCode"
                  :label="item.name"
                  :value="item.valueCode"
                  :disabled="item.disabled">
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    :content="item.name"
                    :disabled="!showToolTip(item.name, 180)">
                    <span class="showToolTipSpan">{{item.name}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              clearable
              v-else
              v-model="searchForm.projectClass"
              placeholder="请选择"
            >
              <el-option
                v-for="item in projectCategoryOptions"
                :key="item.valueCode"
                :label="item.name"
                :value="item.valueCode"
                :disabled="item.disabled">
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  :content="item.name"
                  :disabled="!showToolTip(item.name, 180)">
                  <span class="showToolTipSpan">{{item.name}}</span>
                </el-tooltip>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="集团项目级别:" prop="projectLevel" v-if="searchMoreFlag==='1'">
            <el-select
              clearable
              v-model="searchForm.projectLevel"
              placeholder="请选择"
            >
              <el-option
                v-for="item in projectLevelOptions"
                :key="item.valueCode"
                :label="item.name"
                :value="item.valueCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用类别:" prop="projectExpenditureType" v-if="searchMoreFlag==='1'">
            <el-tooltip
              v-if="searchForm.projectExpenditureType"
              class="item"
              effect="dark"
              :content="changeProjectExpenditureType"
              placement="top-start">
              <el-select
                clearable
                v-model="searchForm.projectExpenditureType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in costCategoryOptions"
                  :key="item.valueCode"
                  :label="item.name"
                  :value="item.valueCode">
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              clearable
              v-else
              v-model="searchForm.projectExpenditureType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in costCategoryOptions"
                :key="item.valueCode"
                :label="item.name"
                :value="item.valueCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划立项时间:" v-if="searchMoreFlag==='1'">
            <el-tooltip
              v-if="searchForm.planApprovalTime"
              popper-class="dateRangePop"
              :content="dateRangeTooltip1"
              placement="top"
              effect="dark"
              :offset="-80">
              <el-date-picker
                class="date-picker"
                v-model.trim="searchForm.planApprovalTime"
                type="datetimerange"
                placeholder="请选择"
                range-separator="～"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00']"
                :clearable="true"
                value-format="timestamp">
              </el-date-picker>
            </el-tooltip>
            <el-date-picker
              v-else
              class="date-picker"
              v-model.trim="searchForm.planApprovalTime"
              type="datetimerange"
              placeholder="请选择"
              range-separator="～"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['00:00:00']"
              :clearable="true"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计划结项时间:" v-if="searchMoreFlag==='1'">
            <el-tooltip
              v-if="searchForm.planFinishTime"
              popper-class="dateRangePop"
              :content="dateRangeTooltip2"
              placement="top"
              effect="dark"
              :offset="-80">
              <el-date-picker
                class="date-picker"
                v-model.trim="searchForm.planFinishTime"
                type="datetimerange"
                placeholder="请选择"
                range-separator="～"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00']"
                :clearable="true"
                value-format="timestamp">
              </el-date-picker>
            </el-tooltip>
            <el-date-picker
              v-else
              class="date-picker"
              v-model.trim="searchForm.planFinishTime"
              type="datetimerange"
              placeholder="请选择"
              range-separator="～"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['00:00:00']"
              :clearable="true"
              value-format="timestamp"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目编码:" v-if="searchMoreFlag==='1'">
            <el-input
              v-model.trim="searchForm.projectCode"
              :clearable="true"
              placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="项目名称:" v-if="searchMoreFlag==='1'">
            <el-input
              v-model.trim="searchForm.projectName"
              :clearable="true"
              placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="项目经理:" v-if="searchMoreFlag==='1'">
            <el-input
              v-model.trim="searchForm.projectManagerName"
              :clearable="true"
              placeholder="请输入">
            </el-input>
          </el-form-item>
          <span
            class="el-icon-arrow-up"
            :style="{'padding-top': '6px','text-align': 'center','box-sizing':'border-box','border': '1px solid #E5E5E5','border-radius': '2px',width:'30px',height:'30px','margin-top': '5px','margin-left': '5px','margin-right':searchMoreFlag==='0'?'387px':'10px'}"
            @click="tableDataInSearchLess"
            v-if="searchMoreFlag==='1'"/>
          <div class="form-button">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="search"
              :disabled="loading"
              class="primary-button">查 询
            </el-button>
            <el-button
              icon="el-icon-refresh-left"
              @click="reset"
              class="normal-btn">重 置
            </el-button>
            <el-button
              icon="el-icon-download"
              @click="exportDetail"
              class="normal-btn">导 出
            </el-button>
          </div>
        </div>
      </el-form>
    </div>
    <div class="main-warpper">
      <div class="main-header">
      </div>
      <el-table v-loading="loading" :data="tableDataOut.list" style="overflow: auto;">
        <el-table-column type="index" label="序号" width="50px">
        </el-table-column>
        <el-table-column
          label="项目名称"
          min-width="100px"
          property="projectName"
          align="center"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <div @click="handleClick(scope.row)" class="jump-detail">
              <span style="font-weight: bold">
                {{scope.row.projectName}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="项目编码"
          property="projectCode"
          show-overflow-tooltip
          min-width="100px"
          align="center">
        </el-table-column>
        <el-table-column
          label="需求单位"
          property="demandOrganizationName"
          show-overflow-tooltip
          min-width="114px"
          align="center">
        </el-table-column>
        <el-table-column
          label="联合攻关单位"
          property="undertakeOrganizationName"
          show-overflow-tooltip
          align="center"
          min-width="168px">
        </el-table-column>
        <el-table-column
          label="结项评分"
          property="score"
          show-overflow-tooltip
          align="center"
          min-width="100px">
        </el-table-column>
        <el-table-column
          label="平均分"
          property="average"
          show-overflow-tooltip
          align="center"
          min-width="114px">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="tableDataOut.total>0"
        style="text-align: center;margin-top: 15px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="tableDataOut.body.pageSize"
        layout="prev, pager, next, sizes, jumper"
        :total="tableDataOut.total">
      </el-pagination>
      <div v-if="tableDataOut.total>0">注：平均分=该项目下所有需求单位对联合攻关单位评分的平均数</div>
    </div>
    <el-progress
      :percentage="uploadPercentage"
      type="circle"
      :color = "colors"
      v-if="progressVisible"
      class="fileProgress">
    </el-progress>
  </div>
</template>

<script>
import { getStore } from '@/store'
import projectAPI from '../../serve/API_groupPlanProject'
import API from '../../serve/API_projectSearch'
import axios from 'axios'
import { formatDate } from '../../common/common'
import { isShowToolTip } from '@/utils/common.js'
export default {
  name: 'projectJointResearchUnitSource',
  data () {
    return {
      searchMoreFlag: '0', //搜索更多 0隐藏 1 显示更多
      progressVisible: false,
      uploadPercentage: 0,
      colors: '#20a0ff',
      interval: 0,
      progressStatus: { normal: '#20a0ff', success: '#13ce66', exception: '#ff4949' },
      currentPage: 1,
      loading: false,
      demandUnitOptions: [], //需求单位 options
      demandUnitTypeOptions: [{ value: 1, label: '牵头' }, { value: 0, label: '配合' }], //需求单位类型 options
      undertakingUnitOptions: [], //联合攻关单位 options
      projectCategoryOptions: [], //集团项目类别 options
      projectLevelOptions: [], //集团项目级别 options
      costCategoryOptions: [], //费用类别 options
      searchForm: {
        projectYear: '', //年份
        demandCompany: '', //需求单位
        undertakeCompany: '', //联合攻关单位
        demandCompanyType: '', //需求单位类型 牵头or配合
        projectClass: '', //集团项目类别
        projectLevel: '', //集团项目级别
        projectExpenditureType: '', //费用类别
        planApprovalTime: '', //计划立项时间
        planFinishTime: '', //计划结项时间
        projectCode: '', //项目编码
        projectName: '', //项目名称
        projectManagerName: '' //项目经理
      },
      tableDataOut: {
        body: { pageSize: 10, pageNum: 1 },
        total: 0,
        list: []
      },
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      userInfo: getStore().getters['USERENTITY/userInfo'].userAuth.curUserOrg,
      baseUrl: getStore().getters['CONFIG/baseUrl']
    }
  },
  created () {
    this.getSearchData()
  },
  computed: {
    dateRangeTooltip1 () {
      let val = ''
      if (this.searchForm.planApprovalTime) {
        val = formatDate(this.searchForm.planApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') +
          '～' + formatDate(this.searchForm.planApprovalTime[1], 'YYYY-MM-DD HH:mm:ss')
      }
      return val
    },
    dateRangeTooltip2 () {
      let val = ''
      if (this.searchForm.planFinishTime) {
        val = formatDate(this.searchForm.planFinishTime[0], 'YYYY-MM-DD HH:mm:ss') +
          '～' + formatDate(this.searchForm.planFinishTime[1], 'YYYY-MM-DD HH:mm:ss')
      }
      return val
    },
    changeProjectExpenditureType () {
      let val = ''
      if (this.searchForm.projectExpenditureType) {
        this.costCategoryOptions.forEach(item => {
          if (this.searchForm.projectExpenditureType === item.valueCode) {
            val = item.name
          }
        })
      }
      return val
    },
    changeProjectClass () {
      let val = ''
      if (this.searchForm.projectClass) {
        this.projectCategoryOptions.forEach(item => {
          if (this.searchForm.projectClass === item.valueCode) {
            val = item.name
          }
        })
      }
      return val
    },
    changeDemandCompany () {
      let val = ''
      if (this.searchForm.demandCompany) {
        this.demandUnitOptions.forEach(item => {
          if (this.searchForm.demandCompany === item.orgCode) {
            val = item.orgName
          }
        })
      }
      return val
    },
    changeDemandCompanyType () {
      let val = ''
      if (this.searchForm.demandCompanyType) {
        this.demandUnitTypeOptions.forEach(item => {
          if (this.searchForm.demandCompanyType === item.value) {
            val = item.label
          }
        })
      }
      return val
    },
    changeUndertakeCompany () {
      let val = ''
      if (this.searchForm.undertakeCompany) {
        this.undertakingUnitOptions.forEach(item => {
          if (this.searchForm.undertakeCompany === item.orgCode) {
            val = item.orgName
          }
        })
      }
      return val
    }
  },
  methods: {
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    //数据导出进度条控制
    controlProgress () {
      let that = this
      let endPro = 95
      that.interval = setInterval(function () {
        if (that.uploadPercentage < endPro) {
          that.uploadPercentage++
        }
      }, 100)
    },
    // 数据导出
    exportDetail () {
      this.$confirm(' ', '项目联合攻关单位评分导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          this.download()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出'
          })
        })
    },
    // 关闭导出弹窗
    beforeCloseExportDig (done) {
      this.closeExportForm()
    },
    closeExportForm () {
      this.exportDialogVis = false
    },
    removeCompany (val) {
      this.searchForm.demandCompany = ''
    },
    // 修改当前显示多少条数据
    handleSizeChange (val) {
      this.tableDataOut.body.pageSize = val
      this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
    },
    // 修改显示第几页
    handleCurrentChange (val) {
      this.tableDataOut.body.pageNum = val
      this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
    },
    handleClick (row) { //点击项目名称进入项目详情
      // 判断是否具有权限
      projectAPI.checkUserProjectPermission({ projectCode: row.projectCode, permissionCode: '01' })
        .then(res => {
          if (res) {
            row.projectCategory = row.projectCategory === 'PC-DEMAND-UNIT' || row.projectCategory === 'd' ? 'd' : 'u'
            let { href } = this.$router.resolve({
              path: '/groupPlan/projectDetail/' + row.projectCode + '?developPackage=' + row.developPackage + '&projectCategory=' + row.projectCategory
            })
            // 打开新的窗口
            let $window = window.open(href, '_blank')
          } else {
            this.$message({
              message: '无项目查询权限！',
              showClose: true,
              type: 'warning'
            })
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
    tableDataInSearchMore () {
      this.searchMoreFlag = '1'
    },
    tableDataInSearchLess () {
      this.searchMoreFlag = '0'
    },
    // 查询数据字典
    getSearchData () {
      // 批量获取集团项目类别、集团项目级别、费用类别
      let params = {
        codes: 'ITEM_CATEGORY,CO-PROJECT-LEVEL,PROJECT-EXPENDITURE-TYPE'
      }
      API.dictValByCodes(params)
        .then(res => {
          res.forEach(dicItem => {
            switch (dicItem.code) {
              case 'ITEM_CATEGORY':
                this.projectCategoryOptions = dicItem.dictionarys.filter(dic => dic.valueCode !== 'IC_D')
                break
              case 'CO-PROJECT-LEVEL':
                this.projectLevelOptions = dicItem.dictionarys
                break
              case 'PROJECT-EXPENDITURE-TYPE':
                this.costCategoryOptions = dicItem.dictionarys
                break
            }
          })
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
      // 需求单位
      axios.request({
        url: this.baseUrl + '/rms/basic/ext/employerUndertaker/v1/3/v1/employerUndertakersByOrgCode?orgType=1',
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      })
        .then((res) => {
          this.demandUnitOptions = res.data.body
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
      // 联合攻关单位
      axios.request({
        url: this.baseUrl + '/rms/auth/ext/user/v1/3/v1/provinceAbbr',
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      })
        .then((res) => {
          this.undertakingUnitOptions = res.data.body
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    //查询
    search () {
      this.tableDataOut.body.pageNum = 1
      this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
    },
    download () {
      let param = {
        projectYear: this.searchForm.projectYear,
        demandCompany: this.searchForm.demandCompany,
        demandCompanyType: this.searchForm.demandCompanyType,
        undertakeCompany: this.searchForm.undertakeCompany,
        projectClass: this.searchForm.projectClass,
        projectLevel: this.searchForm.projectLevel,
        projectExpenditureType: this.searchForm.projectExpenditureType,
        beginPlanApprovalTime: this.searchForm.planApprovalTime ? formatDate(this.searchForm.planApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanApprovalTime: this.searchForm.planApprovalTime ? formatDate(this.searchForm.planApprovalTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        beginPlanFinishTime: this.searchForm.planFinishTime ? formatDate(this.searchForm.planFinishTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanFinishTime: this.searchForm.planFinishTime ? formatDate(this.searchForm.planFinishTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        projectCode: this.searchForm.projectCode,
        projectName: this.searchForm.projectName,
        projectManagerName: this.searchForm.projectManagerName
      }
      if (param.demandCompanyType !== '' && param.demandCompany === '') {
        this.$message({
          message: '请选择需求单位',
          type: 'error',
          showClose: true
        })
        this.progressVisible = false
      } else {
        let url = '?projectYear=' + param.projectYear + '&demandCompany=' + param.demandCompany + '&demandCompanyType=' + param.demandCompanyType +
          '&undertakeCompany=' + param.undertakeCompany + '&projectClass=' + param.projectClass +
          '&projectLevel=' + param.projectLevel + '&projectExpenditureType=' + param.projectExpenditureType + '&beginPlanApprovalTime=' + param.beginPlanApprovalTime +
          '&endPlanApprovalTime=' + param.endPlanApprovalTime + '&beginPlanFinishTime=' + param.beginPlanFinishTime + '&endPlanFinishTime=' + param.endPlanFinishTime +
          '&projectCode=' + param.projectCode + '&projectName=' + param.projectName + '&projectManagerName=' + param.projectManagerName
        const progressLoading = this.$loading({
          lock: true,
          fullscreen: true,
          customClass: 'progress-mask',
          text: '',
          spinner: '11',
          background: 'rgba(0,0,0,0.7)'
        })
        this.progressVisible = true
        this.controlProgress()
        axios.request({
          url: this.baseUrl + '/rms/project/export/v1/allScoreUniteAssault' + url,
          headers: {
            'Authorization': this.Authorization,
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
          },
          responseType: 'blob'
        })
          .then((res) => {
            let t
            clearTimeout(t)
            let blob = new Blob([res.data])
            let exportFileName = decodeURI(res.headers['content-disposition'].split('=')[1])
            let fileName = exportFileName
            fileName = fileName.replace('UTF-8\'\'', '')
            // 非IE下载
            if ('download' in document.createElement('a')) {
              let elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else { // IE10+下载
              navigator.msSaveBlob(blob, fileName)
            }
            clearInterval(this.interval)
            this.uploadPercentage = 100
            this.colors = this.progressStatus.success
            t = setTimeout(() => {
              this.progressVisible = false
              progressLoading.close()
              this.exportDialogVis = false
              this.closeExportForm()
              this.$message({
                message: '数据导出成功！',
                type: 'success',
                showClose: true
              })
            }, 1000)
          })
          .catch(e => {
            clearInterval(this.interval)
            this.uploadPercentage = 50
            this.colors = this.progressStatus.exception
            this.progressVisible = false
            progressLoading.close()
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '数据导出失败，请稍后重试！',
                type: 'error',
                showClose: true
              })
            }
          })
      }
    },
    reset () {
      this.searchForm.projectYear = ''
      this.searchForm.demandCompany = ''
      this.searchForm.demandCompanyType = ''
      this.searchForm.undertakeCompany = ''
      this.searchForm.projectClass = ''
      this.searchForm.projectLevel = ''
      this.searchForm.projectExpenditureType = ''
      this.searchForm.planApprovalTime = ''
      this.searchForm.planFinishTime = ''
      this.searchForm.projectCode = ''
      this.searchForm.projectName = ''
      this.searchForm.projectManagerName = ''
      this.tableDataOut.list = []
      this.tableDataOut.total = 0
      this.tableDataOut.body.pageNum = 1
      this.tableDataOut.body.pageSize = 10
    },
    getList (pageNum, pageSize) {
      this.tableDataOut.body.pageNum = pageNum
      this.tableDataOut.body.pageSize = pageSize
      this.loading = true
      this.currentPage = pageNum
      let param = {
        pageNum: pageNum,
        pageSize: pageSize,
        projectYear: this.searchForm.projectYear,
        demandCompany: this.searchForm.demandCompany,
        demandCompanyType: this.searchForm.demandCompanyType,
        undertakeCompany: this.searchForm.undertakeCompany,
        projectClass: this.searchForm.projectClass,
        projectLevel: this.searchForm.projectLevel,
        projectExpenditureType: this.searchForm.projectExpenditureType,
        beginPlanApprovalTime: this.searchForm.planApprovalTime ? formatDate(this.searchForm.planApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanApprovalTime: this.searchForm.planApprovalTime ? formatDate(this.searchForm.planApprovalTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        beginPlanFinishTime: this.searchForm.planFinishTime ? formatDate(this.searchForm.planFinishTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanFinishTime: this.searchForm.planFinishTime ? formatDate(this.searchForm.planFinishTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        projectCode: this.searchForm.projectCode,
        projectName: this.searchForm.projectName,
        projectManagerName: this.searchForm.projectManagerName
      }
      if (param.demandCompanyType !== '' && param.demandCompany === '') {
        this.$message({
          message: '请选择需求单位',
          type: 'error',
          showClose: true
        })
        this.loading = false
      } else {
        API.queryFinishScoreUniteAssault(param)
          .then(res => {
            if (res.total > 0) {
              this.tableDataOut.list = res.scoreUniteAssault
            } else if (res.scoreUniteAssault.length === 0) {
              this.tableDataOut.list = []
              this.tableDataOut.total = 0
            }
            this.tableDataOut.total = parseInt(res.total)
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            if (e.selfError) return
            this.$message({
              message: e.message || '列表获取失败',
              type: 'error',
              showClose: true
            })
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    .search-content {
      background: #fff;
      margin-top: -10px;
      font-size: 14px;

      .el-form {
        margin: 10px 20px;
        padding: 10px 0;
      }

      /deep/ .el-form-item .el-input__inner {
        width: 220px;
        max-width: 220px;
      }

      /deep/ .el-form-item .demandItemOne .el-input__inner {
        width: 130px;
        max-width: 130px;
      }

      /deep/ .el-form-item .demandItemTwo .el-input__inner {
        width: 80px;
        max-width: 80px;
      }

      .form-button {
        float: right;
        padding-top: 5px;

        .primary-button {
          height: 30px;
        }

        .reset-button {
          height: 30px;
          color: #0B82FF;
          border: 1px solid rgba(11, 130, 255, 0.50);
        }
      }

      .showBox {
        -webkit-appearance: none;
        background-color: #FFFFFF;
        background-image: none;
        border-radius: 2px;
        border: 1px solid #E5E5E5;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #666666;
        display: inline-block;
        font-size: inherit;
        height: 30px;
        line-height: 30px;
        outline: none;
        padding: 0 15px;
        -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        position: relative;
        cursor: pointer;
        width: 130px;

        .boxPlaceholder {
          margin: 0px;
          color: #9397AA;
          font-size: 14px;
          line-height: 29px;
        }
      }

      .noClick {
        background-color: #F4F4F4;
        border-color: #E5E5E5;
        color: #999999;
        cursor: not-allowed;
      }

      .showNameBox {
        display: flex;
        align-items: center;

        p {
          background: #f0f0f0;
          color: #838383;
          border: 1px solid #e0e0e0;
          margin-top: 0;
          margin-bottom: 0;
          border-radius: 4px;
          padding: 0 10px;
          font-size: 13px;
          line-height: 26px;
          margin-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100px;

          &:last-child {
            margin: 0;
          }
        }
      }

      .iBg {
        color: #999;
        margin-right: 8px;
      }

      .treePop {
        min-width: 300px !important;
        height: 200px;
        overflow-y: auto;
      }

      /deep/ .el-form-item__label {
        word-break: break-all;
      }

      .trees {
        width: 140px;
        max-width: 140px;
        display: inline-block;
        height: 30px;

        /deep/ .el-tree__empty-block {
          height: 30px;
          min-height: 30px;
          text-align: left;
        }

        /deep/ .el-tree__empty-text {
          position: inherit;
          left: 0;
          top: 0;
          text-align: left;
        }
      }
    }

    .main-warpper {
      background: white;
      padding: 20px 30px 30px;

      .main-header {
        margin-bottom: 20px;
        overflow: hidden;
        float: right;
      }

      .jump-detail {
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        @include color();
      }

      /deep/ .el-table__row {
        height: 47px;
        line-height: 47px;

        td {
          padding: 0;

          div {
            line-height: 1;
          }
        }
      }

      /deep/ .el-table__body-wrapper.is-scrolling-none{
        height: calc(100% - 130px);
        overflow: auto;
      }
      /deep/ .el-table__body-wrapper{
        overflow: auto;
      }

      /deep/ .el-table th {
        border-right: 0px;
      }

      /deep/ .el-table td {
        border-right: 0px;
      }

      /deep/ .el-table .columnOne th {
        border-right: 1px solid #ebeef5;
      }

      /deep/ .sp-table .padding-col {
        padding-left: 0px;
      }

      /deep/ .el-table--border td {
        border-right: 0px;
      }

      /deep/ .el-table--border th {
        border-right: 0px;
      }

      /deep/ .el-table:before {
        height: 0px;
      }

      /deep/ .el-table--group:after {
        height: 0px;
      }

      /deep/ .el-table--group {
        border: 0px;
      }

      /deep/ .hover {
        &:hover {
          color: #0b82ff
        }

        cursor: pointer
      }
    }

    .project-list {
      background-color: #fff;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
      border-radius: 2px;
      padding: 10px 25px 20px;
      height: calc(100vh - 400px);
      max-height: calc(100vh - 400px);
      z-index: -100;

      button {
        font-size: 14px;
        border-radius: 2px;
        width: 85px;
        height: 30px;
      }

      .table-head {
        padding: 15px 0px;
        line-height: 40px;
        margin-bottom: 15px;

        .el-button {
          width: 98px;
          height: 30px;
          border-radius: 2px;
        }
      }

      .jump-detail {
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          @include color()
        }
      }
    }

    .fileProgress {
      position: fixed;
      top: 50%;
      left: 50%;
      z-index: 9999;
    }
    .el-progress__text {
      color: #20a0ff;
    }

    li {
      list-style: inherit;
    }

    ul {
      padding-inline-start: 12px;
    }
  }
  // 下拉超出省略号显示
.el-select-dropdown__item {
  .showToolTipSpanOne {
    box-sizing: border-box;
    display: inline-block;
    max-width: 80px!important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.el-select-dropdown__item {
  .showToolTipSpan {
    box-sizing: border-box;
    display: inline-block;
    max-width: 180px!important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<style lang="scss">
  .dateClass {
    width: 220px !important;
    .el-picker-panel__content {
      width: 220px !important;
    }
  }
</style>
