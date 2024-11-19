<template>
  <div class="research-department">
    <div class="header">
      <el-form
        :inline="true"
        :model="searchForm"
        label-width="100px">
        <div>
          <el-form-item label="年份:" prop="timeYear">
            <el-date-picker
              v-model="searchForm.timeYear"
              type="year"
              value-format="yyyy"
              placeholder="请选择"
              :clearable="true"
              @keyup.enter.native="getResSearch"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="类型:" prop="productType">
            <el-select
              v-model="searchForm.productType"
              placeholder="请选择"
              @keyup.enter.native="getResSearch"
              clearable>
              <el-option
                v-for="item in productTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="state">
            <el-select
              v-model="searchForm.state"
              clearable
              @keyup.enter.native="getResSearch"
              placeholder="请选择">
              <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item  class="search-btn">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getResSearch">查询</el-button>
          <el-button
            class="normal-btn"
            icon="el-icon-refresh-left"
            @click="searchReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main">
      <div class="main-header">
        <el-button class="upload-btn" icon="el-icon-circle-plus-outline" @click="add">新增</el-button>
      </div>
      <div class="main-table">
        <el-table
          ref="list"
          :data="searchData.searchList"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            align="left"
            label="名称"
            min-width="150"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.productType=='1'">{{scope.row.productLineName}}</span>
              <span v-if="scope.row.productType=='2'">{{scope.row.productName}}</span>
              <span v-if="scope.row.productType=='3'">{{scope.row.subProductName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            show-overflow-tooltip
            min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.productType=='1'">产品线</span>
              <span v-if="scope.row.productType=='2'">产品</span>
              <span v-if="scope.row.productType=='3'">子产品</span>
            </template>
          </el-table-column>
          <el-table-column
            label="年份"
            prop="timeYear"
            min-width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="90"
            align="left">
            <template slot-scope="scope">
              <span class="state" :class="scope.row.state == '0' ? 'fail' : 'over'"></span>
              <span>{{scope.row.state == '0' ? '已失效' : '已生效'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="left">
            <template slot-scope="scope">
              <el-button v-if="scope.row.state=='0'" type="text" @click="open(scope.$index, scope.row)">启用</el-button>
              <el-button v-if="scope.row.state=='1'" type="text" @click="close(scope.$index, scope.row)">关闭</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="main-footer" v-if="searchData.total">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchForm.pageNo"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="searchForm.pageSize"
            layout="prev, pager, next, sizes, jumper"
            :total="searchData.total"
            background
            :small="false">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      class="dialog"
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="548px"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-position='right'
        ref="ruleForm"
        label-width="110px">
        <el-form-item
          label="类型:"
          prop="productType">
          <el-select
            v-model="ruleForm.productType"
            placeholder="请选择"
            @change="typeChange"
            clearable>
            <el-option
              v-for="item in productTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年份:" prop="timeYear" :rules="[{required: ruleForm.productType=='1', message: ruleForm.productType=='1'?'请输入年份':'',}]">
          <el-date-picker
            :disabled="ruleForm.productType!='1'"
            v-model="ruleForm.timeYear"
            type="year"
            value-format="yyyy"
            placeholder="请选择"
            :clearable="true"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="产品线名称:"
          v-if="ruleForm.productType=='2'||ruleForm.productType=='3'||ruleForm.productType=='1'"
          :prop="ruleForm.productType=='1'?'productLineName':'productLineCode'">
          <el-input
            v-if="ruleForm.productType=='1'"
            placeholder="请输入"
            show-word-limit
            maxlength="120"
            v-model.trim="ruleForm.productLineName"
          ></el-input>
          <el-select
            :popper-append-to-body="false"
            class='dialogSelect'
            v-if="ruleForm.productType=='2'||ruleForm.productType=='3'"
            v-model="ruleForm.productLineCode"
            placeholder="请选择"
            @change="productLineNameChange"
            clearable>
            <el-option
              v-for="item in productLineNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <el-tooltip :content="item.label" :disabled="!showToolTip(item.productLineName, 360)">
                <span>{{item.label}}</span>
              </el-tooltip>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="产品名称:"
          v-if="ruleForm.productType=='2'||ruleForm.productType=='3'"
          :prop="ruleForm.productType=='2'?'productName':'productCode'">
          <el-input
            v-if="ruleForm.productType=='2'"
            placeholder="请输入"
            show-word-limit
            maxlength="120"
            v-model.trim="ruleForm.productName"
          ></el-input>
          <el-select
            :popper-append-to-body="false"
            class='dialogSelect'
            @change="productNameChange"
            v-if="ruleForm.productType=='3'"
            v-model="ruleForm.productCode"
            placeholder="请选择"
            clearable>
            <el-option
              v-for="item in productNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <el-tooltip :content="item.label" :disabled="!showToolTip(item.productName, 360)">
                <span>{{item.label}}</span>
              </el-tooltip>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.productType=='3'"
          label="子产品名称:"
          prop="subProductName">
          <el-input
            placeholder="请输入"
            show-word-limit
            maxlength="120"
            v-model.trim="ruleForm.subProductName"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCancle">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleSave">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from './productInfoConfig'
import { getStore } from '@/store'
import { isShowToolTip } from '@/utils/common.js'
// import { formatDate } from '@lib/common'
export default {
  data () {
    return {
      searchForm: {
        timeYear: '',
        productType: '',
        state: '1',
        'pageNo': 1,
        'pageSize': 10
      }, //研发活动数据
      searchData: {
        searchList: [],
        total: 0
      },
      productTypeOptions: [{ label: '产品线', value: '1' }, { label: '产品', value: '2' }, { label: '子产品', value: '3' }], //产品类型Options
      stateOptions: [{ label: '已生效', value: '1' }, { label: '已失效', value: '0' }], //状态下拉框Options
      productLineNameOptions: [],
      productNameOptions: [],
      dialogVisible: false, //新增&编辑&详情弹出框控制显示
      dialogTitle: '', //传给弹出框的标题
      ruleForm: {
        productType: '',
        timeYear: '',
        productLineName: '',
        productLineCode: '',
        productName: '',
        productCode: '',
        subProductName: ''
      },
      rules: {
        productType: [{ required: true, message: '请选择类型', trigger: ['change', 'blur'] }],
        productLineName: [{ required: true, message: '请输入产品线名称', trigger: ['change', 'blur'] }],
        productLineCode: [{ required: true, message: '请选择产品线名称', trigger: ['change', 'blur'] }],
        productName: [{ required: true, message: '请输入产品名称', trigger: ['change', 'blur'] }],
        productCode: [{ required: true, message: '请选择产品名称', trigger: ['change', 'blur'] }],
        subProductName: [{ required: true, message: '请输入子产品名称', trigger: ['change', 'blur'] }]
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    productNameChange (e) { //todo获取当前选择的产品code
      // console.log(e)
      this.productNameOptions.some(item => {
        if (item.value === e) {
          this.ruleForm.productName = item.label
        }
      })
    },
    productLineNameChange (e) { // todo产品线下拉框值改变的时候并且类型为请求所有产品的下拉框值,并且获取当前选中的产品线 code
      // console.log(e)
      if (e) {
        this.productLineNameOptions.some(item => {
          if (item.value === e) {
            this.ruleForm.productLineName = item.label
            this.ruleForm.timeYear = item.timeYear
          }
        })
        this.ruleForm.productName = ''
        this.ruleForm.productCode = ''
      } else {
        this.ruleForm.productName = ''
        this.ruleForm.productCode = ''
        this.getProductNameOptions = []
      }
      if (this.ruleForm.productType === '3') {
        this.getProductNameOptions(this.ruleForm.productLineCode)
      }
    },
    typeChange (e) { //todo选择的类型改变 ,产品信息或者子产品信息的时候去请求所有产品线下拉框值
      switch (e) {
        case '1':
          this.dialogTitle = '新增产品线信息'
          break
        case '2':
          this.dialogTitle = '新增产品信息'
          this.getProductLineNameOptions()
          this.$refs.ruleForm.clearValidate('timeYear')
          break
        case '3':
          this.$refs.ruleForm.clearValidate('timeYear')
          this.dialogTitle = '新增子产品信息'
          this.getProductLineNameOptions()
          if (this.ruleForm.productLineCode && this.ruleForm.productLineName) {
            this.getProductNameOptions()
          }
          break
        case '':
          this.dialogTitle = '新增信息'
          this.ruleForm.productLineCode = ''
          this.ruleForm.productLineName = ''
          this.ruleForm.productName = ''
          this.ruleForm.productCode = ''
          break
      }
    },
    getProductLineNameOptions () {
      API.queryProductInfoByCondition({ productType: '1' })
        .then(res => {
          res = res || []
          res.forEach(item => {
            item.label = item.productLineName
            item.value = item.productLineCode
          })
          this.productLineNameOptions = res
        })
        .catch(err => {
          if (err.selfError) return
          this.$message({
            message: err.message || '服务器异常,请稍后再试!',
            type: 'error',
            showClose: true
          })
        })
    },
    getProductNameOptions () {
      API.queryProductInfoByCondition({ productType: '2', timeYear: this.ruleForm.timeYear, productCode: this.ruleForm.productLineCode })
        .then(res => {
          res = res || []
          res.forEach(item => {
            item.label = item.productName
            item.value = item.productCode
          })
          this.productNameOptions = res
        })
        .catch(err => {
          if (err.selfError) return
          this.$message({
            message: err.message || '服务器异常,请稍后再试!',
            type: 'error',
            showClose: true
          })
        })
    },
    open (index, row) { //开启
      this.$confirm(' ', '是否确认启用?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          let params = { productType: row.productType, state: '1', productCode: '' }
          if (row.productType === '1') {
            params.productCode = row.productLineCode
          }
          if (row.productType === '2') {
            params.productCode = row.productCode || row.productLineCode
          }
          if (row.productType === '3') {
            params.productCode = row.subProductCode || row.productCode || row.productLineCode
          }
          API.onAndOffProductInfoConfiguration(params)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '启用成功。'
              })
              this.getResSearch()
            })
            .catch(e => {
              this.loading = false
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '启用失败，请稍后重试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
    },
    close (index, row) { //关闭
      this.$confirm(' ', '是否确认关闭?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          let params = { productType: row.productType, state: '0', productCode: '' }
          if (row.productType === '1') {
            params.productCode = row.productLineCode
          }
          if (row.productType === '2') {
            params.productCode = row.productCode || row.productLineCode
          }
          if (row.productType === '3') {
            params.productCode = row.subProductCode || row.productCode || row.productLineCode
          }
          API.onAndOffProductInfoConfiguration(params)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '关闭成功。'
              })
              this.getResSearch()
            })
            .catch(e => {
              this.loading = false
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '关闭失败，请稍后重试！',
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
    },
    dialogVisibleCancle () {
      this.dialogVisible = false
    },
    dialogVisibleSave () { //保存
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            productType: this.ruleForm.productType }
          if (params.productType === '1') {
            params.timeYear = this.ruleForm.timeYear
            params.productLineName = this.ruleForm.productLineName
          }
          if (params.productType === '2') {
            params.productLineName = this.ruleForm.productLineName
            params.productLineCode = this.ruleForm.productLineCode
            params.productName = this.ruleForm.productName
            params.timeYear = this.ruleForm.timeYear
          }
          if (params.productType === '3') {
            params.productLineName = this.ruleForm.productLineName
            params.productLineCode = this.ruleForm.productLineCode
            params.productName = this.ruleForm.productName
            params.productCode = this.ruleForm.productCode
            params.subProductName = this.ruleForm.subProductName
            params.timeYear = this.ruleForm.timeYear
          }
          API.addProductInfoConfiguration(params)
            .then(res => {
              this.$message({
                message: '产品信息保存成功',
                type: 'success'
              })
              this.getResSearch()
            })
            .catch(e => {
              this.loading = false
              if (e.selfError) return
              this.$message({
                message: e.message || '产品信息保存失败',
                type: 'error',
                showClose: true
              })
            })
          this.dialogVisible = false
        }
      })
    },
    getResSearch () {
      this.searchForm.pageNo = 1
      this.getList()
    },
    searchReset () {
      this.searchForm = {
        timeYear: '',
        productType: '',
        state: '1',
        'pageNo': 1,
        'pageSize': 10
      }
      this.getList()
    },
    // 展示数量改变
    handleSizeChange (val) {
      this.searchForm.pageNo = 1
      this.getList(this.searchForm.pageNo, val)
    },
    // 页码改变
    handleCurrentChange (val) {
      this.getList(val, this.searchForm.pageSize)
    },
    add () {
      this.dialogVisible = true
      this.ruleForm = {
        productType: '',
        timeYear: '',
        productLineName: '',
        productLineCode: '',
        productName: '',
        productCode: '',
        subProductName: '',
        subProductCode: ''
      }
      this.productLineNameOptions = []
      this.productNameOptions = []
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
        this.dialogTitle = '新增信息'
      })
    },
    //获取列表
    getList (pageNo = this.searchForm.pageNo, pageSize = this.searchForm.pageSize) {
      this.searchForm.pageNo = pageNo
      this.searchForm.pageSize = pageSize
      let param = {
        timeYear: this.searchForm.timeYear,
        productType: this.searchForm.productType,
        state: this.searchForm.state,
        pageNo: pageNo,
        pageSize: pageSize
      }
      API.queryProductInfoConfiguration(param)
        .then(res => {
          if (res) {
            this.searchData.total = parseInt(res.total)
            this.searchData.searchList = res.records || []
          } else {
            this.searchData.total = 0
            this.searchData.searchList = []
          }
        })
        .catch(err => {
          if (err.selfError) return
          this.$message({
            message: err.message || '服务器异常,请稍后再试!',
            type: 'error',
            showClose: true
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogSelect{
  /deep/ .el-select-dropdown__item span {
          display: inline-block;
          max-width: 360px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
      }
}
  .research-department {
    .header {
      background: #FFFFFF;
      padding: 30px;
      margin-bottom: 10px;
      .search-btn{
        width: 180px;
        float: right;
        margin-right: 0;
      }
    }
    .main {
      background: #FFFFFF;
      padding: 20px 30px;
      &::after {
        content: '';
        display: block;
        clear: both;
        visibility: hidden;
        height: 0;
      }
      .main-header {
        float: right;
        margin-bottom: 20px;
        .upload {
          display: inline-block;
          margin: 0 10px;
        }
      }
      .main-table {
        /deep/ .el-table__expand-icon > .el-icon{
          display: none;
        }
        /deep/ .padding-col {
          padding-left: 30px;
          .cell{
            width: 100% !important;
          }
        }
        /deep/ .el-table__header {
          background: #F4F4F4;
        }
        /deep/ .el-table__body {
          border-left: 1px solid #E5E5E5;
          border-right: 1px solid #E5E5E5;
          .el-table__body-wrapper,
          .el-table__header-wrapper {
            overflow: auto;
            table {
              table-layout: inherit;
              box-sizing: border-box;
              width: 99.8% !important;
            }
          }
        }
        .state {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          margin-right: 5px;
          position: relative;
          bottom: 2.5px;
        }
        .over {
          background: #79c95b;
        }
        .fail {
          background: #FF3F3B;
        }
      }
      .main-footer {
        /deep/ .el-pagination{
          font-size: 12px;
          text-align: center;
          margin-top: 15px;
          /deep/ .el-pager li, /deep/ .btn-prev, /deep/ .btn-next{
            min-width: 28px;
            height: 28px;
            padding: 0;
            background: #FFFFFF;
            border: 1px solid #E5E5E5;
            border-radius: 2px;
            margin: 0 4px;
            font-size: 12px;
            color: #12171F;
            font-weight: normal;
            text-align: center;
            line-height: 28px;
            &.active{
              color: #FFFFFF;
              background: #0B82FF;
              border-color: #0B82FF;
              &:hover{
                color: #FFFFFF;
              }
            }
            &:hover{
              color: #0B82FF;
            }
            &:disabled{
              color: #C0C4CC;
            }
          }
          /deep/ .el-select .el-input .el-input__inner{
            height: 28px;
            line-height: 28px;
            font-size: 12px;
          }
          /deep/ .el-pagination__editor.el-input .el-input__inner {
            height: 28px;
            font-size: 12px;
            background: #FFFFFF;
            border: 1px solid #E5E5E5;
            border-radius: 4px;
          }
          /deep/ .el-select .el-input .el-input__icon {
            line-height: 15px;
          }
          /deep/ .el-pagination__jump{
            margin-left: 0;
            height: 28px;
            font-size: 12px;
          }
        }
      }
    }
   .dialog  /deep/{
      .el-form-item{
       width : 100%;
       margin-bottom: 10px ;
      }
      .el-form-item .el-input__inner{
        width : 100%;
      }
      .el-select{
        width:100%;
      }
      .el-date-editor{
        width:100%;
      }
    }
  }
</style>
