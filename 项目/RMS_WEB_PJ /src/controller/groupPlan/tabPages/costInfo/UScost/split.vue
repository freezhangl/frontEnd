<template>
  <div class="project-budget" ref="outer">
    <div class="top-button">
      <span>实际成本拆分</span>
      <span>
        <el-button @click="save" v-if="showSaveBtn" style="line-height: 22px;">保存</el-button>
        单位：万元
      </span>
    </div>
    <div class="budget-body">
      <el-form
        ref="budgetForm"
        :model="budgetForm"
        :inline="true">
        <div class="table-wrapper">
          <div class="orginal-table" @scroll="scroll">
            <table
              ref="table"
              style="table-layout:fixed;border-collapse:collapse;"
              class="budget-con"
              border="1"
              :style="{'width':tableWidth + 'px'}"
              cellpadding="0"
              cellspacing="0">
              <tr>
                <th
                  ref="cell"
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
                <th colspan="2" ref="totlewidth" :class="{'year-title':isScrollWidth}">合计</th>
              </tr>
              <tr>
                <template v-for="(item,index) in yearArray">
                  <th :key="index+'-1-1'" class="data-cell bg-title">集团批复</th>
                  <th :key="index+'-3-1'" class="data-cell bg-title border-right">实际成本</th>
                </template>
                <th  class="data-cell bg-title">集团批复</th>
                <th  class="data-cell bg-title">实际成本</th>
              </tr>
              <tr v-for="(item,index) in yearRange" :key="index">
                <td colspan="2" align="center" class="col-title"><span>{{item.demandName}}</span></td>
                <template v-for="(costDtos,inde) in item.costDtos">
                  <td :key="inde+'-1-1'" class="data-cell border-title">
                    <!-- {{costDtos.blocReplyCost | formatNoData}} -->
                    <el-tooltip
                      :content="costDtos.blocReplyCost | formatNoData"
                      placement="top"
                      :disabled="isShowTip(costDtos.blocReplyCost)">
                      <span>{{costDtos.blocReplyCost | formatNoData}}</span>
                    </el-tooltip>
                  </td>
                  <td :key="inde+'-2-1'" class="data-cell border-right" :class="!edit">
                    <template v-if="!edit">
                      <!-- {{costDtos.actualCost | formatNoData}} -->
                      <el-tooltip
                        :content="costDtos.actualCost | formatNoData"
                        placement="top"
                        :disabled="isShowTip(costDtos.actualCost)">
                        <span>{{costDtos.actualCost | formatNoData}}</span>
                      </el-tooltip>
                    </template>
                    <input
                      v-model="costDtos.actualCost"
                      style="max-width:100%;"
                      @input="inputHandler(index,inde)"
                      @change="handleTotal(index,inde)"
                      v-else-if="sumData[costDtos.timeYear]">
                    <span v-else>-</span>
                  </td>
                </template>
                <td class="data-cell sub-bule border-title">
                  <!-- {{item.rowTotalSum | formatNoData}} -->
                  <el-tooltip
                    :content="item.rowTotalSum + ''"
                    placement="top"
                    :disabled="isShowTip(item.rowTotalSum,'total')">
                    <span>{{item.rowTotalSum | formatNoData}}</span>
                  </el-tooltip>
                </td>
                <td class="data-cell sub-bule border-title">
                  <!-- {{item.rowTotalActualSum | formatNoData}} -->
                  <el-tooltip
                    :content="item.rowTotalActualSum + ''"
                    placement="top"
                    :disabled="isShowTip(item.rowTotalActualSum,'total')">
                    <span>{{item.rowTotalActualSum | formatNoData}}</span>
                  </el-tooltip>
                </td>
              </tr>
              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计
                  <el-tooltip content="合计=所有小计之和" placement="top">
                    <i class="el-icon-info sub-bule"></i>
                  </el-tooltip>
                </td>
                <template v-for="(item,index) in yearArray">
                  <td :key="index+'-1-1'" class="data-cell sub-bule border-title border-title">
                    <!-- {{dataMap.get(item).blocReplyCost | formatNoData}} -->
                    <el-tooltip
                      :content="dataMap.get(item).blocReplyCost | formatNoData"
                      placement="top"
                      :disabled="isShowTip(dataMap.get(item).blocReplyCost)">
                      <span>{{dataMap.get(item).blocReplyCost | formatNoData}}</span>
                    </el-tooltip>
                  </td>
                  <td :key="index+'-2-1'" class="data-cell sub-bule border-right border-title">
                    <el-tooltip
                      :content="dataMap.get(item).actualCost | formatNoData"
                      placement="top"
                      :disabled="isShowTip(dataMap.get(item).actualCost)">
                      <span>{{dataMap.get(item).actualCost | formatNoData}}</span>
                    </el-tooltip>
                  </td>
                </template>
                <td class="data-cell sub-bule border-title">
                  <!-- {{allTotal.allSum | formatNoData}} -->
                  <el-tooltip
                    :content="allTotal.allSum + ''"
                    placement="top"
                    :disabled="isShowTip(allTotal.allSum,'total')">
                    <span>{{allTotal.allSum | formatNoData}}</span>
                  </el-tooltip>
                </td>
                <td class="data-cell sub-bule border-title">
                  <!-- {{allTotal.allActualSum | formatNoData}} -->
                  <el-tooltip
                    :content="allTotal.allActualSum + ''"
                    placement="top"
                    :disabled="isShowTip(allTotal.allActualSum,'total')">
                    <span>{{allTotal.allActualSum | formatNoData}}</span>
                  </el-tooltip>
                </td>
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
                  ref="cell"
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
                <th colspan="2" ref="totlewidth" :class="{'year-title':isScrollWidth}">合计</th>
              </tr>
              <tr>
                <template v-for="(item,index) in yearArray">
                  <th :key="index+'-1-1'" class="data-cell bg-title">集团批复</th>
                  <th :key="index+'-3-1'" class="data-cell bg-title border-right">实际成本</th>
                </template>
                <th  class="data-cell bg-title">集团批复</th>
                <th  class="data-cell bg-title">实际成本</th>
              </tr>
              <tr v-for="(item,index) in yearRange" :key="index">
                <td colspan="2" align="center" class="col-title"><span>{{item.demandName}}</span></td>
                <template v-for="(costDtos,inde) in item.costDtos">
                  <td :key="inde+'-1-1'" class="data-cell border-title"></td>
                  <td :key="inde+'-2-1'" class="data-cell border-right" :class="!edit"></td>
                </template>
                <td class="data-cell sub-bule border-title"></td>
                <td class="data-cell sub-bule border-title"></td>
              </tr>
              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计
                  <el-tooltip content="合计=所有小计之和" placement="top">
                    <i class="el-icon-info sub-bule"></i>
                  </el-tooltip>
                </td>
                <template v-for="(item,index) in yearArray">
                  <td :key="index+'-1-1'" class="data-cell sub-bule border-title border-title"></td>
                  <td :key="index+'-2-1'" class="data-cell sub-bule border-right border-title"></td>
                </template>
                <td class="data-cell sub-bule border-title"></td>
                <td class="data-cell sub-bule border-title"></td>
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
import { addNum, deleteZero } from '@/utils/numberAdd'
export default {
  data () {
    return {
      budgetForm: {
        projectCode: '', //项目编码
        costBudgetList: []
      },
      templateList: [], // 用来展示信息的数组
      allKeys: ['blocReplyCost', 'actualCost'],
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
    sumData: { type: Object },
    info: {},
    edit: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo'
    }),
    showSaveBtn () {
      if (this.edit) {
        const allInp = this.$refs.table.querySelectorAll('input')
        if (allInp && allInp.length) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val.length > 0) {
          this.analyzeData()
        }
        this.computedWidth()
      }
    },
    sumData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val.length > 0) {
          // this.analyzeData()
        }
        this.computedWidth()
      }
    }
  },
  methods: {
    isShowTip (data, node) {
      let ShowTip = true
      if (typeof data !== 'string') {
        data = data + ''
      }
      if (this.yearArray.length < 3) {
        ShowTip = true
        if (data.length > 12 && node !== 'total') {
          ShowTip = false
        } else {
          if (data.length > 18) {
            ShowTip = false
          }
        }
      } else {
        if (data && data.length > 12) {
          ShowTip = false
        }
      }
      return ShowTip
    },
    computedWidth () { // 计算表格宽度
      let width = 0
      if (!(this.$refs && this.$refs.outer)) return
      let outerWidth = this.$refs.outer.clientWidth
      let cellWidth = this.$refs.cell.clientWidth
      let defaultWidth = 0
      if (this.yearArray && this.yearArray.length) {
        defaultWidth = (this.yearArray.length + 2) * cellWidth
      }
      this.isScrollWidth = defaultWidth > outerWidth
      if (this.isScrollWidth) {
        width = defaultWidth
      } else {
        width = outerWidth
      }
      this.tableWidth = width
    },
    save () {
      let arr = this.verifyVal()
      if (!arr.length) {
        this.$emit('save', this.yearRange)
      } else {
        this.$message({
          message: arr.toString() + '年度拆分不合理',
          type: 'warning',
          showClose: true
        })
      }
    },
    //输入时限制只能输入固定的小数位，超出位数则无法输入，直接删除掉多余的位数
    inputHandler (index, inde) {
      let temp = this.yearRange[index].costDtos[inde].actualCost
      if (!temp) return
      // temp = temp.replace(/[\u4e00-\u9fa5]/ig, '')
      temp = temp.replace(/[^\d.]/g, '')
      if (temp.indexOf('.') > -1) {
        let arr = temp.split('.')
        let integer = arr[0] || '0'
        let decimals = arr[arr.length - 1]
        integer = integer.length > 11 ? integer.slice(0, 11) : integer
        let len = 6
        decimals = decimals.length > len ? decimals.slice(0, len) : decimals
        temp = `${integer}.${decimals}`
      } else {
        temp = temp.length > 11 ? temp.slice(0, 11) : temp
      }
      // temp = temp.replace(/[^\d.]/g, '')
      this.yearRange[index].costDtos[inde].actualCost = temp
    },
    handleTotal (index, inde) {
      if (!(index === undefined) && !(inde === undefined)) {
        if (this.yearRange[index].costDtos[inde].actualCost === '.') {
          this.yearRange[index].costDtos[inde].actualCost = ''
          this.calculation()
          return
        }
        if (this.yearRange[index].costDtos[inde].actualCost === '') {
          this.calculation()
          return
        }
        let temp = this.yearRange[index].costDtos[inde].actualCost
        let str = ''
        if (temp === null) return
        let splitArr = temp.split('.')
        if (splitArr.length > 1 && splitArr[1] !== '') {
          str = parseInt(splitArr[0]) + '.' + splitArr[1]
        } else {
        //无小数位，补全
          str = parseInt(splitArr[0]) + ''
        }
        this.yearRange[index].costDtos[inde].actualCost = str
      }
      this.calculation()
    },
    calculation () {
      this.allTotal.allSum = 0
      this.allTotal.allActualSum = 0
      this.dataMap = new Map()
      this.yearRange.forEach(year => {
        var rowTotalSum = 0
        var rowTotalActualSum = 0
        year.costDtos.forEach(costDtos => {
          let tmpObj = Object.assign({}, costDtos)
          let tmpAnnualVO = this.dataMap.get(tmpObj.timeYear)
          if (tmpAnnualVO) {
            tmpAnnualVO.actualCost = addNum(tmpAnnualVO.actualCost, tmpObj.actualCost)
            tmpAnnualVO.blocReplyCost = addNum(tmpAnnualVO.blocReplyCost, tmpObj.blocReplyCost)
            this.dataMap.set(tmpObj.timeYear, tmpAnnualVO)
          } else {
            this.dataMap.set(tmpObj.timeYear, tmpObj)
          }
          rowTotalSum = addNum(rowTotalSum, costDtos.blocReplyCost)
          rowTotalActualSum = addNum(rowTotalActualSum, costDtos.actualCost)
        })
        year.rowTotalSum = rowTotalSum
        year.rowTotalActualSum = rowTotalActualSum

        this.allTotal.allSum = addNum(rowTotalSum, this.allTotal.allSum)
        this.allTotal.allActualSum = addNum(rowTotalActualSum, this.allTotal.allActualSum)
      })
      this.verifyVal()
    },
    analyzeData () {
      //初始化清空默认数据
      this.yearRange = JSON.parse(JSON.stringify(this.receiveData))
      this.yearRange.forEach(item => {
        let yearMap = new Map()
        item.costDtos.forEach(tmp => {
          tmp.actualCost = deleteZero(tmp.actualCost)
          if (!this.yearArray.includes(tmp.timeYear)) {
            this.yearArray.push(tmp.timeYear)
          }
          yearMap.set(tmp.timeYear, tmp)
        })
      })
      this.handleTotal()
    },
    // 实际成本拆分校验
    verifyVal () {
      let yearArr = []
      this.dataMap.forEach(element => {
        if (element.actualCost) {
          if (deleteZero(element.actualCost) !== deleteZero(this.sumData[element.timeYear])) {
            yearArr.push(element.timeYear)
          }
        } else {
          if (this.sumData[element.timeYear]) {
            if (deleteZero(element.actualCost) !== deleteZero(this.sumData[element.timeYear])) {
              yearArr.push(element.timeYear)
            }
          }
        }
      })
      return yearArr
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
        return deleteZero(val)
      } else {
        return '-'
      }
    },
    formatNoData (val) {
      if (val !== null && val !== undefined && val !== '' && val !== 'undefined' && val !== 'null') {
        return deleteZero(val)
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
  .top-button{
    overflow: hidden;
    margin-bottom: 10px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .el-button{
      vertical-align: bottom;
      @include color();
    }
  }
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
      .border-title{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
