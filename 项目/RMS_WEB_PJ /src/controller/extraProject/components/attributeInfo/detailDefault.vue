<template>
  <div class="basic-info">
    <project-panel title="属性信息" :show-expand="showExpand">
      <el-form
        :model="list"
        ref="dataForm"
        label-width="130px">
        <div class="project-panel" v-for="(item, index) in list.blockDtos" :key="index">
          <div class="is-expand">
            <div class="basic-body">
              <el-row style="display:flex;flex-wrap:wrap;">
                <template
                  v-for="(item1, index1) in item.fieldList">
                  <el-col
                    :span="item1.type === 'fTextarea' ? 24 : item1.column === '2' ? 16 : item1.column === '3' ? 24 : 8"
                    :key="index1"
                    v-if="item1.isVisible === '0'"
                  >
                    <component
                      :is="item1.type"
                      :props="item1"
                      :ref="`item${item1.fieldKey}`"
                      status="result"
                      :data.sync="item1.defaultValue"
                    ></component>
                  </el-col>

                </template>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
    </project-panel>
  </div>
</template>
<script>
import API from '@/serve/API_project'
import projectPanel from '@/controller/components/projectPanel'
export default {
  components: {
    projectPanel
  },
  data () {
    return {
      list: {},
      obj: {
        parameters: '',
        companyCode: this.$store.getters['USERENTITY/userInfo'].userAuth.companyCode,
        businessObject: 'BO_PROJECT'
      }
    }
  },
  props: {
    receiveData: Object,
    showExpand: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && JSON.stringify(val) !== '{}') {
          let param = JSON.stringify(val)
            .replace(/"/g, '')
            .replace(/:/g, '=')
            .replace(/\{/g, '')
            .replace(/\}/g, '')
          this.obj.parameters = param
          this.getFormList(val)
        }
      }
    }
  },
  methods: {
    // 获取表单结构
    getFormList (val) {
      // if (this.obj.parameters) {
      API.getFormList(this.obj)
        .then(data => {
          // 加入class参数
          data.blockDtos.forEach((item, index) => {
            data.blockDtos[index].fieldList.forEach((item1, index1) => {
              data.blockDtos[index].fieldList[index1].isClass = ''
            })
          })
          // 是否研发包选择“是”，是否加扣除则默认为“否
          if (val.developPackage === '1') {
            let blockDtos = data.blockDtos || []
            blockDtos.forEach((item, index) => {
              item.fieldList.forEach((item1, index1) => {
                if (item1.fieldKey === 'additionalDeduction') {
                  let previewName
                  item1.attrsDto.dictionaryDtoList.forEach((item, index) => {
                    if (item.valueCode === 'false') {
                      previewName = item.name
                    }
                  })
                  data.blockDtos[index].fieldList[index1].defaultValue = 'false'
                  data.blockDtos[index].fieldList[index1].previewName = previewName
                }
              })
            })
          }
          this.list = data
          this.listCopy = JSON.parse(JSON.stringify(this.list))
        })
        .catch(err => {
          this.$message.error(err.message || '方案获取失败')
        })
      // }
    }
  },
  mounted () {
  }
}
</script>
<style  lang="scss" scoped>
.basic-info{
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
    // overflow: hidden;
    overflow: inherit;
    height: 0;
    margin-bottom: 30px;
    &.is-expand{
      padding : 20px 30px;
      height: auto;
    }
  }
}
</style>
<style lang="scss">
.basic-info .red .el-form-item__content {
  color: #FF3F3B;
}
</style>
