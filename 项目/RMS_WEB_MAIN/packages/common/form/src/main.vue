<!--表单组件 -->
<template>
  <section class="self-form">
    <el-form
      ref="selfFormCom"
      :rules="formRules"
      :model="formModel"
      :show-message="false"
      :inline="true"
      :label-width="labelWidth"
    >
      <div
        v-for="(row,index) in formConfig"
        :key="index"
        class="form-col"
      >
        <template v-if="row.rowConfig.length>0">
          <el-form-item
            class="order-form-item left-item"
            v-for="item in row.rowConfig"
            :key="item.prop"
            :prop="item.prop"
          >
            <template slot="label">
              <div class="order_form_label" :class="item.required?'required':null">{{item.label}}</div>
            </template>
            <div class="order_form_content">
              <!-- 输入框(文本) -->
              <el-input
                v-if="item.type === 'Input'"
                v-model="formModel[item.prop]"
                :disabled="item.isDisabled?item.isDisabled:null"
                :readonly="item.isReadonly?item.isReadonly:null"
                :placeholder="item.placeholder?item.placeholder:''"
                :maxlength="item.maxlen?item.maxlen:''"
                :clearable="item.clearable?item.clearable:''"
                @focus="item.focus && item.focus(formModel[item.prop])"
                @keyup.enter.native="item.enterHandle && item.enterHandle()">
                <i
                  v-if="item.icon"
                  class="el-input__icon"
                  :class="item.icon"
                  slot="suffix"
                  @click="item.iconClick && item.iconClick(formModel[item.prop])">
                </i>
              </el-input>
              <!-- 输入框(数值) -->
              <el-input
                v-if="item.type === 'Input.number'"
                type="number"
                v-model="formModel[item.prop]"
                :disabled="item.isDisabled?item.isDisabled:null"
                :readonly="item.isReadonly?item.isReadonly:null"
                :placeholder="item.placeholder?item.placeholder:''"
                :maxlength="item.maxlen?item.maxlen:''"
                :clearable="item.clearable?item.clearable:''"
                @focus="item.focus && item.focus(formModel[item.prop])"
                @keyup.enter.native="!item.icon && item.enterHandle && item.enterHandle()">
                <i
                  v-if="item.icon"
                  class="el-input__icon"
                  :class="item.icon"
                  slot="suffix"
                  @click="item.iconClick && item.iconClick(formModel[item.prop])">
                </i>
              </el-input>
              <!-- 下拉选择框 -->
              <el-select
                v-if="item.type === 'Select'"
                :disabled="item.isDisabled?item.isDisabled:null"
                :readonly="item.isReadonly?item.isReadonly:null"
                v-model="formModel[item.prop]"
                :placeholder="item.placeholder?item.placeholder:''"
                :clearable="item.clearable?item.clearable:''"
                @change="item.handleChange && item.handleChange(formModel[item.prop],item.opList)"
              >
                <el-option
                  v-for="(op,index) in item.opList"
                  :key="index"
                  :label="op[item.props.label]"
                  :value="op[item.props.value]"
                ></el-option>
              </el-select>
              <!-- 地区级联选择器 -->
              <template v-if="item.type === 'Region'">
                <div class="selectThree">
                  <el-select
                    v-for="(elVal,index) in item.selectConfig"
                    :key="index"
                    v-model="formModel[elVal.prop]"
                    :disabled="item.isDisabled?item.isDisabled:null"
                    :readonly="elVal.isReadonly?elVal.isReadonly:null"
                    @change="elVal.handleChange && elVal.handleChange(curVal)"
                    :placeholder="elVal.placeholder?elVal.placeholder:''"
                  >
                    <el-option
                      v-for="op in elVal.opList"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    ></el-option>
                  </el-select>
                </div>
              </template>
              <!-- 日期时间选择器 dateTimePicker -->
              <el-date-picker
                v-if="item.type === 'DateTimePicker'"
                :disabled="item.isDisabled?item.isDisabled:null"
                :readonly="item.isReadonly?item.isReadonly:null"
                v-model="formModel[item.prop]"
                :placeholder="item.placeholder?item.placeholder:''"
                :clearable="item.clearable?item.clearable:''"
                @change="item.handleChange && item.handleChange(formModel[item.prop],item.opList)"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <!-- TODO:  多行文本区 textArea -->
              <!-- TODO:  纯文本显示 text-->
              <!-- 按钮 -->
              <span v-if="item.type === 'Button'">
                <template v-for="btn in item.btnList">
                  <el-button
                    v-if="btn"
                    :key="btn.id"
                    :disabled="btn.isDisabled?btn.isDisabled:null"
                    :type="btn.type"
                    :size="btn.size || 'mini'"
                    :icon="btn.icon"
                    @click="btn.handle()"
                  >{{ btn.label }}</el-button>
                </template>
              </span>
            </div>
          </el-form-item>
        </template>
      </div>
    </el-form>
  </section>
</template>

<script>
export default {
  name: 'selfForm',
  props: {
    // 表单校验规则集 默认为null
    formRules: { type: Object, default: () => null },
    // 表单绑定的数据
    formModel: { type: Object, default: () => null },
    //表单的配置信息
    formConfig: { type: Array, default: () => [] },
    //label宽度
    labelWidth: { type: String, default: '80px' }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    //表单校验
    checkForm () {
      return this.$refs['selfFormCom'].validate()
    },
    //编辑表单的配置信息
    editFormConfig (id, rowIndex, propName, config) {
      if (id !== undefined && rowIndex !== undefined && propName !== undefined && config !== undefined) {
        this.formConfig.forEach(row => {
          if (row.id === id) {
            row['rowConfig'][rowIndex][propName] = config
          }
        })
      } else {
        // console.warn('[selfform]参数不全,入参为（待修改的对象ID，rowConfig的索引值，待修改的属性名称，设定值）')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.self-form {
  padding-bottom: 10px;
  .form-col{
    /deep/ .order-form-item{
      border: none;
    }
  }
  .el-form-item{
    margin-bottom: 0;
    width: 25%;
    max-width: 300px;
    border: none;
    // float: left;
    display: flex;
  }
  /deep/ .el-form-item__label{
    white-space: nowrap;
    .order_form_label{
      background: none;
      border: none;
    }
  }
  .order_form_content {
    /deep/ .el-form-item__content{
      line-height: 28px;
      min-width: 100px;
      max-width: 260px;
      width: 90%;
    }
    /deep/ .el-input__inner {
      height: 30px;
      margin: 5px 0;
    }
    /deep/ .el-select {
      width: 100%;
    }
  }
  .order-form-item.is-required {
    /deep/ .el-form-item__label:before {
      content: none;
    }
  }
  .required::before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  .selectThree {
    /deep/ .el-select {
      width: 32%;
      padding-left: 1%;
    }
  }
  .remark-view {
    height: 64px;
    overflow: auto;
    line-height: 20px;
    .remark-view-vertical {
      display: table-cell;
      vertical-align: middle;
      height: 64px;
    }
  }
}
</style>
