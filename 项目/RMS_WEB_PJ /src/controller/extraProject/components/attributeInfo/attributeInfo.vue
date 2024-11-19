<template>
  <div class="basic-info">
    <project-panel title="属性信息" :tips="true" :tip-language="language">
      <template v-slot:header>
        <!-- <el-button class="normal-btn" @click="changeClass('red')" v-if="projectCodeIn">改变class</el-button> -->
        <el-button class="normal-btn" @click="saveBasicInfo" v-if="projectCodeIn">保存本区块信息</el-button>
      </template>
      <formProjectAdd
        ref="formProjectAdd"
        :props="obj"
        :form-rules="formRules"
        @getValue="getValue"
        @changeEvent="changeEvent"></formProjectAdd>
    </project-panel>
  </div>
</template>

<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_project'
import * as formRules from './formRules'
export default {
  components: {
    projectPanel
  },
  data () {
    return {
      isShow: 'add',
      obj: {},
      formRules: [],
      userInfo: this.$store.getters['USERENTITY/userInfo'],
      projectCodeIn: '',
      id: '', //如果多次暂存，则需要带入id
      receiveDataCopy: '', //暂存基本信息数据
      language: '属性信息中没有基线字段；'
    }
  },
  props: {
    projectCode: String,
    receiveData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    projectCode (value) {
      this.projectCodeIn = value
    },
    receiveData (value) {
      let valueCopy = JSON.parse(JSON.stringify(value))
      if (valueCopy.businessFormUrl) {
        delete valueCopy.businessFormUrl
      }
      this.projectCodeIn = value.projectCode
      let param = JSON.stringify(value)
        .replace(/"/g, '')
        .replace(/:/g, '=')
        .replace(/\{/g, '')
        .replace(/\}/g, '')
      // this.projectCodeIn = 'R111111'
      // 判断基本信息数据有没有变化
      if (this.receiveDataCopy === JSON.stringify(valueCopy)) {
        this.obj = {}
      } else {
        this.receiveDataCopy = JSON.stringify(valueCopy)
        this.obj = {
          parameters: param,
          companyCode: this.userInfo.userAuth.companyCode,
          businessObject: 'BO_PROJECT'
        }
        API.editFormList(this.obj)
          .then(data => {
            let attribute = data.blockDtos[0].fieldList
            let add = []
            attribute.forEach(item => {
              if (item.isBaseline === '1') {
                add.push(item.fieldTitle)
              }
            })
            if (add.length) {
              if (add.length === attribute.length) {
                this.language = '属性信息中所有可编辑字段都是基线字段；'
                return
              }
              this.language = `属性信息中的基线字段：${add.join('、')}；`
            } else {
              this.language = '属性信息中没有基线字段；'
            }
          })
          .catch(err => {
            this.$message.error(err.message || '方案获取失败')
          })
      }
      let companyCode = this.$store.getters['USERENTITY/userInfo'].userAuth.companyCode
      setTimeout(() => {
        // 是否研发包选择“是”，是否加扣除则默认为“否
        if (value.developPackage === '1') {
          let blockDtos = this.$refs.formProjectAdd.list.blockDtos || []
          blockDtos.forEach((item, index) => {
            item.fieldList.forEach((item1, index1) => {
              if (item1.fieldKey === 'additionalDeduction') {
                let previewName
                item1.attrsDto.dictionaryDtoList.forEach((item, index) => {
                  if (item.valueCode === 'false') {
                    previewName = item.name
                  }
                })
                this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].defaultValue = 'false'
                this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].previewName = previewName
              }
            })
          })
        }
        let blockDtos = this.$refs.formProjectAdd.list.blockDtos || []
        let status = value.projectDetailsStatus !== null && value.projectDetailsStatus !== undefined ? value.projectDetailsStatus.toString() : ''
        blockDtos.forEach((item, index) => {
          item.fieldList.forEach((item1, index1) => {
            if (item1.fieldKey === 'accountingSubject') { //核算主体 只有草稿状态可编辑
              this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isReadonly = (status && status === '0') ? '0' : '1'
            }
            if (item1.fieldKey === 'additionalDeduction') { //是否加计扣除 只有草稿状态可编辑
              this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isReadonly = (status && status === '0') ? '0' : '1'
            }
          })
        })
      }, 2000)
    }
  },
  methods: {
    saveBasicInfo () {
      this.$emit('blurAllInput')
      this.$refs.formProjectAdd.saveBasicInfo()
    },
    changeClass (classType) {
      let blockDtos = this.$refs.formProjectAdd.list.blockDtos
      blockDtos.forEach((item, index) => {
        item.fieldList.forEach((item1, index1) => {
          this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isClass = classType
        })
      })
    },
    getValue (val) {
      let obj = JSON.parse(val)
      // obj.projectCode = 'R2000134'
      obj.projectCode = this.projectCodeIn
      obj.id = this.id || ''
      API.updateProjectAttributeUrl(obj)
        .then(data => {
          if (data === '0') {
            this.$message({
              type: 'success',
              message: '属性信息保存成功',
              showClose: true
            })
          } else {
            this.$message({
              type: 'success',
              message: '属性信息保存成功',
              showClose: true
            })
          }
          /* this.$message({
            type: 'success',
            message: '暂存成功',
            showClose: true
          }) */
          this.id = data
          this.$emit('saveAttribute', obj)
        })
        .catch(err => {
          this.$message.error(err.message || '项目获取失败')
        })

      // API.submitFormList({ 'schemeId': this.list.schemeDto.id, 'attrContent': JSON.stringify(params) })
      //   .then(data => {
      //     this.$message.success('操作成功')
      //     this.$emit('getId', data)
      //   })
      //   .catch(err => {
      //     this.$message.error(err.message || '项目获取失败')
      //   })
    },
    // 监听change事件
    changeEvent (key, value) {
      // 将方案ID传到父组件
      if (key === 'schemeDtoId') {
        this.$emit('changeAttribute', { key: 'schemeDtoId', value: value })
        return
      }
      if (key === 'internalProjectCode' && value) {
        // R2000090
        API.queryEffectiveProjectBaseInfoUrl({
          projectCode: value
        })
          .then(res => {
            if (!(res && res.companyName)) {
              this.$message.error('内部需求单位项目编码不存在')
            }
            let arr = [{
              key: 'internalProjectCode',
              value: res && res.companyName ? value : ''
            }, {
              key: 'internalDemandUnit',
              value: res && res.companyOrgCode ? JSON.stringify(res.companyOrgCode.split('，')) : ''
            }, {
              key: 'internalProjectManager',
              value: res && res.projectManagerName ? res.projectManagerName : ''
            }, {
              key: 'internalProjectName',
              value: res && res.projectName ? res.projectName : ''
            }]
            this.$refs.formProjectAdd.changeKeyValue(arr)
            this.isThen = '1'
          })
          .catch(err => {
            this.$message.error(err.message || '获取项目编码失败')
          })
          .finally(() => {
            // 错误判断走此方法
            if (!this.isThen) {
              let arr = [{
                key: 'internalProjectCode',
                value: ''
              }, {
                key: 'internalDemandUnit',
                value: ''
              }, {
                key: 'internalProjectManager',
                value: ''
              }, {
                key: 'internalProjectName',
                value: ''
              }]
              this.$refs.formProjectAdd.changeKeyValue(arr)
            } else {
              this.isThen = ''
            }
          })
      } else if (key === 'demandsSources' && value) {
        API.hasAdditionalDeductionUrl({
          projectCode: this.projectCodeIn,
          demandsSources: value
        })
          .then(res => {
            let arr
            if (value === 'NS_UEE') {
              // 如果需求来源是承接外部委托
              arr = [{
                key: 'additionalDeduction',
                value: JSON.stringify(res)
              }, {
                key: 'internalDemandUnit',
                value: ''
              }, {
                key: 'internalProjectManager',
                value: ''
              }, {
                key: 'internalProjectCode',
                value: ''
              }, {
                key: 'internalProjectName',
                value: ''
              }]
            } else if (value === 'NS_UIE') {
              // 如果需求来源是承接内部委托
              arr = [{
                key: 'additionalDeduction',
                value: JSON.stringify(res)
              }, {
                key: 'externalProjectUnit',
                value: ''
              }, {
                key: 'externalProject',
                value: ''
              }]
            } else {
              // 如果需求来源是其他
              arr = [{
                key: 'additionalDeduction',
                value: JSON.stringify(res)
              }, {
                key: 'internalDemandUnit',
                value: ''
              }, {
                key: 'internalProjectManager',
                value: ''
              }, {
                key: 'internalProjectCode',
                value: ''
              }, {
                key: 'internalProjectName',
                value: ''
              }, {
                key: 'externalProjectUnit',
                value: ''
              }, {
                key: 'externalProject',
                value: ''
              }]
            }
            this.$refs.formProjectAdd.changeKeyValue(arr)
          })
          .catch(err => {
            this.$message.error(err.message || '获取项目编码失败')
          })
      } else if (key === 'demandsSources') {
        // 需求来源
        let arr = [{
          key: 'internalDemandUnit',
          value: ''
        }, {
          key: 'internalProjectManager',
          value: ''
        }, {
          key: 'internalProjectCode',
          value: ''
        }, {
          key: 'internalProjectName',
          value: ''
        }, {
          key: 'externalProjectUnit',
          value: ''
        }, {
          key: 'externalProject',
          value: ''
        }]
        this.$refs.formProjectAdd.changeKeyValue(arr)
      } else if (key === 'devMode') {
        // 开展模式
        if (value === '["DM_A"]' || value === '' || value === '[]') {
          let arr = [{
            key: 'devUnit',
            value: ''
          }, {
            key: 'devProjectManager',
            value: ''
          }]
          this.$refs.formProjectAdd.changeKeyValue(arr)
        }
      }
      this.$emit('changeAttribute', { key: key, value: value })
    },
    //校验必填项并取值
    validate () {
      let info = this.$refs.formProjectAdd.getInfo()
      if (info) {
        let obj = JSON.parse(info)
        obj.projectCode = this.projectCodeIn
        obj.id = this.id
        return obj
      }
      return false
    }
  },
  mounted () {
    this.formRules = formRules.formRules
  }
}
</script>

<style  lang="scss" scoped>
.main-top {
  padding: 30px;
  text-align: center;
}
.main-container {
  width: 1180px;
  margin: 0 auto;
}
</style>
<style lang="scss">
.basic-info .red .el-form-item__label {
  color: red;
}
</style>
