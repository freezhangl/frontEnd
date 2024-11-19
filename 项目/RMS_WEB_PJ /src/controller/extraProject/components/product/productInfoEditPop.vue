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
              <el-tooltip
                placement="top-start"
                :content="getTooltipName(proInfoForm.productLineCode,productLineOptions,1)"
                :disabled="!getTooltipName(proInfoForm.productLineCode,productLineOptions,1)">
                <el-select
                  :popper-append-to-body="false"
                  v-model="proInfoForm.productLineCode"
                  placeholder="请选择"
                  clearable
                  @change="changeProductLine"
                >
                  <el-option
                    v-for="item in productLineOptions"
                    :key="item.productLineCode"
                    :label="item.productLineName"
                    :value="item.productLineCode"
                  >
                    <el-tooltip
                      effect="dark"
                      placement="bottom-start"
                      :content="item.productLineName"
                      :disabled="!showToolTip(item.productLineName, 180)">
                      <span>{{item.productLineName}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="产品名称:"
              prop="productCode">
              <el-tooltip
                placement="top-start"
                :content="getTooltipName(proInfoForm.productCode,productOptions,2)"
                :disabled="!getTooltipName(proInfoForm.productCode,productOptions,2)">
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
                    <el-tooltip
                      effect="dark"
                      placement="bottom-start"
                      :content="item.productName"
                      :disabled="!showToolTip(item.productName, 180)">
                      <span>{{item.productName}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="子产品名称:"
              prop="subProductCode">
              <el-tooltip
                placement="top-start"
                :content="getTooltipName(proInfoForm.subProductCode,subProductOptions,3)"
                :disabled="!getTooltipName(proInfoForm.subProductCode,subProductOptions,3)">
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
                    <el-tooltip
                      effect="dark"
                      placement="bottom-start"
                      :content="item.subProductName"
                      :disabled="!showToolTip(item.subProductName, 180)">
                      <span>{{item.subProductName}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
              </el-tooltip>
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
import groupAPI from '@/serve/API_groupPlanProject'
import API from '@/serve/API_project'
import { isShowToolTip } from '@/utils/common'
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
        timeYear: [{ required: true, message: '请选择产品树年份', trigger: ['blur'] }],
        productLineCode: [{ required: true, message: '请选择产品线', trigger: ['blur'] }],
        productCode: [{ required: true, message: '请选择产品', trigger: ['blur'] }],
        subProductCode: [{ required: true, message: '请选择子产品', trigger: ['blur'] }]
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
    productLineOption: { type: Array, default: null },
    productOption: { type: Array, default: null },
    subProductOption: { type: Array, default: null },
    projectCode: { type: String, default: '' }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.proInfoForm = JSON.parse(JSON.stringify(val))
          // this.changeYear(JSON.parse(JSON.stringify(val)).timeYear)
          // this.changeProductLine(JSON.parse(JSON.stringify(val)).productLineCode)
          // this.changeProduct(JSON.parse(JSON.stringify(val)).productCode)
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
    },
    dialogType: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val === 'edit') {
          this.productLineOptions = this.productLineOption
          this.productOptions = this.productOption
          this.subProductOptions = this.subProductOption
        }
      }
    }
  },
  methods: {
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
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
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
    //输入框添加浮显
    getTooltipName (item, list, type) {
      let toolTipName = ''
      if (type === 1) {
        list.some((iitem) => {
          if (iitem.productLineCode === item) {
            toolTipName = iitem.productLineName
          }
        })
      } else if (type === 2) {
        list.some((iitem) => {
          if (iitem.productCode === item) {
            toolTipName = iitem.productName
          }
        })
      } else if (type === 3) {
        list.some((iitem) => {
          if (iitem.subProductCode === item) {
            toolTipName = iitem.subProductName
          }
        })
      }
      return toolTipName
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
      if (val) {
        this.proInfoForm.productLineCode = ''
        this.proInfoForm.productCode = ''
        this.proInfoForm.subProductCode = ''
        this.productLineOptions = []
        this.productOptions = []
        this.subProductOptions = []
        this.getProductInfo('1')
      } else {
        this.proInfoForm.productLineCode = ''
        this.proInfoForm.productCode = ''
        this.proInfoForm.subProductCode = ''
        this.productLineOptions = []
        this.productOptions = []
        this.subProductOptions = []
      }
    },
    //产品线变化
    changeProductLine (val) {
      if (val) {
        this.proInfoForm.productCode = ''
        this.proInfoForm.subProductCode = ''
        this.productOptions = []
        this.subProductOptions = []
        this.getProductInfo('2', val)
      } else {
        this.proInfoForm.productCode = ''
        this.proInfoForm.subProductCode = ''
        this.productOptions = []
        this.subProductOptions = []
      }
    },
    //产品变化
    changeProduct (val) {
      if (val) {
        this.proInfoForm.subProductCode = ''
        this.subProductOptions = []
        this.getProductInfo('3', val)
      } else {
        this.proInfoForm.subProductCode = ''
        this.subProductOptions = []
      }
    },
    //子产品变化
    changeSubProduct () {
    },
    //获取产品信息
    getProductInfo (type, code = '') {
      let params = {
        timeYear: this.proInfoForm.timeYear,
        productType: type, //(1:产品线，2：产品，3：子产品)
        productCode: code,
        state: '1' //1启用
      }
      groupAPI.queryProductInfoByCondition(params)
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
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-select-dropdown__item span {
  display: inline-block;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
