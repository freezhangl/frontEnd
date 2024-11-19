<template>
  <div class="uBudgetNew">
    <project-panel
      title="预算信息"
      :tips="tips"
      :tip-language="language">
      <template v-slot:header>
        <el-button class="normal-btn" v-if="isEdit&&!meberEditFlag" @click="tempSave">保存本区块信息</el-button>
      </template>

      <el-form
        v-if="budgetForm.costBudgetList.length"
        ref="budgetForm"
        :model="budgetForm"
        :rules="rules"
        :inline="true"
        :show-message="false">
        <div class="table-wrapper">
          <div class="budget-table" @scroll="scroll">
            <table
              class="budget-con"
              border="1"
              cellpadding="0"
              cellspacing="0">
              <tr>
                <th colspan="2" class="col-title"></th>
                <th v-for="(item,index) in yearList" :key="index" :class="{'year-amount':item === '年度合计','year-all':item === '全项目'}">
                  <span v-if="item !== '年度合计' && item !== '全项目'">{{item}}年度</span>
                  <span v-else>{{item}}</span>
                </th>
              </tr>

              <tr>
                <td rowspan="2" class="col-title">合作开发费</td>
                <td class="col-title-child" :class="isEdit ? 'required' : ''"><span>委外(万元)</span></td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :rowspan="item!=='全项目' ? 1 : 2"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item :rules="setRules('budgetOutsourcing', index)" prop="budgetOutsourcing">
                    <span v-if="isEdit">
                      <el-input
                        :class="{'valid-error': item==='全项目' && !validResultObj.budgetOutsourcing}"
                        :disabled='!budgetForm.costBudgetList[index].isYearEdit || meberEditFlag'
                        v-if="item !== '年度合计' && item !== '集团批复预算'"
                        v-model="budgetForm.costBudgetList[index].budgetOutsourcing"
                        @input="inputHandler('budgetOutsourcing', index)"
                        @change="computeSum('budgetOutsourcing', index)"
                        @focus="focusHandler('budgetOutsourcing',index)"
                        @blur="blurHandler('budgetOutsourcing',index)"
                        placeholder="0.000000"
                      ></el-input>
                      <span v-else>{{budgetForm.costBudgetList[index].budgetOutsourcing | numTransition}}</span>
                    </span>
                    <span v-else>
                      <span
                        v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.budgetOutsourcing"
                        :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.budgetOutsourcing }">
                        {{budgetForm.costBudgetList[index].budgetOutsourcing | numTransition}}</span>
                      <span v-else>{{budgetForm.costBudgetList[index].budgetOutsourcing | numTransition}}</span>
                    </span>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="col-title-child" :class="isEdit ? 'required' : ''"><span>委内(万元)</span></td>
                <td
                  class="data-cell"
                  :class="{'hidden':item==='全项目','year-all':item === '全项目'}"
                  v-for="(item,index) in yearList"
                  :key="index">
                  <el-form-item :rules="setRules('budgetInsourcing', index)" prop="budgetInsourcing">
                    <span v-if="isEdit">
                      <el-input
                        :class="{'valid-error': item==='全项目' && !validResultObj.budgetInsourcing}"
                        :disabled='!budgetForm.costBudgetList[index].isYearEdit || meberEditFlag'
                        v-if="item !== '年度合计' && item !== '集团批复预算'"
                        v-model="budgetForm.costBudgetList[index].budgetInsourcing"
                        @input="inputHandler('budgetInsourcing', index)"
                        @change="computeSum('budgetInsourcing', index)"
                        @focus="focusHandler('budgetInsourcing',index)"
                        @blur="blurHandler('budgetInsourcing',index)"
                        placeholder="0.000000"
                      ></el-input>
                      <span v-else>{{budgetForm.costBudgetList[index].budgetInsourcing | numTransition}}</span>
                    </span>
                    <span v-else>
                      <span
                        v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.budgetInsourcing"
                        :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.budgetInsourcing }">
                        {{budgetForm.costBudgetList[index].budgetInsourcing | numTransition}}</span>
                      <span v-else>{{budgetForm.costBudgetList[index].budgetInsourcing | numTransition}}</span>
                    </span>
                  </el-form-item>
                </td>
              </tr>

              <tr>
                <td rowspan="2" class="col-title">自有人工</td>
                <td class="col-title-child" :class="isEdit ? 'required' : ''"><span>自有人工(人月)</span></td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item :rules="setRules('staffTime', index)" prop="staffTime">
                    <span v-if="isEdit">
                      <el-input
                        :class="{'valid-error': item==='全项目' && !validResultObj.staffTime}"
                        :disabled='!budgetForm.costBudgetList[index].isYearEdit || meberEditFlag'
                        v-if="item !== '年度合计' && item !== '集团批复预算'"
                        v-model="budgetForm.costBudgetList[index].staffTime"
                        @input="inputHandler('staffTime', index)"
                        @change="computeSum('staffTime', index)"
                        @focus="focusHandler('staffTime',index)"
                        @blur="blurHandler('staffTime',index)"
                        placeholder="0.00"
                      ></el-input>
                      <span v-else>{{budgetForm.costBudgetList[index].staffTime | numTransition}}</span>
                    </span>
                    <span v-else>
                      <span
                        v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.staffTime"
                        :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.staffTime }">
                        {{budgetForm.costBudgetList[index].staffTime | numTransition}}</span>
                      <span v-else>{{budgetForm.costBudgetList[index].staffTime | numTransition}}</span>
                    </span>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="col-title-child">自有人工(万元)</td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item>
                    <span v-if="isEdit">
                      <el-input
                        :class="{'valid-error': item==='全项目' && !validResultObj.laborCosts}"
                        :disabled='!budgetForm.costBudgetList[index].isYearEdit || meberEditFlag'
                        v-if="item !== '年度合计' && item !== '集团批复预算'"
                        v-model="budgetForm.costBudgetList[index].laborCosts"
                        @input="inputHandler('laborCosts', index)"
                        @change="computeSum('laborCosts', index)"
                        @focus="focusHandler('laborCosts',index)"
                        @blur="blurHandler('laborCosts',index)"
                        placeholder="0.000000"
                      ></el-input>
                      <span v-else>{{budgetForm.costBudgetList[index].laborCosts | numTransition}}</span>
                    </span>
                    <span v-else>
                      <span
                        v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.laborCosts"
                        :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.laborCosts }">
                        {{budgetForm.costBudgetList[index].laborCosts | numTransition}}</span>
                      <span v-else>{{budgetForm.costBudgetList[index].laborCosts | numTransition}}</span>
                    </span>
                  </el-form-item>
                </td>
              </tr>

              <tr>
                <td rowspan="4" class="col-title">其他</td>
                <td class="col-title-child">差旅费(万元)</td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item>
                    <span v-if="isEdit">
                      <el-input
                        :class="{'valid-error': item==='全项目' && !validResultObj.travelExpenses}"
                        :disabled='!budgetForm.costBudgetList[index].isYearEdit || meberEditFlag'
                        v-if="item !== '年度合计' && item !== '集团批复预算'"
                        v-model="budgetForm.costBudgetList[index].travelExpenses"
                        @input="inputHandler('travelExpenses', index)"
                        @change="computeSum('travelExpenses', index)"
                        @focus="focusHandler('travelExpenses',index)"
                        @blur="blurHandler('travelExpenses',index)"
                        placeholder="0.000000"
                      ></el-input>
                      <span v-else>{{budgetForm.costBudgetList[index].travelExpenses | numTransition}}</span>
                    </span>
                    <span v-else>
                      <span
                        v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.travelExpenses"
                        :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.travelExpenses }">
                        {{budgetForm.costBudgetList[index].travelExpenses | numTransition}}</span>
                      <span v-else>{{budgetForm.costBudgetList[index].travelExpenses | numTransition}}</span>
                    </span>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="col-title-child">会议费(万元)</td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item>
                    <span v-if="isEdit">
                      <el-input
                        :class="{'valid-error': item==='全项目' && !validResultObj.conferenceExpenses}"
                        :disabled='!budgetForm.costBudgetList[index].isYearEdit || meberEditFlag'
                        v-if="item !== '年度合计' && item !== '集团批复预算'"
                        v-model="budgetForm.costBudgetList[index].conferenceExpenses"
                        @input="inputHandler('conferenceExpenses', index)"
                        @change="computeSum('conferenceExpenses', index)"
                        @focus="focusHandler('conferenceExpenses',index)"
                        @blur="blurHandler('conferenceExpenses',index)"
                        placeholder="0.000000"
                      ></el-input>
                      <span v-else>{{budgetForm.costBudgetList[index].conferenceExpenses | numTransition}}</span>
                    </span>
                    <span v-else>
                      <span
                        v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.conferenceExpenses"
                        :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.conferenceExpenses }">
                        {{budgetForm.costBudgetList[index].conferenceExpenses | numTransition}}</span>
                      <span v-else>{{budgetForm.costBudgetList[index].conferenceExpenses | numTransition}}</span>
                    </span>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="col-title-child">资产折旧/摊销(万元)</td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item>
                    <span v-if="isEdit">
                      <el-input
                        :class="{'valid-error': item==='全项目' && !validResultObj.assetDepreciation}"
                        :disabled='!budgetForm.costBudgetList[index].isYearEdit || meberEditFlag'
                        v-if="item !== '年度合计' && item !== '集团批复预算'"
                        v-model="budgetForm.costBudgetList[index].assetDepreciation"
                        @input="inputHandler('assetDepreciation', index)"
                        @change="computeSum('assetDepreciation', index)"
                        @focus="focusHandler('assetDepreciation',index)"
                        @blur="blurHandler('assetDepreciation',index)"
                        placeholder="0.000000"
                      ></el-input>
                      <span v-else>{{budgetForm.costBudgetList[index].assetDepreciation | numTransition}}</span>
                    </span>
                    <span v-else>
                      <span
                        v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.assetDepreciation"
                        :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.assetDepreciation }">
                        {{budgetForm.costBudgetList[index].assetDepreciation | numTransition}}</span>
                      <span v-else>{{budgetForm.costBudgetList[index].assetDepreciation | numTransition}}</span>
                    </span>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="col-title-child">其他成本(万元)</td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item>
                    <span v-if="isEdit">
                      <el-input
                        :class="{'valid-error': item==='全项目' && !validResultObj.otherCosts}"
                        :disabled='!budgetForm.costBudgetList[index].isYearEdit || meberEditFlag'
                        v-if="item !== '年度合计' && item !== '集团批复预算'"
                        v-model="budgetForm.costBudgetList[index].otherCosts"
                        @input="inputHandler('otherCosts', index)"
                        @change="computeSum('otherCosts', index)"
                        @focus="focusHandler('otherCosts',index)"
                        @blur="blurHandler('otherCosts',index)"
                        placeholder="0.000000"
                      ></el-input>
                      <span v-else>{{budgetForm.costBudgetList[index].otherCosts | numTransition}}</span></span>
                    <span v-else>
                      <span
                        v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.otherCosts"
                        :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.otherCosts }">
                        {{budgetForm.costBudgetList[index].otherCosts | numTransition}}</span>
                      <span v-else>{{budgetForm.costBudgetList[index].otherCosts | numTransition}}</span>
                    </span>
                  </el-form-item>
                </td>
              </tr>

              <tr>
                <td
                  colspan="2"
                  align="center"
                  class="col-title"
                  style="color:#000">
                  合计(万元)
                  <el-tooltip
                    content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工（万元）”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”"
                    placement="top">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </td>
                <td
                  class="data-cell"
                  v-for="(item,index) in budgetForm.costBudgetList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item>
                    <span
                      v-if="budgetForm.costBudgetList[index].timeYear !== '集团批复预算'"
                      :class="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.totalAmount ? 'highlightStyle': ''">
                      {{budgetForm.costBudgetList[index].totalAmount | numTransition}}
                    </span>
                    <span v-else :class="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.totalAmount? 'highlightStyle': ''">{{pfTotalAmount | formatNoData}}</span>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </div>

          <div class="fixed-table" :class="{'hideShadow':hideShadow}">
            <table
              class="budget-con"
              border="1"
              cellpadding="0"
              cellspacing="0">
              <tr>
                <th colspan="2" class="col-title"></th>
                <th v-for="(item,index) in yearList" :key="index" :class="{'year-amount':item === '年度合计','year-all':item === '全项目'}">
                  <span v-if="item !== '年度合计' && item !== '全项目'">{{item}}年度</span>
                  <span v-else>{{item}}</span>
                </th>
              </tr>

              <tr>
                <td rowspan="2" class="col-title">合作开发费</td>
                <td class="col-title-child" :class="isEdit ? 'required' : ''"><span>委外(万元)</span></td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :rowspan="item!=='全项目' ? 1 : 2"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item><span>-</span></el-form-item>
                </td>
              </tr>
              <tr>
                <td class="col-title-child" :class="isEdit ? 'required' : ''"><span>委内(万元)</span></td>
                <td
                  class="data-cell"
                  :class="{'hidden':item==='全项目','year-all':item === '全项目'}"
                  v-for="(item,index) in yearList"
                  :key="index">
                  <el-form-item><span>-</span></el-form-item>
                </td>
              </tr>

              <tr>
                <td rowspan="2" class="col-title">自有人工</td>
                <td class="col-title-child" :class="isEdit ? 'required' : ''"><span>自有人工(人月)</span></td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item><span>-</span></el-form-item>
                </td>
              </tr>
              <tr>
                <td class="col-title-child">自有人工(万元)</td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item><span>-</span></el-form-item>
                </td>
              </tr>

              <tr>
                <td rowspan="4" class="col-title">其他</td>
                <td class="col-title-child">差旅费(万元)</td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item><span>-</span></el-form-item>
                </td>
              </tr>
              <tr>
                <td class="col-title-child">会议费(万元)</td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item><span>-</span></el-form-item>
                </td>
              </tr>
              <tr>
                <td class="col-title-child">资产折旧/摊销(万元)</td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item><span>-</span></el-form-item>
                </td>
              </tr>
              <tr>
                <td class="col-title-child">其他成本(万元)</td>
                <td
                  class="data-cell"
                  v-for="(item,index) in yearList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item><span>-</span></el-form-item>
                </td>
              </tr>

              <tr>
                <td
                  colspan="2"
                  align="center"
                  class="col-title"
                  style="color:#000">
                  合计(万元)
                  <el-tooltip
                    content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工（万元）”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”"
                    placement="top">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </td>
                <td
                  class="data-cell"
                  v-for="(item,index) in budgetForm.costBudgetList"
                  :key="index"
                  :class="{'year-all':item === '全项目'}">
                  <el-form-item><span>-</span></el-form-item>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </el-form>
      <div style="border:1px solid #E8E8E8;padding:24px" v-if="budgetForm.costBudgetList.length == 0">暂无数据</div>
    </project-panel>
  </div>
</template>

<script>
import projectPanel from '@/controller/components/projectPanel'
import bus from '@/common/bus'
import API from '@/serve/API_groupPlanProject'
export default {
  components: { projectPanel },
  data () {
    return {
      budgetForm: {
        projectCode: '', //项目编码
        costBudgetList: []
      },
      isEdit: false, //该项目是否可编辑，详情还是编辑页面
      versionNo: '',
      rules: {},
      yearList: [],
      curYear: new Date()
        .getFullYear(), //当年年份
      countKeys: ['budgetOutsourcing', 'budgetInsourcing', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts'], // 用来计算列合计
      allKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts'], //所有展示的类目
      validResultObj: {
        budgetOutsourcing: true,
        // budgetInsourcing: true,
        staffTime: true,
        laborCosts: true,
        travelExpenses: true,
        conferenceExpenses: true,
        assetDepreciation: true,
        otherCosts: true
      },
      modeType: '', //总分模式BUDGET_TOTAL_MODE，分总模式null
      meberEditFlag: false, //是否团队成员编辑页面
      // language: '预算信息中没有基线字段；',
      hideShadow: true //是否显示阴影
    }
  },
  props: {
    budgetInfo: { type: Object, default: () => {} },
    tips: { type: Boolean, default: false },
    tipLanguage: { type: Boolean, default: false }
  },
  watch: {
    budgetInfo: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.isEdit = newValue.isEdit
          this.budgetForm.projectCode = newValue.projectCode
          this.versionNo = newValue.versionNo
          this.getBudgetAllYear() //获取所有年份的预算信息
        }
      }
    }
  },
  computed: {
    language () {
      let tip = '预算信息中没有基线字段；'
      if (this.tipLanguage) {
        tip = this.modeType === 'total' ? '预算信息中的基线字段：全项目；' : '预算信息中所有可编辑字段都是基线字段；'
      }
      return tip
    }
  },
  created () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
    this.costBudgetType()
  },
  methods: {
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.rowspan || row.colspan) {
          return [row.rowspan || 1, row.colspan || 1]
        } else {
          return [0, 0]
        }
      }
    },
    //监听滚动
    scroll (el) {
      if (el.target.scrollLeft === 0) {
        this.hideShadow = true
      } else if (this.hideShadow) {
        this.hideShadow = false
      }
    },
    // 保存基本信息之后调用获取预算信息
    getCostBudgetList () {
      this.getBudgetAllYear() //获取所有年份的预算信息
      this.changeInfo(false)
    },
    // 获取所有年度预算
    async getBudgetAllYear () {
      await this.costBudgetType()
      if (!this.budgetForm.projectCode) return
      let params = {
        projectCode: this.budgetForm.projectCode
        // versionNo: this.versionNo // 查询指定版本的时候需要传的参数
      }
      API.queryUProjectBudget2(params)
        .then(res => {
          this.budgetForm.costBudgetList = res.costBudgetList || []
          this.yearList = res.yearList || []
          this.yearList.push('年度合计')
          if (this.modeType === 'total') { //总分模式-显示全项目
            this.yearList.push('全项目') //年度合计是null,全项目是ALL
          }
          this.analyzeData()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '项目预算获取失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //解析预算数据
    analyzeData () {
      this.yearList.forEach((year, index) => {
        let hasBudget = this.budgetForm.costBudgetList.some(yearBudget => {
          if (year === '年度合计' && !yearBudget.timeYear) {
            yearBudget.timeYear = '年度合计'
            yearBudget.isYearEdit = false
            return true
          } else if (year === '全项目' && yearBudget.timeYear === 'ALL') {
            yearBudget.timeYear = '全项目'
            yearBudget.isYearEdit = true
            return true
          } else if (parseInt(yearBudget.timeYear) === parseInt(year)) {
            //判断当前年份预算是否可编辑，大于等于当前年份时可编辑
            yearBudget.isYearEdit = parseInt(yearBudget.timeYear) >= this.curYear
            return true
          }
        })
        if (!hasBudget) {
          let budgetObj = {
            timeYear: year,
            budgetOutsourcing: '0',
            budgetInsourcing: '0',
            staffTime: '0',
            laborCosts: '0',
            travelExpenses: '0',
            conferenceExpenses: '0',
            assetDepreciation: '0',
            otherCosts: '0',
            totalAmount: '0',
            isYearEdit: parseInt(year) >= this.curYear || year === '全项目'
          }
          this.budgetForm.costBudgetList.splice(index, 0, budgetObj)
        }
      })
      this.computedAll()
    },
    //分总模式还是总分模式
    costBudgetType () {
      let param = {
        projectCode: this.budgetForm.projectCode || this.$route.query.projectCode
      }
      API.queryCostBudgetType(param)
        .then(res => {
          this.modeType = res === 'BUDGET_TOTAL_MODE' ? 'total' : 'other'
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '预算填报模式获取失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 设置表单必填校验
    setRules (prop, index) {
      let temp = this.budgetForm.costBudgetList[index][prop]
      let checkEmpty = (rule, value, callback) => {
        if (temp === '') {
          callback(new Error('该项不能为空'))
        } else {
          callback()
        }
      }
      let rules = [
        { validator: checkEmpty, required: true, message: '该项不能为空', trigger: 'blur' }
      ]
      return rules
    },
    // 补全小数位&计算合计
    computedAll () {
      this.allKeys.forEach(key => {
        this.yearList.forEach((y, index) => {
          this.computeSum(key, index, false)
        })
      })
    },
    //输入时限制只能输入固定的小数位，超出位数则无法输入，直接删除掉多余的位数
    inputHandler (prop, index) {
      let temp = this.budgetForm.costBudgetList[index][prop] + ''
      if (!temp) return
      if (temp.indexOf('.') > -1) {
        let arr = temp.split('.')
        let integer = arr[0] || '0'
        let decimals = arr[arr.length - 1]
        let len = 6
        if (prop === 'staffTime') {
          len = 2
          integer = integer.length > 6 ? integer.slice(0, 6) : integer
        } else {
          integer = integer.length > 11 ? integer.slice(0, 11) : integer
        }
        decimals = decimals.length > len ? decimals.slice(0, len) : decimals
        temp = `${integer}.${decimals}`
      } else {
        if (prop === 'staffTime') {
          temp = temp.length > 6 ? temp.slice(0, 6) : temp
        } else {
          temp = temp.length > 11 ? temp.slice(0, 11) : temp
        }
      }
      temp = temp.replace(/[^\d.]/g, '')
      this.budgetForm.costBudgetList[index][prop] = temp
    },
    //输入值发生变化
    computeSum (prop, index, isChangeValue = true) {
      if (isChangeValue) {
        this.changeInfo()
      }
      this.validResultObj[prop] = true //清空全项目校验结果
      this.setNumber(prop, index)
      this.computeColSum() // 计算行合计
      // 计算列合计
      this.budgetForm.costBudgetList.forEach(item => {
        item.totalAmount = '0'
        let budgeSum = '0'
        let rowCount = 0
        this.countKeys.forEach(key => {
          if (item[key] === null || item[key] === undefined) rowCount++
          let num = item[key] || '0'
          budgeSum = this.sumFloat(budgeSum, num)
        })
        item.totalAmount = rowCount === this.countKeys.length ? null : budgeSum
      })
    },
    setNumber (prop, index) {
      if (this.budgetForm.costBudgetList[index][prop] === '.') {
        this.budgetForm.costBudgetList[index][prop] = ''
        return
      }
      if (this.budgetForm.costBudgetList[index][prop] === '') return
      let temp = this.budgetForm.costBudgetList[index][prop]
      this.budgetForm.costBudgetList[index][prop] = prop === 'staffTime' ? this.getFixedNumNew(temp, 2) : this.getFixedNumNew(temp, 6)
    },
    //补齐小数位,val --> string
    getFixedNumNew (val, len = 6) {
      let str = ''
      if (val === null) return
      let splitArr = val.split('.')
      if (splitArr.length > 1 && splitArr[1] !== '') {
        str = parseInt(splitArr[0]) + '.'
        if (splitArr[1].length < len) {
          str = str + splitArr[1] + this.getDecimal(len - splitArr[1].length)
        } else {
          str += splitArr[1]
        }
      } else {
        //无小数位，补全
        str = parseInt(splitArr[0]) + '.' + this.getDecimal(len)
      }
      return str
    },
    //补位0
    getDecimal (len) {
      let decimal = ''
      for (let i = 0; i < len; i++) {
        decimal += '0'
      }
      return decimal
    },
    // 计算行合计并追加到 timeYear=年度合计 的对象中
    computeColSum () {
      if (this.budgetForm.costBudgetList.length === 0) {
        return false
      }
      this.allKeys.forEach(key => {
        let sum = '0'
        let colCount = 0
        this.budgetForm.costBudgetList.forEach(item => {
          if (item.timeYear !== '年度合计' && item.timeYear !== '全项目' && item.timeYear !== '集团批复预算') {
            if (item[key] === null || item[key] === undefined) colCount++
            sum = this.sumFloat(sum, item[key])
          }
        })
        this.budgetForm.costBudgetList.forEach(item => {
          if (item.timeYear === '年度合计') {
            let num = this.modeType === 'total' ? 2 : 1
            item[key] = colCount === (this.budgetForm.costBudgetList.length - num) ? null : sum
          }
        })
      })
    },
    //计算浮点数相加
    sumFloat (num1, num2, prop) {
      let int1 = num1 ? (num1.split('.')[0] || 0) : 0
      let int2 = num2 ? (num2.split('.')[0] || 0) : 0
      let decimal1 = num1 ? (num1.split('.')[1] || 0) : 0
      let decimal2 = num2 ? (num2.split('.')[1] || 0) : 0
      //整数与整数相加，2+5=7
      let int = parseInt(int1) + parseInt(int2)
      let decimalLen = prop === 'staffTime' ? 2 : 6
      //小数位相加，再除以倍数，991+999=1990 1990/1000000=0.001990
      // let decimal = (parseInt(decimal1) + parseInt(decimal2)) / Math.pow(10, decimalLen)
      let decimal = (parseFloat('0.' + decimal1) * Math.pow(10, decimalLen) + parseFloat('0.' + decimal2) * Math.pow(10, decimalLen)) / Math.pow(10, decimalLen)
      //获取小数位相加之和补全位数，0.00199 --> 0.001990
      let newDecimal = this.getFixedNumNew(decimal + '', decimalLen)
      //整数位相加的结果再与小数位相加结果的整数位相加，小数与小数相加,7.001990，如：1+1.25 --> 2+0.25
      let sum = (int + parseInt(newDecimal.split('.')[0])) + '.' + newDecimal.split('.')[1]
      return sum
    },
    //有信息发生修改
    changeInfo (edited = true) {
      let params = {
        curBlock: 'projectBudget',
        hasEdited: edited
      }
      bus.$emit('groupPlanProjectEdit', params)
    },
    //输入框获得焦点时，去除补位的0
    focusHandler (prop, index) {
      let temp = this.budgetForm.costBudgetList[index][prop]
      if (temp === '') return
      let numNew = this.numTransition(temp)
      this.budgetForm.costBudgetList[index][prop] = numNew === '0' ? '' : numNew
    },
    blurHandler (prop, index) {
      let temp = this.budgetForm.costBudgetList[index][prop]
      if (temp === '') return
      this.budgetForm.costBudgetList[index][prop] = prop === 'staffTime' ? this.getFixedNumNew(temp, 2) : this.getFixedNumNew(temp, 6)
    },
    validate () {
      return new Promise((resolve, reject) => {
        if (!this.$refs['budgetForm']) {
          resolve(false)
          return false
        }
        this.$refs['budgetForm'].validate(valid => {
          if (valid) {
            let params = []
            this.budgetForm.costBudgetList.forEach(ele => {
              if (ele.timeYear === '全项目') {
                let obj = JSON.parse(JSON.stringify(ele))
                obj.timeYear = 'ALL'
                params.push(obj)
              } else if (ele.timeYear !== '年度合计' && ele.timeYear !== '集团批复预算') {
                params.push(ele)
              }
            })
            //总分模式判断校验
            if (this.modeType === 'total') {
              let result = this.judgeAllProjectBudget()
              if (!result) {
                this.$message({
                  message: '全项目预算不可小于年度预算合计！',
                  type: 'error',
                  showClose: true
                })
                resolve('hasTip')
                return false
              }
            }
            resolve(params)
          } else {
            resolve(false)
            return false
          }
        })
      })
    },
    //校验年度预算合计和全项目预算
    judgeAllProjectBudget () {
      let yearBudget = this.budgetForm.costBudgetList.filter(ele => ele.timeYear === '年度合计')
      let projectBudget = this.budgetForm.costBudgetList.filter(ele => ele.timeYear === '全项目')
      let result = true
      this.allKeys.forEach(key => {
        if (key === 'budgetInsourcing') return
        if (key === 'budgetOutsourcing') {
          //全项目的合作开发费存储字段是委外， 对比 即为 委内+委外 <-> 委外
          let comDevCost = this.sumFloat(yearBudget[0][key], yearBudget[0]['budgetInsourcing'], 'budgetInsourcing')
          this.validResultObj[key] = this.compareFloat(comDevCost, projectBudget[0][key])
        } else {
          this.validResultObj[key] = this.compareFloat(yearBudget[0][key], projectBudget[0][key])
        }
        if (!this.validResultObj[key]) {
          result = false
        }
      })
      return result
    },
    //比较浮点数
    compareFloat (val1, val2) {
      val2 = this.getFixedNumNew(val2)
      let val1Arr = val1.split('.')
      let val2Arr = val2.split('.')
      if (parseInt(val1Arr[0]) < parseInt(val2Arr[0])) return true
      if (parseInt(val1Arr[0]) > parseInt(val2Arr[0])) return false
      if (parseInt(val1Arr[0]) === parseInt(val2Arr[0])) {
        return parseInt(val1Arr[1]) <= parseInt(val2Arr[1] || 0)
      }
    },
    // 暂存区块
    async tempSave () {
      let budgetList = await this.validate()
      if (!budgetList || budgetList === 'hasTip') return
      let params = {
        projectCode: this.budgetForm.projectCode,
        projectBudgetList: budgetList
      }
      API.editProjectBudget(params)
        .then(res => {
          this.$message({
            message: '预算信息保存成功！',
            type: 'success',
            showClose: true
          })
          this.$emit('saveBudget')
          this.changeInfo(false)
          this.getBudgetAllYear()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '预算信息保存失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    numTransition (val) {
      if (val) {
        if (val.indexOf('.') !== -1) {
          let splitArr = val.split('.')
          let reverseArr = splitArr[1].split('')
            .reverse()
          let reverseArr2 = []
          reverseArr.forEach(item => {
            reverseArr2.push(item)
          })
          reverseArr.some((item, index) => {
            if (!parseInt(item)) {
              reverseArr2.shift()
            } else {
              return true
            }
          })
          reverseArr2 = reverseArr2.reverse()
            .join('')
          if (reverseArr2 && reverseArr2.length > 0) {
            return splitArr[0] + '.' + reverseArr2
          } else {
            return splitArr[0]
          }
        } else {
          return val
        }
      } else {
        if (val === null || val === undefined) {
          return ''
        } else {
          return val
        }
      }
    }
  },
  filters: {
    // 过滤小数位后0
    numTransition (val) {
      if (val) {
        if (val.indexOf('.') !== -1) {
          let splitArr = val.split('.')
          let reverseArr = splitArr[1].split('')
            .reverse()
          let reverseArr2 = []
          reverseArr.forEach(item => {
            reverseArr2.push(item)
          })
          reverseArr.some((item, index) => {
            if (!parseInt(item)) {
              reverseArr2.shift()
            } else {
              return true
            }
          })
          reverseArr2 = reverseArr2.reverse()
            .join('')
          if (reverseArr2 && reverseArr2.length > 0) {
            return splitArr[0] + '.' + reverseArr2
          } else {
            return splitArr[0]
          }
        } else {
          return val
        }
      } else {
        if (val === null || val === undefined) {
          return '-'
        } else {
          return val
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.uBudgetNew{
  table {
    border-collapse: collapse;
    border-spacing: 0;

    td, th {
      border-bottom: 1px solid #E8E8E8;
      border-right: 1px solid #E8E8E8;
    }

    tr > td:first-child, tr > td:first-child {
      border-left: 1px solid #E8E8E8;
    }

    tr:first-child td, tr:first-child td {
      border-top: 1px solid #E8E8E8;
    }
  }

  .budget-con {
    min-width: 100%;
    border-collapse: collapse;
    border: 1px solid #E8E8E8;

    .el-icon-info {
      @include color();
    }

    tr {
      th, td {
        min-width: 70px;
        height: 45px;
        padding: 0 20px;
        border-left: none;
        border-right: none;
        border-color: #E8E8E8 !important;
      }

      th, .col-title {
        background: #F4F4F4;
        font-weight: bold;
      }

      .col-title {
        border-right: 1px solid #E8E8E8;
        width: 72px;
        min-width: 72px;
      }

      .col-title-child {
        color: #000 !important;
        border-right: 1px solid #E8E8E8;
        width: 126px;
        min-width: 126px;
        background: #F4F4F4;
      }

      th:nth-child(1) {
        border-right: 1px solid #E8E8E8;
        padding: 0 !important;
      }

      .data-cell {
        text-align: center;
      }

      td:nth-last-child(2) {
        @include color($color-blue);
      }

      &:nth-last-child(1) {
        @include color($color-blue);
        font-weight: bold;
      }

      .year-amount{
        width: 100px;
        min-width: 100px;
      }
      .hidden{
        display: none;
      }
      .year-all{
        border-left: 1px solid #E8E8E8;
      }
    }

    .required span {
      position: relative;

      &::before {
        color: red;
        content: '*';
        position: absolute;
        left: -10px;
        top: 0px;
      }
    }
  }

  .table-wrapper{
    position: relative;
    overflow: hidden;
    .budget-table{
      width: calc(100% - 1px);
      overflow-x: auto;
    }
    .fixed-table{
      position: absolute;
      top: 0;
      left: 0;
      width: 280px; /** (72+20*2)+(126+20*2)+2 */
      overflow-x: hidden;
      overflow-y: hidden;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,.12);
      &.hideShadow{
        box-shadow: none;
      }
    }
  }

  .el-form-item /deep/{
    margin: 8px 0 !important;
    .el-input__inner{
      width: 170px;
    }
    .el-form-item__content .valid-error .el-input__inner{
      border-color: #FF3F3B;
    }
    .el-form-item__content .is-disabled .el-input__inner:hover{
      border-color: #e4e7ed;
    }
  }

  .highlightStyle {
    color: #FF3F3B !important;
  }
}
</style>
