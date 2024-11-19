<template>
  <div class="basic-info">
    <project-panel title="属性信息">
      <template v-slot:header>
        <!-- <el-button class="normal-btn" @click="changeClass('red')" v-if="projectCodeIn">改变class</el-button> -->
        <el-button class="normal-btn" @click="saveBasicInfo" v-if="projectCode">保存本区块信息</el-button>
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
      id: '', //如果多次暂存，则需要带入id
      receiveDataCopy: '' //暂存基本信息数据
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
    receiveData (value) {
      let valueCopy = JSON.parse(JSON.stringify(value))
      if (valueCopy.businessFormUrl) {
        delete valueCopy.businessFormUrl
      }
      let param = JSON.stringify(value)
        .replace(/"/g, '')
        .replace(/:/g, '=')
        .replace(/\{/g, '')
        .replace(/\}/g, '')
      // 判断基本信息数据有没有变化
      if (this.receiveDataCopy === JSON.stringify(valueCopy)) {
        this.obj = {}
      } else {
        this.receiveDataCopy = JSON.stringify(valueCopy)
        this.obj = {
          parameters: param,
          companyCode: this.$store.getters['USERENTITY/userInfo'].userAuth.companyCode,
          businessObject: 'BO_PROJECT'
        }
      }
    }
  },
  methods: {
    saveBasicInfo () {
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
      obj.projectCode = this.projectCode
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
          this.$emit('saveAttribute')
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
      if (key === 'internalProjectCode' && value) {
        // R2000090
        API.queryEffectiveProjectBaseInfoUrl({
          projectCode: value
        })
          .then(res => {
            let arr = [{
              key: 'internalDemandUnit',
              value: res && res.companyCode ? JSON.stringify(res.companyCode.split('，')) : ''
            }, {
              key: 'internalProjectManager',
              value: res && res.projectManagerName ? res.projectManagerName : ''
            }, {
              key: 'internalProjectName',
              value: res && res.projectName ? res.projectName : ''
            }]
            this.$refs.formProjectAdd.changeKeyValue(arr)
          })
          .catch(err => {
            this.$message.error(err.message || '获取项目编码失败')
          })
      } else if (key === 'demandsSources' && value) {
        API.hasAdditionalDeductionUrl({
          projectCode: this.projectCode,
          demandsSources: value
        })
          .then(res => {
            let arr = [{
              key: 'additionalDeduction',
              value: JSON.stringify(res)
            }]
            this.$refs.formProjectAdd.changeKeyValue(arr)
          })
          .catch(err => {
            this.$message.error(err.message || '获取项目编码失败')
          })
      }
      this.$emit('changeAttribute', { key: key, value: value })
    },
    //校验必填项并取值
    validate () {
      let info = this.$refs.formProjectAdd.getInfo()
      if (info) {
        let obj = JSON.parse(info)
        obj.projectCode = this.projectCode
        obj.id = this.id
        return obj
      }
      return false
    }
  },
  mounted () {
    this.formRules = formRules.formRules
    // this.obj = {
    //   parameters: 'needSource',
    //   companyCode: '',
    //   businessObject: 'BO_PROJECT'
    // }
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
