<template>
  <div class="productInfo-edit">
    <projectPanel title="产品信息" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button
          class="normal-btn"
          @click="addProductInfo"
          v-if='!meberEditFlag'
          icon="el-icon-circle-plus-outline">添加产品信息</el-button>
        <section class="radio-box">
          <img
            v-if="isListOrCard === 1"
            class="small-img"
            src="@/assets/icons/listChecked.svg"
          />
          <img
            v-else
            class="small-img"
            src="@/assets/icons/listNoChecked.svg"
            @click="cutCardOrList(1)"
          />
          <img
            v-if="isListOrCard === 2"
            class="small-img"
            src="@/assets/icons/cardChecked.svg"
          />
          <img
            v-else
            class="small-img"
            src="@/assets/icons/cardNoChecked.svg"
            @click="cutCardOrList(2)"
          />
        </section>
      </template>
      <self-table
        v-if="isListOrCard === 1"
        index-title='序号'
        :is-index='true'
        :table-data="tableData"
        :table-cols="tableCols"
        max-height="276px"
        :is-pagination="false"
        :index-method="setIndexMethod"
      ></self-table>
      <product-info-card
        v-if="isListOrCard === 2"
        :table-data="tableData"
        :meber-edit-flag='meberEditFlag'
        @editProductInfo='editProductInfo'
        @delProductInfo='delProductInfo'>
      </product-info-card>
    </projectPanel>

    <product-info-edit-pop
      v-if="dialogVis"
      :dialog-visible.sync="dialogVis"
      :receive-data="curProduct"
      :product-line-option="productLineOptions"
      :product-option="productOptions"
      :sub-product-option="subProductOptions"
      :dialog-type="dialogType"
      :project-code="projectCode"
      @close="close"
      @change="changeProductList"></product-info-edit-pop>
  </div>
</template>

<script>
import selfTable from '@/components/table/index'
import projectPanel from '@/controller/components/projectPanel'
import ProductInfoCard from './productInfoCard.vue'
import ProductInfoEditPop from './productInfoEditPop.vue'
import bus from '@/common/bus'
import groupAPI from '@/serve/API_groupPlanProject'
import API from '@/serve/API_project'
export default {
  components: { selfTable, projectPanel, ProductInfoCard, ProductInfoEditPop },
  data () {
    return {
      isListOrCard: 1,
      meberEditFlag: false,
      tableData: [],
      tableCols: [
        {
          label: '产品树年份',
          prop: 'timeYear',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        },
        {
          label: '产品线名称',
          prop: 'productLineName',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        },
        {
          label: '产品名称',
          prop: 'productName',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        },
        {
          label: '子产品名称',
          prop: 'subProductName',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        },
        {
          label: '操作',
          prop: 'operation',
          type: 'Button',
          align: 'center',
          minwidth: '120px',
          btnList: [
            { type: 'text', label: '编辑', handle: this.editProductInfo, isHidden: this.getmeberEditFlag },
            { type: 'text', label: '删除', handle: this.delProductInfo, isHidden: this.getmeberEditFlag }
          ]
        }
      ],
      dialogVis: false, //新增编辑弹框是否显示
      dialogType: '', //新增add or 编辑edit
      curProduct: null, //新增编辑弹框的产品信息数据
      language: '暂无基线信息', //基线提示语
      productLineOptions: [],
      productOptions: [],
      subProductOptions: []
    }
  },
  props: {
    receiveData: { type: Array, default: () => [] },
    tipLanguage: { type: Boolean, default: () => false },
    projectCode: { type: String, default: '' }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.tableData = JSON.parse(JSON.stringify(val))
        }
      }
    },
    tipLanguage: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.language = '产品信息中所有可编辑字段都是基线字段；'
        } else {
          this.language = '产品信息中没有基线字段；'
        }
      }
    }
  },
  mounted () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
  },
  methods: {
    //切换卡片和列表
    cutCardOrList (val) {
      this.isListOrCard = val
    },
    //设置表格序号
    setIndexMethod (index) {
      return index < 9 ? ('0' + (index + 1)) : index + 1
    },
    //是否成员编辑
    getmeberEditFlag () {
      return !this.meberEditFlag
    },
    //增加产品信息
    addProductInfo () {
      if (!this.projectCode) {
        this.$message({
          message: '请先保存基本信息',
          type: 'warning',
          showClose: true
        })
        return
      }
      this.dialogVis = true
      this.dialogType = 'add'
    },
    //弹框返回新增/编辑成功的产品信息
    changeProductList (type = 'add', data) {
      if (type === 'add') {
        this.tableData.push(data)
      } else {
        let index = -1
        this.tableData.some((ele, i) => {
          if (ele.productInfoCode === data.productInfoCode) {
            index = i
            return true
          }
        })
        if (index > -1) {
          this.tableData.splice(index, 1, data)
        }
      }
    },
    //编辑产品信息
    async editProductInfo (row) {
      await this.getProductInfo('1', row.timeYear)
      await this.getProductInfo('2', row.timeYear, row.productLineCode)
      await this.getProductInfo('3', row.timeYear, row.productCode)
      this.dialogVis = true
      this.curProduct = row
      this.dialogType = 'edit'
    },
    //取消新增/编辑，关闭弹窗
    close () {
      this.curProduct = null
    },
    //删除产品信息
    delProductInfo (row) {
      this.$confirm('一旦确定删除，结果将无法撤回，请谨慎考虑。', '确定要删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          let params = {
            projectCode: this.projectCode,
            productInfoCode: row.productInfoCode
          }
          API.removeProjectProductInfo(params)
            .then(res => {
              let index = -1
              this.tableData.some((ele, i) => {
                if (ele.productInfoCode === row.productInfoCode) {
                  index = i
                  return true
                }
              })
              if (index > -1) {
                this.tableData.splice(index, 1)
              }
              this.changeInfo(false)
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '产品信息删除失败',
                  type: 'error',
                  showClose: true
                })
              }
            })
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    async getProductInfo (type, timeYear, code = '') {
      let params = {
        timeYear: timeYear,
        productType: type, //(1:产品线，2：产品，3：子产品)
        productCode: code,
        state: '1' //1启用
      }
      return groupAPI.queryProductInfoByCondition(params)
        .then(res => {
          if (res) {
            switch (type) {
              case '1':
                this.productLineOptions = res
                break
              case '2':
                this.productOptions = res
                break
              case '3':
                this.subProductOptions = res
                break
            }
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '产品信息获取失败',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    async validate () {
      return new Promise((resolve, reject) => {
        if (this.tableData && this.tableData.length > 0) {
          resolve(this.tableData)
        } else {
          resolve(false)
          return false
        }
      })
    },
    //有信息发生修改
    changeInfo (edited = true, msg = false) {
      let params = {
        curBlock: 'productInfo',
        hasEdited: edited,
        onlyShowMsg: msg
      }
      bus.$emit('groupPlanProjectEdit', params)
    }
  }
}
</script>

<style lang="scss" scoped>
.productInfo-edit{
  .radio-box {
    height: 30px;
    margin-left: 10px;
    .small-img {
      width: 30px;
      height: 30px;
    }
  }
  /deep/ .el-table{
    .cell{
      line-height: 34px;
      padding: 0 5px;
    }
    td{
      padding: 6px 0;
    }
    .el-table__row{
      td{
        &:nth-child(1){
          border-left: 1px solid #EBEEF5;
          // padding-left: 30px;
        }
        &:nth-last-child(1){
          border-right: 1px solid #EBEEF5;
        }
      }
    }
    .padding-col{
      padding-left: 30px;
      .cell{
        width: 100% !important;
      }
    }
    .el-button{
      padding: 6px 5px;
      font-size: 14px;
    }
  }
}
</style>
