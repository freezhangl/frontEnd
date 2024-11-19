<template>
  <div class="basic-info">
    <project-panel title="属性信息">
      <formProjectApprove
        :form-rules="formRules"
        :props="obj"></formProjectApprove>
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
    projectAttribute: Object
  },
  watch: {
    projectAttribute (value) {
      if (value) {
        this.obj = {
          schemeId: value.schemeId,
          schemeJson: value.extendedAttributes
        }
      }
    }
  },
  methods: {
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
