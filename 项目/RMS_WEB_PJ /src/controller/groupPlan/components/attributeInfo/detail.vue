<!-- 详情组件 -->
<template>
  <div class="basic-info">
    <project-panel title="属性信息" :show-expand="showExpand">
      <formProjectPreview
        ref="formProjectPreview"
        :form-rules="formRules"
        :props="obj"
        @formPreviewHasRendered="attriHasRendered"></formProjectPreview>
    </project-panel>
  </div>
</template>

<script>
import projectPanel from '@/controller/components/projectPanel'
import * as formRules from './formRules'
export default {
  components: {
    projectPanel
  },
  data () {
    return {
      obj: {},
      formRules: []
    }
  },
  props: {
    projectAttribute: Object,
    receiveData: {
      type: Object,
      default: () => {}
    },
    showExpand: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    projectAttribute: {
      deep: true,
      immediate: true,
      handler: function (value, oldVal) {
        if (value && value.schemeId) {
          let param = JSON.stringify(this.receiveData)
            .replace(/"/g, '')
            .replace(/:/g, '=')
            .replace(/\{/g, '')
            .replace(/\}/g, '')
          this.obj = {
            parameters: param,
            companyCode: this.$store.getters['USERENTITY/userInfo'].userAuth.companyCode,
            businessObject: 'BO-OVERALL',
            schemeId: value.schemeId,
            schemeJson: value.extendedAttributes
          }
          let intervalFormProject = setInterval(() => {
            let cruxArr = ['IC_B', 'IC_E', 'IC_F', 'IC_G']
            let blockDtos = this.$refs.formProjectPreview ? this.$refs.formProjectPreview.list.blockDtos || [] : []
            if (blockDtos.length) {
              clearInterval(intervalFormProject)
              // IC_A - 应用基础研究
              // IC_B - 关键核心技术攻关
              // IC_C - 产品开发及现网支撑-总部项目
              // IC_D - 产品开发及现网支撑-自立项目
              // IC_E - 关键核心技术攻关-智慧中台及关键能力
              // IC_F - 关键核心技术攻关-CHBN关键平台及终端
              // IC_G - 关键核心技术攻关-新基建
              if (this.receiveData.projectClass === 'IC_A') {
                blockDtos.forEach((item, index) => {
                  item.fieldList.forEach((item1, index1) => {
                    if (item1.fieldKey === 'basicsResearchField') {
                    // 项目类别=应用基础研究时显示
                    // 所属应用基础研究领域
                      this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1].isVisible = '0'
                    } else if (item1.fieldKey === 'purposeAndSignificance') {
                    // 研究目的及意义
                      this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1].isVisible = '0'
                    } else if (item1.fieldKey === 'inlandResearchStatusAndAnalysis') {
                    // 国内外研究现状及分析
                      this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1].isVisible = '0'
                    }
                  })
                })
              } else if (cruxArr.indexOf(this.receiveData.projectClass) !== -1) {
                blockDtos.forEach((item, index) => {
                  item.fieldList.forEach((item1, index1) => {
                    if (item1.fieldKey === 'keyResearchField_A' || item1.fieldKey === 'keyResearchField_B' || item1.fieldKey === 'keyResearchField_C') {
                    // 项目类别=关键核心技术攻关时显示
                    // 所属关键技术领域
                      this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1].isVisible = '0'
                    } else if (item1.fieldKey === 'projectPrincipal') {
                    // 项目负责人
                      this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1].isVisible = '0'
                    } else if (item1.fieldKey === 'responsibleLeader') {
                    // 责任领导
                      this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1].isVisible = '0'
                    } else if (item1.fieldKey === 'responsibleExpert') {
                    // 项目责任专家
                      this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1].isVisible = '0'
                    } else if (item1.fieldKey === 'adviserMember') {
                    // 指导组成员
                      this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1].isVisible = '0'
                    }
                  })
                })
              } else if (this.receiveData.projectClass === 'IC_C') {
                blockDtos.forEach((item, index) => {
                  item.fieldList.forEach((item1, index1) => {
                    if (item1.fieldKey === 'whetherStrategicInvestment') {
                    // 关键核心技术攻关，应用基础研究默认是；产品开发及现网支撑：否；
                    // 是否战略投入
                      this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1].defaultValue = 'ISI_02'
                    }
                  })
                })
              } else if (this.receiveData.projectClass === 'IC_D') {
                blockDtos.forEach((item, index) => {
                  item.fieldList.forEach((item1, index1) => {
                    if (item1.fieldKey === 'whetherStrategicInvestment') {
                    // 关键核心技术攻关，应用基础研究默认是；产品开发及现网支撑：否；
                    // 是否战略投入
                      this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1].defaultValue = 'ISI_02'
                    }
                  })
                })
              }
            }
          }, 1000)
          setTimeout(() => {
            clearInterval(intervalFormProject) //list为空的时候要清除定时器，不能一直调用！！！
          }, 10000)
        }
      }
    }
  },
  methods: {
    changeClass (classType, keys) {
      let blockDtos = this.$refs.formProjectPreview.list.blockDtos
      if (!blockDtos) return
      blockDtos.forEach((item, index) => {
        item.fieldList.forEach((item1, index1) => {
          // this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1].isClass = classType
          let hasKey = keys.some(key => key === item1.fieldKey)
          if (hasKey) {
            this.$set(this.$refs.formProjectPreview.list.blockDtos[index].fieldList[index1], 'isClass', classType)
          }
        })
      })
    },
    attriHasRendered () {
      this.$emit('formPreviewHasRendered')
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
.basic-info .red .el-form-item__content {
  color: #FF3F3B;
}
</style>
