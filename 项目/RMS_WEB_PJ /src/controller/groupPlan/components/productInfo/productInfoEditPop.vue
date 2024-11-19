<template>
  <div class="product-info-edit-pop">
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :title="dialogType === 'add' ? '新增产品信息' : '编辑产品信息'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="700px"
      :before-close="beforeClose">
      <el-form
        ref="proInfoForm"
        :model="proInfoForm"
        :rules="rules"
        label-width="100px"
        label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="产品树年份:"
              prop="timeYear">
              <el-date-picker
                v-model="proInfoForm.timeYear"
                type="year"
                value-format='yyyy'
                placeholder="请选择"
                @change="changeYear">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="产品线名称:"
              prop="productLineCode">
              <el-select
                :popper-append-to-body="false"
                v-model="proInfoForm.productLineCode"
                placeholder="请选择"
                clearable
                @change="changeProductLine">
                <el-option
                  v-for="item in productLineOptions"
                  :key="item.productLineCode"
                  :label="item.productLineName"
                  :value="item.productLineCode"
                >
                  <el-tooltip :content="item.productLineName" :disabled="!showToolTip(item.productLineName, 180)">
                    <span>{{item.productLineName}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="产品名称:"
              prop="productCode">
              <el-select
                :popper-append-to-body="false"
                v-model="proInfoForm.productCode"
                placeholder="请选择"
                clearable
                @change="changeProduct">
                <el-option
                  v-for="item in productOptions"
                  :key="item.productCode"
                  :label="item.productName"
                  :value="item.productCode"
                >
                  <el-tooltip :content="item.productName" :disabled="!showToolTip(item.productName, 180)">
                    <span>{{item.productName}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="子产品名称:"
              prop="subProductCode">
              <el-select
                :popper-append-to-body="false"
                v-model="proInfoForm.subProductCode"
                placeholder="请选择"
                clearable
                @change="changeSubProduct">
                <el-option
                  v-for="item in subProductOptions"
                  :key="item.subProductCode"
                  :label="item.subProductName"
                  :value="item.subProductCode"
                >
                  <el-tooltip :content="item.subProductName" :disabled="!showToolTip(item.subProductName, 180)">
                    <span>{{item.subProductName}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/serve/API_groupPlanProject'
import { isShowToolTip } from '@/utils/common.js'
export default {
  data () {
    return {
      proInfoForm: {
        productInfoCode: '',
        projectCode: '',
        timeYear: '',
        productLineCode: '',
        productLineName: '',
        productCode: '',
        productName: '',
        subProductCode: '',
        subProductName: ''
      },
      rules: {
        timeYear: [{ required: true, message: '请选择产品树年份', trigger: ['change', 'blur'] }],
        productLineCode: [{ required: true, message: '请选择产品线', trigger: ['change', 'blur'] }],
        productCode: [{ required: true, message: '请选择产品', trigger: ['change', 'blur'] }],
        subProductCode: [{ required: true, message: '请选择子产品', trigger: ['change', 'blur'] }]
      },
      productLineOptions: [],
      productOptions: [],
      subProductOptions: []
    }
  },
  props: {
    dialogVisible: { type: Boolean, default: false },
    dialogType: { type: String, default: '' },
    receiveData: { type: Object, default: () => {} },
    projectCode: { type: String, default: '' }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.proInfoForm = JSON.parse(JSON.stringify(val))
        }
      }
    },
    projectCode: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.proInfoForm.projectCode = val
        }
      }
    }
  },
  mounted () {
    if (this.dialogType === 'edit') {
      this.getProductInfo('1', '', 'edit')
      this.getProductInfo('2', this.proInfoForm.productLineCode, 'edit')
      this.getProductInfo('3', this.proInfoForm.productCode, 'edit')
    }
  },
  methods: {
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    close () {
      this.$emit('close') //清空数据
      this.$emit('update:dialogVisible', false) //更新弹框的visible
    },
    //取消新增/编辑
    cancle () {
      this.close()
    },
    beforeClose (done) {
      this.close()
    },
    //确定
    confirm () {
      this.$refs.proInfoForm.validate(valid => {
        if (valid) {
          if (this.dialogType === 'add') { //新增
            this.getName(this.productLineOptions, 'productLine')
            this.getName(this.productOptions, 'product')
            this.getName(this.subProductOptions, 'subProduct')
            API.addProjectProductInfo(this.proInfoForm)
              .then(res => {
                if (res) {
                  this.$emit('change', 'add', JSON.parse(JSON.stringify(res)))
                }
                this.close()
              })
              .catch(e => {
                if (e.selfError) return
                if (e.message) {
                  this.$message({
                    message: e.message || '产品信息添加失败',
                    type: 'error',
                    showClose: true
                  })
                }
              })
          } else { //编辑
            this.getName(this.productLineOptions, 'productLine')
            this.getName(this.productOptions, 'product')
            this.getName(this.subProductOptions, 'subProduct')
            API.editProjectProductInfo(this.proInfoForm)
              .then(res => {
                if (res) {
                  this.$emit('change', 'edit', JSON.parse(JSON.stringify(this.proInfoForm)))
                }
                this.close()
              })
              .catch(e => {
                if (e.selfError) return
                if (e.message) {
                  this.$message({
                    message: e.message || '产品信息添加失败',
                    type: 'error',
                    showClose: true
                  })
                }
              })
          }
        }
      })
    },
    //获取下拉列表中对应的name值
    getName (options, key) {
      options.some(opt => {
        if (opt[`${key}Code`] === this.proInfoForm[`${key}Code`]) {
          this.proInfoForm[`${key}Name`] = opt[`${key}Name`]
          return true
        }
      })
    },
    //年份变化
    changeYear (val) {
      this.proInfoForm.productLineCode = ''
      this.proInfoForm.productCode = ''
      this.proInfoForm.subProductCode = ''
      this.productLineOptions = []
      this.productOptions = []
      this.subProductOptions = []
      if (val) {
        this.getProductInfo('1')
      }
    },
    //产品线变化
    changeProductLine (val) {
      this.proInfoForm.productCode = ''
      this.proInfoForm.subProductCode = ''
      this.productOptions = []
      this.subProductOptions = []
      if (val) {
        this.getProductInfo('2', val)
      }
    },
    //产品变化
    changeProduct (val) {
      this.proInfoForm.subProductCode = ''
      this.subProductOptions = []
      if (val) {
        this.getProductInfo('3', val)
      }
    },
    //子产品变化
    changeSubProduct (val) {

    },
    //获取产品信息
    getProductInfo (type, code = '', dType = '') {
      let params = {
        timeYear: this.proInfoForm.timeYear,
        productType: type, //(1:产品线，2：产品，3：子产品)
        productCode: code,
        state: '1' //1启用
      }
      API.queryProductInfoByCondition(params)
        .then(res => {
          if (res) {
            switch (type) {
              case '1':
                this.productLineOptions = res
                this.insertOptions(dType, 'productLine')
                break
              case '2':
                this.productOptions = res
                this.insertOptions(dType, 'product')
                break
              case '3':
                this.subProductOptions = res
                this.insertOptions(dType, 'subProduct')
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
    insertOptions (dType, key) {
      if (dType === 'edit' && !this[`${key}Options`].some(opt => opt[`${key}Code`] === this.proInfoForm[`${key}Code`])) {
        this[`${key}Options`].unshift({
          [`${key}Code`]: this.proInfoForm[`${key}Code`],
          [`${key}Name`]: this.proInfoForm[`${key}Name`]
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-info-edit-pop{
  /deep/ .el-select-dropdown__item span {
      display: inline-block;
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }
}
</style>
