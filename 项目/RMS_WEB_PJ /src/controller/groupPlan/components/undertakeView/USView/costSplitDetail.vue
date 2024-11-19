<template>
  <div class="project-budget" ref="outer">
    <div class="budget-body">
      <div style="text-align:right;height:30px;line-height:30px;margin-bottom:10px">
        <span><el-button v-if="edit" @click="save">保存</el-button> 单位：万元</span>
      </div>
      <el-form
        ref="budgetForm"
        :model="budgetForm"
        :inline="true">
        <div class="table-wrapper">
          <div class="orginal-table" @scroll="scroll">
            <table
              style="table-layout:fixed;border-collapse:collapse;"
              class="budget-con"
              border="1"
              :style="{'width':tableWidth + 'px'}"
              cellpadding="0"
              cellspacing="0">
              <tr>
                <th
                  colspan="2"
                  rowspan="2"
                  class="col-title first"
                  fixed="true"
                  style="max-width:220px;word-break: break-all;">
                  <span>需求单位</span>
                  <span>年度</span>
                </th>
                <th
                  colspan="2"
                  class="year-title border-right"
                  v-for="(item, i) in yearArray"
                  :key="i">{{item}}年度</th>
                <th colspan="2" :class="{'year-title':isScrollWidth}">合计</th>
              </tr>
              <tr>
                <template v-for="(item,index) in yearArray">
                  <td :key="index+'-1-1'" class="data-cell bg-title">集团批复</td>
                  <td :key="index+'-3-1'" class="data-cell bg-title border-right">实际成本</td>
                </template>
                <td  class="data-cell bg-title">集团批复</td>
                <td  class="data-cell bg-title">实际成本</td>
              </tr>
              <tr v-for="(item,index) in yearRange" :key="index">
                <td colspan="2" align="center" class="col-title"><span>{{item.xqdw}}</span></td>
                <template v-for="(annualVO,index) in item.annualVO">
                  <td :key="index+'-1-1'" class="data-cell">{{annualVO.groupReply | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell border-right">
                    <template v-if="!edit">
                      {{annualVO.actualCost | formatNoData}}
                    </template>
                    <input v-model="annualVO.actualCost" v-else>
                  </td>
                </template>
                <td class="data-cell sub-bule">{{item.rowTotalSum | formatNoData}}</td>
                <td class="data-cell sub-bule">{{item.rowTotalActualSum | formatNoData}}</td>
              </tr>

              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计
                  <el-tooltip content="合计=所有小计之和" placement="top">
                    <i class="el-icon-info sub-bule"></i>
                  </el-tooltip>
                </td>
                <template v-for="(item,index) in yearArray">
                  <td :key="index+'-1-1'" class="data-cell sub-bule">{{dataMap.get(item).groupReply | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell sub-bule border-right">{{dataMap.get(item).actualCost | formatNoData}}</td>
                </template>
                <td class="data-cell sub-bule">{{allTotal.allSum | formatNoData}}</td>
                <td class="data-cell sub-bule">{{allTotal.allActualSum | formatNoData}}</td>
              </tr>
            </table>
          </div>

          <div class="fixed-table" :class="{'hideShadow':hideShadow}">
            <table
              style="table-layout:fixed;border-collapse:collapse;"
              class="budget-con"
              border="1"
              :style="{'width':tableWidth + 'px'}"
              cellpadding="0"
              cellspacing="0">
              <tr>
                <th
                  colspan="2"
                  rowspan="2"
                  class="col-title first"
                  fixed="true"
                  style="max-width:220px;word-break: break-all;">
                  <span>需求单位</span>
                  <span>年度</span>
                </th>
                <th
                  colspan="2"
                  class="year-title border-right"
                  v-for="(item, i) in yearArray"
                  :key="i">{{item}}年度</th>
                <th colspan="2" :class="{'year-title':isScrollWidth}">合计</th>
              </tr>
              <tr>
                <template v-for="(item,index) in yearArray">
                  <td :key="index+'-1-1'" class="data-cell bg-title">集团批复</td>
                  <td :key="index+'-3-1'" class="data-cell bg-title border-right">实际成本</td>
                </template>
                <td  class="data-cell bg-title">集团批复</td>
                <td  class="data-cell bg-title">实际成本</td>
              </tr>
              <tr v-for="(item,index) in yearRange" :key="index">
                <td colspan="2" align="center" class="col-title"><span>{{item.xqdw}}</span></td>
                <template v-for="(annualVO,index) in item.annualVO">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell border-right"></td>
                </template>
                <td class="data-cell sub-bule"></td>
                <td class="data-cell sub-bule"></td>
              </tr>

              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计
                  <el-tooltip content="合计=所有小计之和" placement="top">
                    <i class="el-icon-info sub-bule"></i>
                  </el-tooltip>
                </td>
                <template v-for="(item,index) in yearArray">
                  <td :key="index+'-1-1'" class="data-cell sub-bule"></td>
                  <td :key="index+'-2-1'" class="data-cell sub-bule border-right"></td>
                </template>
                <td class="data-cell sub-bule"></td>
                <td class="data-cell sub-bule"></td>
              </tr>
            </table>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { addNum } from '@/utils/numberAdd'
export default {
  data () {
    return {
      budgetForm: {
        projectCode: '', //项目编码
        costBudgetList: []
      },
      templateList: [], // 用来展示信息的数组
      allKeys: ['groupReply', 'actualCost'],
      yearRange: [],
      dataMap: {},
      allTotal: {},
      yearArray: [],
      tableWidth: 0,
      isScrollWidth: false,
      hideShadow: true
    }
  },
  props: {
    receiveData: {
      type: Array,
      default: () => []
    },
    info: {},
    edit: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo'
    })
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (Array.isArray(val)) {
          if (val.length) {
            this.analyzeData()
          } else {
            this.yearArray = []
            this.yearRange = []
            this.dataMap = {}
            this.allTotal = {}
          }
        }
        this.computedWidth()
      }
    }
  },
  methods: {
    computedWidth () { // 计算表格宽度
      let width = 0
      if (!(this.$refs && this.$refs.outer)) return
      let outerWidth = this.$refs.outer.clientWidth
      let defaultWidth = 0
      if (this.yearArray && this.yearArray.length) {
        defaultWidth = (this.yearArray.length + 2) * 220
      }
      this.isScrollWidth = defaultWidth > outerWidth
      if (this.isScrollWidth) {
        width = defaultWidth
      } else {
        width = outerWidth
      }
      this.tableWidth = width
    },
    save () {},
    handleTotal () {
      this.allTotal.allSum = 0
      this.allTotal.allActualSum = 0
      this.dataMap = new Map()
      this.yearRange.forEach(year => {
        var rowTotalSum = 0
        var rowTotalActualSum = 0
        year.annualVO.forEach(annualVO => {
          let tmpObj = Object.assign({}, annualVO)
          let tmpAnnualVO = this.dataMap.get(tmpObj.year)
          if (tmpAnnualVO) {
            tmpAnnualVO.actualCost = addNum(tmpAnnualVO.actualCost, tmpObj.actualCost)
            tmpAnnualVO.groupReply = addNum(tmpAnnualVO.groupReply, tmpObj.groupReply)
            this.dataMap.set(tmpObj.year, tmpAnnualVO)
          } else {
            this.dataMap.set(tmpObj.year, tmpObj)
          }
          rowTotalSum = addNum(rowTotalSum, annualVO.groupReply)
          rowTotalActualSum = addNum(rowTotalActualSum, annualVO.actualCost)
        })
        year.rowTotalSum = rowTotalSum
        year.rowTotalActualSum = rowTotalActualSum
        this.allTotal.allSum = addNum(rowTotalSum, this.allTotal.allSum)
        this.allTotal.allActualSum = addNum(rowTotalActualSum, this.allTotal.allActualSum)
      })
    },
    analyzeData () {
      //初始化清空默认数据
      this.yearRange = JSON.parse(JSON.stringify(this.receiveData))
      this.yearRange.forEach(item => {
        let yearMap = new Map()
        item.annualVO.forEach(tmp => {
          if (!this.yearArray.includes(tmp.year)) {
            this.yearArray.push(tmp.year)
          }
          yearMap.set(tmp.year, tmp)
        })
      })
      this.handleTotal()
    },
    //监听滚动
    scroll (el) {
      if (el.target.scrollLeft === 0) {
        this.hideShadow = true
      } else if (this.hideShadow) {
        this.hideShadow = false
      }
    }
  },
  mounted () {
  },
  filters: {
    formatPersonMonth (val) {
      if (val !== null && val !== undefined && val !== '' && val !== 'undefined' && val !== 'null') {
        return addNum(val, 0)
      } else {
        return '-'
      }
    },
    formatNoData (val) {
      if (val !== null && val !== undefined && val !== '' && val !== 'undefined' && val !== 'null') {
        return addNum(val, 0)
      } else {
        return '-'
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.project-budget{
// width: 1080px;
  .budget-body{
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
  table{
    width:initial;
    min-width:initial;
    max-width:100%;
  }
  // th:first-child{position: fixed;left: 5px}
  .budget-con{
    table-layout:fixed;
    min-width: 100%;
    border-collapse: collapse;
    border: 1px solid #E8E8E8;
    // position: relative;
    tr {
      th,td{
        height: 45px;
        padding: 0 20px;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid #e8e8e8;
        // &:last-child{
          // border-collapse:collapse;
        // }
      }
      th,.col-title{
        background: #F4F4F4;
        font-weight: bold;
        min-width: 200px;
      }
      .col-title{
        border-right: 1px solid #E8E8E8;
        width: 126px;
        min-width: 126px;
        max-width: 126px;
      }
      .year-title {
        width: 220px;
        min-width: 220px;
        max-width: 220px;
      }
      .bg-title {
        background: #F4F4F4;
        font-weight: bold;
        white-space: nowrap;
      }
      th:nth-child(1){
        border-right: 1px solid #E8E8E8;
      }
      .data-cell{
        text-align: center;
      }
      .sub-bule {
        @include color();
      }
      .border-right {
        border-right: 1px solid #E8E8E8;
      }
      th.first{
        width: 220px !important;
        min-width: 220px;
        max-width: 220px;
        position: relative;
        span:nth-child(1){
          position: absolute;
          top: 85px;
          left: 50%;
          transform: translate(-100%, -150%);
        }
        span:nth-child(2){
          position: absolute;
          top: 0%;
          left: 50%;
          transform: translate(0%, 50%);
        }
        &::before{
          content: "";
          position: absolute;
          width: 1px;
          height:276px;/*这里需要自己调整，根据td的宽度和高度*/
          top:0;
          left:0;
          background-color: #E9E9E9;
          display: block;
          transform: rotate(-70.7deg);/*这里需要自己调整，根据线的位置*/
          transform-origin: top;
        }
      }
    }
    .none-border {
      border-right: none !important;
    }
    .sum-color {
      color: #20A0FF;
    }
    // .el-form-item{
    //   margin-bottom: 0;
    //   margin-right: 0;
    //   /deep/ .el-form-item__content{
    //     width: 220px;
    //   }
    // }
  }
}
  margin-top: 20px;

  .table-wrapper{
    position: relative;
    overflow: hidden;
    .orginal-table{
      width: calc(100% - 1px);
      overflow-x: auto;
    }
    .fixed-table{
      position: absolute;
      top: 0;
      left: 0;
      width: 261px; /** 220+20*2+1 */
      overflow-x: hidden;
      overflow-y: hidden;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,.12);
      &.hideShadow{
        box-shadow: none;
      }
    }
  }
}
</style>
