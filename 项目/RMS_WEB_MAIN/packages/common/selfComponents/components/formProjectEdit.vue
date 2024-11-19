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
                    status="from"
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
// import * as propEdit from '@/mock/propEdit'
export default {
  data () {
    return {
      list: {},
      listCopy: {},
      // 监听规则
      propsIn: {},
      keys: [],
      formRulesIn: [],
      valueData: '',
      orgScopeCode: '',
      schemeDtoIdIn: '', //方案ID
      status: ''
    }
  },
  props: {
    props: Object,
    formRules: Array,
    schemeDtoId: String
  },
  watch: {
    props (value) {
      this.propsIn = value
      this.getFormList()
    },
    formRules (value) {
      this.formRulesIn = value
    },
    schemeDtoId (value) {
      this.schemeDtoIdIn = value
    }
  },
  computed: {},
  methods: {
    /* 人员选择组件-监听attrs */
    changePeopleOptionsAttrs (value) {
      if (!(value && value.toString())) return
      this.orgScopeCode = value.toString()
      if (this.list.blockDtos && this.list.blockDtos.length) {
        this.list.blockDtos.forEach(item => {
          if (item.fieldList && item.fieldList.length) {
            item.fieldList.forEach((item1, index1) => {
              if (item1.type === 'fPeopleOptions') {
                let attrs = JSON.parse(item1.attrs)
                if (attrs.type && attrs.type === 'orgScope') {
                  attrs.orgScopeCode = value.toString()
                  item1.attrs = JSON.stringify(attrs)
                }
              }
            })
          }
        })
      }
    },
    // 获取表单结构
    getFormList () {
      // propEdit.label1.blockDtos.forEach((item, index) => {
      //   propEdit.label1.blockDtos[index].fieldList.forEach((item1, index1) => {
      //     propEdit.label1.blockDtos[index].fieldList[index1].isClass = ''
      //   })
      // })
      // this.list = propEdit.label1
      // this.listCopy = JSON.parse(JSON.stringify(this.list))
      if (JSON.stringify(this.propsIn) !== '{}') {
        API.editFormList(this.propsIn)
          .then(data => {
            // 判断方案ID是否和之前一样，并将方案ID传到父组件
            if (data.schemeDto.id === this.schemeDtoIdIn) {
              return
            }
            this.schemeDtoIdIn = data.schemeDto.id
            this.$emit('changeEvent', 'schemeDtoId', data.schemeDto.id)
            // 加入class参数
            this.listCopy = JSON.parse(JSON.stringify(data))
            data.blockDtos.forEach((item, index) => {
              item.fieldList.forEach((item1, index1) => {
                data.blockDtos[index].fieldList[index1].isClass = ''
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
            data.blockDtos.forEach((item, index) => {
              item.fieldList.forEach((item1, field) => {
                this.keys.forEach((itemIn, indexIn) => {
                  if (itemIn.key === item1.fieldKey) {
                    item1.isVisible = itemIn.isVisible
                    // item1.isRequire = itemIn.isRequire
                    // item1.isReadonly = itemIn.isReadonly
                  }
                })
              })
            })
            this.list = data
            this.changePeopleOptionsAttrs(this.orgScopeCode)
          })
          .catch(err => {
            this.$message.error(err.message || '方案获取失败')
          })
      }
    },
    getValue (isSave = true) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {}
          let arr = []
          this.list.blockDtos.forEach((item, index) => {
            arr[index] = {}
            arr[index].id = item.id
            arr[index].blockName = item.blockName
            arr[index].fieldList = []
            item.fieldList.forEach((item1, index1) => {
              if (item1.fieldKey === 'cooperateResponsibleDept' && item1.defaultValue === '[]') {
                //配合承担部门 多选为空时赋值空-解决对比bug
                item1.defaultValue = ''
              }
              arr[index].fieldList[index1] = {}
              arr[index].fieldList[index1].key = item1.fieldKey
              arr[index].fieldList[index1].defaultValue = item1.defaultValue
              if (item1.fieldKey === 'leadResponsibleDept') {
                if (item1.defaultValue && item1.defaultValue.indexOf('orgCode') !== -1) {
                  arr[index].fieldList[index1].defaultValue = item1.defaultValue ? JSON.parse(item1.defaultValue).orgCode : item1.defaultValue
                }
              }
              arr[index].fieldList[index1].value = arr[index].fieldList[index1].defaultValue
              arr[index].fieldList[index1].isBaseline = item1.isBaseline
              arr[index].fieldList[index1].fieldTitle = item1.fieldTitle
              arr[index].fieldList[index1].previewName = item1.previewName ? item1.previewName : ''
              if (arr[index].fieldList[index1].defaultValue === '') {
                arr[index].fieldList[index1].previewName = ''
              }
            })
          })
          params.schemeId = this.list.schemeDto.id
          params.extendedAttributes = JSON.stringify(arr)
          if (isSave) {
            this.$emit('getValue', JSON.stringify(params))
          } else {
            this.valueData = JSON.stringify(params)
          }
        } else {
          this.valueData = ''
        }
      })
    },
    // 保存
    saveBasicInfo () {
      this.getValue(true)
    },
    // 获取change事件，数据监听
    changeEvent (value, index, index1) {
      let fieldKey = this.list.blockDtos[index].fieldList[index1].fieldKey
      let defalutList = JSON.parse(JSON.stringify(this.listCopy))
      if (fieldKey === 'leadResponsibleDept') {
        this.list.blockDtos[index].fieldList.forEach(item => {
          if (item.fieldKey === 'belongUnit') {
            item.defaultValue = JSON.parse(value).companyName
            value = JSON.parse(value).orgCode
          }
        })
      }
      this.formRulesIn.forEach((itemIn, indexIn) => {
        // 字符串和数组两种判断形式
        if ((typeof (itemIn.value) === 'string' && itemIn.key === fieldKey && itemIn.value === value) || (itemIn.value instanceof Array && itemIn.key === fieldKey && itemIn.value.includes(value))) {
          itemIn.attrs.forEach((itemIn1, indexIn1) => {
            this.list.blockDtos[index].fieldList.forEach((itemIn2, indexIn2) => {
              if (itemIn2.fieldKey === itemIn1.key) {
                // this.list.blockDtos[index].fieldList[indexIn2].isRequire = itemIn1.attrs.isRequire
                // this.list.blockDtos[index].fieldList[indexIn2].isReadonly = itemIn1.attrs.isReadonly
                this.list.blockDtos[index].fieldList[indexIn2].isVisible = itemIn1.attrs.isVisible
              }
            })
          })
        } else if (itemIn.key === fieldKey) {
          itemIn.attrs.forEach((itemIn1, indexIn1) => {
            this.list.blockDtos[index].fieldList.forEach((itemIn2, indexIn2) => {
              if (itemIn2.fieldKey === itemIn1.key) {
                // this.list.blockDtos[index].fieldList[indexIn2].isRequire = defalutList.blockDtos[index].fieldList[indexIn2].isRequire
                this.list.blockDtos[index].fieldList[indexIn2].isReadonly = defalutList.blockDtos[index].fieldList[indexIn2].isReadonly
                this.list.blockDtos[index].fieldList[indexIn2].isVisible = defalutList.blockDtos[index].fieldList[indexIn2].isVisible
                this.list.blockDtos[index].fieldList[indexIn2].defaultValue = ''
                this.list.blockDtos[index].fieldList[indexIn2].previewName = ''
              }
            })
          })
        }
      })
      // 事件输出到外部
      this.$emit('changeEvent', fieldKey, value)
    },
    // 根据key，value改变list内部的值
    changeKeyValue (arr) {
      this.list.blockDtos.forEach((item, index) => {
        this.list.blockDtos[index].fieldList.forEach((item1, index1) => {
          arr.forEach((item2, index2) => {
            if (item1.fieldKey === item2.key) {
              this.list.blockDtos[index].fieldList[index1].defaultValue = item2.value
            }
          })
        })
      })
    },
    //获取表单数据
    getInfo () {
      this.getValue(false)
      return this.valueData //只校验并取值，不保存
    }
  },
  mounted () {
    // this.getFormList()
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
