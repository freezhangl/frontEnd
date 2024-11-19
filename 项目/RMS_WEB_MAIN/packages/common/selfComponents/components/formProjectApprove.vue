<template>
  <!--
  <component
    :is="item1.type" // 渲染哪个组件（17个表单组件中的哪个）
    :props="item1" // 组件信息
    :ref="`item${item1.fieldKey}`" // 组件元素
    status="from"
    :data.sync="item1.defaultValue" // 组件默认值
    @changeEvent="changeEvent(index)" // 组件事件回调
  ></component>

 -->
  <div class="basic-info">
    <el-form
      :model="list"
      ref="dataForm"
      label-width="130px">
      <div class="project-panel" v-for="(item, index) in list.blockDtos" :key="index">
        <!-- <header class="panel-header" v-if="item.blockTitle">
          <div class="header-title">{{item.blockTitle}}</div>
        </header> -->
        <!-- <div class="panel-body is-expand"> -->
        <div class="is-expand">
          <div class="basic-body">
            <el-row style="display:flex;flex-wrap:wrap;">
              <template
                v-for="(item1, index1) in item.fieldList">
                <el-col
                  :span="item1.type === 'fTextarea' && !item1.fieldWidth ? 24 : item1.fieldWidth ? item1.fieldWidth * 2 : 8"
                  :key="index1"
                  v-if="item1.isVisible === '0'"
                >
                  <component
                    :is="item1.type"
                    :props="item1"
                    :ref="`item${item1.fieldKey}`"
                    status="result"
                    :data.sync="item1.defaultValue"
                    @changeEvent="changeEvent($event, index, index1)"
                  ></component>
                </el-col>

              </template>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import API from '@lib/common/serve'
export default {
  data () {
    return {
      list: {},
      // 监听规则
      propsIn: {},
      formRulesIn: [],
      keys: []
    }
  },
  props: {
    props: Object,
    formRules: Array
  },
  watch: {
    props (value) {
      this.propsIn = value
      this.getFormList()
    },
    formRules (value) {
      this.formRulesIn = value
    }
  },
  computed: {},
  methods: {
    // 获取表单结构
    getFormList () {
      if (JSON.stringify(this.propsIn) !== '{}') {
        API.approveFormList(this.propsIn)
          .then(data => {
            this.list = data
            this.list.blockDtos.forEach((item, index) => {
              item.fieldList.forEach((item1, field) => {
                this.formRulesIn.forEach((itemIn, indexIn) => {
                  // 字符串和数组两种判断形式
                  if ((typeof (itemIn.value) === 'string' && itemIn.key === item1.fieldKey && itemIn.value === item1.value) || (itemIn.value instanceof Array && itemIn.key === item1.fieldKey && itemIn.value.includes(item1.value))) {
                    itemIn.attrs.forEach((itemIn1, indexIn1) => {
                      this.keys.push({ key: itemIn1.key, isRequire: itemIn1.attrs.isRequire, isReadonly: itemIn1.attrs.isReadonly, isVisible: itemIn1.attrs.isVisible })
                    })
                  }
                })
              })
            })
            this.list.blockDtos.forEach((item, index) => {
              item.fieldList.forEach((item1, field) => {
                this.keys.forEach((itemIn, indexIn) => {
                  if (itemIn.key === item1.fieldKey) {
                    item1.isVisible = itemIn.isVisible
                    item1.isRequire = itemIn.isRequire
                    item1.isReadonly = itemIn.isReadonly
                  }
                })
              })
            })
          })
          .catch(err => {
            this.$message.error(err.message || '方案获取失败')
          })
      }
    }
  }
}
</script>
<style  lang="scss" scoped>
.basic-info{
  width: 100%;
  .basic-body /deep/{
    .el-form-item .el-input__inner{
      width : 100%
    }
    .el-select{
      width:100%;
    }
    .el-date-editor{
      width:100%
    }
  }
}
.project-panel{
  background: #fff;
  .panel-header{
    box-sizing: border-box;
    display: flex;
    height: 50px;
    align-items: center;
    padding: 0 30px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom: 1px solid #f6f6f6;
    .header-title{
      flex : 1;
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #333333;
      text-align: left;
      font-weight: bold;
    }
    .el-button{
      margin-left: 10px;
    }
  }
  .panel-body{
    box-sizing: border-box;
    overflow: hidden;
    height: 0;
    margin-bottom: 30px;
    &.is-expand{
      padding : 20px 30px;
      height: auto;
    }
  }
}
</style>
