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
            businessObject: 'BO_PROJECT',
            schemeId: value.schemeId,
            schemeJson: value.extendedAttributes
          }
        }
      }
    }
  },
  methods: {
    changeClass (classType, keys) {
      let blockDtos = this.$refs.formProjectPreview.list.blockDtos
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
