<!-- 编辑无数据默认组件 JSON.stringify(projectAttribute) == '{}' && $route.params.projectCode -->
<template>
  <div class="basic-info">
    <project-panel title="属性信息" :tips="true" :tip-language="language">
      <template v-slot:header>
        <!-- <el-button class="normal-btn" @click="changeClass('red')" v-if="projectCodeIn">改变class</el-button> -->
        <el-button
          class="normal-btn"
          @click="saveBasicInfo"
          v-if="projectCode&&!meberEditFlag">保存本区块信息</el-button>
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
import API from '@/serve/API_groupPlanProject'
import projectAPI from '@/serve/API_project'
import * as formRules from './formRules'
export default {
  components: {
    projectPanel
  },
  data () {
    return {
      meberEditFlag: false,
      isShow: 'add',
      obj: {},
      formRules: [],
      id: '', //如果多次暂存，则需要带入id
      receiveDataCopy: '', //暂存基本信息数据
      projectCategory: '', //项目类型，承担单位项目（PC-UNDERTAKE-UNIT），非一般支撑包和一般支撑包（PC-DEMAND-UNIT）
      language: '属性信息中没有基线字段；'
    }
  },
  props: {
    projectCode: String,
    receiveData: {
      type: Object,
      default: () => {}
    },
    // 团队信息
    projectCompanyList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    receiveData (value) {
      let valueCopy = JSON.parse(JSON.stringify(value))
      if (valueCopy.businessFormUrl) {
        delete valueCopy.businessFormUrl
      }
      // 项目类型
      this.projectCategory = value.projectCategory
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
          businessObject: 'BO-OVERALL'
        }
        projectAPI.editFormList(this.obj)
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
      let intervalFormProject = setInterval(() => {
        let cruxArr = ['IC_B', 'IC_E', 'IC_F', 'IC_G']
        let blockDtos = this.$refs.formProjectAdd.list.blockDtos || []
        if (blockDtos.length) {
          clearInterval(intervalFormProject)
          let meberEditFlag = this.$route.query.meberEditFlag === 'true'
          blockDtos.forEach((item, index) => {
            item.fieldList.forEach((item1, index1) => {
              if (meberEditFlag) {
                item1.isReadonly = '1'
              }
              if (item1.fieldKey === 'accountingSubject') { //核算主体 只有草稿状态可编辑
                this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isReadonly = (value.projectDetailsStatus && value.projectDetailsStatus === '0') ? '0' : '1'
              }
            })
          })
          // IC_A - 应用基础研究
          // IC_B - 关键核心技术攻关
          // IC_C - 产品开发及现网支撑-总部项目
          // IC_D - 产品开发及现网支撑-自立项目
          if (value.projectClass === 'IC_A') {
            blockDtos.forEach((item, index) => {
              item.fieldList.forEach((item1, index1) => {
                if (item1.fieldKey === 'basicsResearchField') {
                // 项目类别=应用基础研究时显示
                // 所属应用基础研究领域
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isVisible = '0'
                } else if (item1.fieldKey === 'purposeAndSignificance') {
                // 研究目的及意义
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isVisible = '0'
                } else if (item1.fieldKey === 'inlandResearchStatusAndAnalysis') {
                // 国内外研究现状及分析
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isVisible = '0'
                } else if (item1.fieldKey === 'whetherStrategicInvestment') {
                // 是否战略投入
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].defaultValue = 'ISI_01'
                }
              })
            })
          } else if (cruxArr.indexOf(this.receiveData.projectClass) !== -1) {
            blockDtos.forEach((item, index) => {
              item.fieldList.forEach((item1, index1) => {
                if (item1.fieldKey === 'keyResearchField_A' || item1.fieldKey === 'keyResearchField_B' || item1.fieldKey === 'keyResearchField_C') {
                // 项目类别=关键核心技术攻关时显示
                // 所属关键技术领域
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isVisible = '0'
                } else if (item1.fieldKey === 'projectPrincipal') {
                // 项目负责人
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isVisible = '0'
                } else if (item1.fieldKey === 'responsibleLeader') {
                // 责任领导
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isVisible = '0'
                } else if (item1.fieldKey === 'responsibleExpert') {
                // 项目责任专家
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isVisible = '0'
                } else if (item1.fieldKey === 'adviserMember') {
                // 指导组成员
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].isVisible = '0'
                } else if (item1.fieldKey === 'whetherStrategicInvestment') {
                // 是否战略投入
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].defaultValue = 'ISI_01'
                }
              })
            })
          } else if (value.projectClass === 'IC_C') {
            blockDtos.forEach((item, index) => {
              item.fieldList.forEach((item1, index1) => {
                if (item1.fieldKey === 'whetherStrategicInvestment') {
                // 关键核心技术攻关，应用基础研究默认是；产品开发及现网支撑：否；
                // 是否战略投入
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].defaultValue = 'ISI_02'
                }
              })
            })
          } else if (value.projectClass === 'IC_D') {
            blockDtos.forEach((item, index) => {
              item.fieldList.forEach((item1, index1) => {
                if (item1.fieldKey === 'whetherStrategicInvestment') {
                // 关键核心技术攻关，应用基础研究默认是；产品开发及现网支撑：否；
                // 是否战略投入
                  this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].defaultValue = 'ISI_02'
                }
              })
            })
          }
        }
      }, 1000)
    },
    // 项目负责人根据团队信息牵头需求单位而来
    projectCompanyList (value) {
      if (value && value.length) {
        let tempList = JSON.parse(JSON.stringify(value))
        if (tempList && tempList.length > 1) {
          let organizationCode
          tempList.forEach((item, index) => {
            if (item.type === '2' && item.leaderFlag === '1') {
              organizationCode = item.organizationCode
            }
          })
          let intervaCompanyList = setInterval(() => {
            let blockDtos = this.$refs.formProjectAdd.list.blockDtos || []
            if (blockDtos.length) {
              clearInterval(intervaCompanyList)
              blockDtos.forEach((item, index) => {
                item.fieldList.forEach((item1, index1) => {
                  if (item1.fieldKey === 'projectPrincipal') {
                    let attrs
                    attrs = JSON.parse(this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].attrs)
                    attrs.type = 'orgScope'
                    attrs.orgScopeCode = organizationCode
                    this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].attrs = JSON.stringify(attrs)
                  } else if (item1.fieldKey === 'responsibleLeader') {
                    let attrs
                    attrs = JSON.parse(this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].attrs)
                    attrs.type = 'orgScope'
                    attrs.orgScopeCode = organizationCode
                    this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].attrs = JSON.stringify(attrs)
                  }
                })
              })
            }
          }, 1000)
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
      // 一般支撑包，非一般支撑包。承担单位项目暂存的接口不一样
      let editUrl
      if (this.projectCategory === 'PC-UNDERTAKE-UNIT') {
        editUrl = 'editGroupUnderProjectAttributeUrl'
      } else {
        editUrl = 'editProjectAttributeUrl'
      }
      // obj.projectCode = 'R2000134'
      obj.projectCode = this.projectCode
      obj.id = this.id || ''
      API[editUrl](obj)
        .then(data => {
          this.$message({
            type: 'success',
            message: '属性信息保存成功',
            showClose: true
          })
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
      this.$emit('changeAttribute', { key: key, value: value })
      if (key === 'internalDemandUnitRd') {
        let blockDtos = this.$refs.formProjectAdd.list.blockDtos || []
        blockDtos.forEach((item, index) => {
          item.fieldList.forEach((item1, index1) => {
            if (item1.fieldKey === 'internalDemandUnitRdManager') {
              let attrs
              attrs = JSON.parse(this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].attrs)
              attrs.orgScopeCode = value
              this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].attrs = JSON.stringify(attrs)
              this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].defaultValue = ''
              this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].previewName = ''
            }
          })
        })
      }
      // 牵头承担部门和配合承担部门不能重复
      if (key === 'leadResponsibleDept' && value) {
        let blockDtos = this.$refs.formProjectAdd.list.blockDtos || []
        blockDtos.forEach((item, index) => {
          item.fieldList.forEach((item1, index1) => {
            if (item1.fieldKey === 'cooperateResponsibleDept') {
              this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].disabledList = JSON.stringify([JSON.parse(value).orgCode])
            }
          })
        })
      }
      if (key === 'cooperateResponsibleDept' && value) {
        let blockDtos = this.$refs.formProjectAdd.list.blockDtos || []
        blockDtos.forEach((item, index) => {
          item.fieldList.forEach((item1, index1) => {
            if (item1.fieldKey === 'leadResponsibleDept') {
              this.$refs.formProjectAdd.list.blockDtos[index].fieldList[index1].disabledList = value
            }
          })
        })
      }
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
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
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
.basic-info .red .el-form-item__content {
  color: red;
}
</style>
