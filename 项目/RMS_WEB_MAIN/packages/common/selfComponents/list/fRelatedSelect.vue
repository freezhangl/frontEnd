<!--
级联选择组件
<component
  :is="fRelatedSelect" // fRelatedSelect级联选择
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
例：在字段中配置
动物-昆虫-蚂蚁
动物-昆虫-蝴蝶
植物-木本-松树

props.attrs后端返回的数据格式
例：["动物-昆虫-蚂蚁","动物-昆虫-蝴蝶","植物-木本-松树"]
-->
<template>
  <div :class="props.isClass">
    <el-form-item
      :label="props.fieldTitle+':'"
      :class="props.isRequire === '1' && status !== 'result'?'is-required':''"
      :prop="`item${props.fieldKey}`"
      :rules="[
        { validator: validator, trigger: 'change' }
      ]"
    >
      <span slot="label" v-html="props.fieldTitle+':'" ref="con"></span>
      <el-tooltip
        class="item"
        effect="dark"
        v-if="status !== 'result'"
        :disabled="value.length?false:true"
        :content="value.join(' / ')"
        placement="top">
        <el-cascader
          @change="update"
          :disabled="props.isReadonly === '1'"
          :options="option"
          v-model="value"
          popper-class="move-form-cascader"
          style="width:100%"
        >
        </el-cascader>
      </el-tooltip>
      <span v-else>{{props.previewName}}</span>
      <el-tooltip v-if="status !== 'result' && props.msg" :content="props.msg" placement="top">
        <i class="el-icon-info fill-in-tips"></i>
      </el-tooltip>
    </el-form-item>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: this.data && this.status === 'result' ? this.data : this.data && this.status !== 'result' ? JSON.parse(this.data) : this.status !== 'result' ? [] : '',
      option: []
    }
  },
  props: {
    props: Object,
    data: String,
    status: String
  },
  mounted () {
    this.option = this.treeData(JSON.parse(this.props.attrs))
    this.getPreviewName(this.value)
  },
  watch: {
    'props.fieldTitle': {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.$nextTick(() => {
            let con = this.$refs.con
            if (con.offsetHeight > 16) {
              con.parentElement.style.lineHeight = '20px'
            }
          })
        }
      }
    }
  },
  methods: {
    listToTree (srcList) {
      let destList = []
      srcList.forEach(path => {
        let pathList = path.split('-')
        let levelList = destList
        for (let name of pathList) {
          let obj = levelList.find(item => item.name === name)
          if (!obj) {
            obj = { name, children: [] }
            levelList.push(obj)
          }
          levelList = obj.children
        }
      })
      return destList
    },
    treeData (data) {
      var newData = []; var hash = {}
      for (let i = 0; i < data.length; i++) {
        if (!hash[data[i].split('-')[0]]) {
          hash[data[i].split('-')[0]] = {
            'label': data[i].split('-')[0],
            'value': data[i].split('-')[0]
          }
          if (data[i].split('-')[1]) {
            hash[data[i].split('-')[0]]['children'] = [{
              'label': data[i].split('-')[1],
              'value': data[i].split('-')[1]
            }]
          }
          if (data[i].split('-')[2]) {
            for (let j = 0; j < hash[data[i].split('-')[0]].children.length; j++) {
              hash[data[i].split('-')[0]].children[j]['children'] = [{
                'label': data[i].split('-')[2],
                'value': data[i].split('-')[2]
              }]
            }
          }
          newData.push(hash[data[i].split('-')[0]])
        } else {
          try {
            for (let k = 0; k < hash[data[i].split('-')[0]].children.length; k++) {
              if (hash[data[i].split('-')[0]].label === data[i].split('-')[0] &&
                hash[data[i].split('-')[0]].children[k].label === data[i].split('-')[1]) {
                hash[data[i].split('-')[0]].children[k]['children'].push({
                  'label': data[i].split('-')[2],
                  'value': data[i].split('-')[2]
                })
                throw new Error()
              }
            }
            if (hash[data[i].split('-')[0]].label === data[i].split('-')[0]) {
              hash[data[i].split('-')[0]]['children'].push({
                'label': data[i].split('-')[1],
                'value': data[i].split('-')[1],
                'children': [{
                  'label': data[i].split('-')[2],
                  'value': data[i].split('-')[2]
                }]
              })
              // // 支持3级，2级 混搭
              // let obj = {}
              // if (data[i].split('-')[1]) {
              //   obj.label = data[i].split('-')[1]
              //   obj.value = data[i].split('-')[1]
              // }
              // if (data[i].split('-')[2]) {
              //   obj.children = [{
              //     'label': data[i].split('-')[2],
              //     'value': data[i].split('-')[2]
              //   }]
              // }
              // hash[data[i].split('-')[0]]['children'].push(obj)
            }
          } catch (error) {
            // console.log(error)
          }
        }
      }
      return newData
    },
    getList () {
      let option = []
      // ["动物-昆虫-蚂蚁","动物-昆虫-蝴蝶","动物-昆虫-蜻蜓","植物-木本-松树","植物-草本-车前草"]
      for (let i = 0; i < JSON.parse(this.props.attrsDto).length; i++) {
        if (!option[0]) {
          option.push({
            value: JSON.parse(this.props.attrsDto)[i].split('-')[0],
            label: JSON.parse(this.props.attrsDto)[i].split('-')[0],
            children: [{
              value: JSON.parse(this.props.attrsDto)[i].split('-')[1],
              label: JSON.parse(this.props.attrsDto)[i].split('-')[1]
            }]
          })
          if (JSON.parse(this.props.attrsDto)[i].split('-')[2]) {
            option[0].children[0].children = [{
              value: JSON.parse(this.props.attrsDto)[i].split('-')[2],
              label: JSON.parse(this.props.attrsDto)[i].split('-')[2]
            }]
          }
        } else {
          option.forEach((item, key) => {
            if (JSON.parse(this.props.attrsDto)[i].split('-')[0] === item.value) {
              option[key].children.forEach((items, keys) => {
                if (JSON.parse(this.props.attrsDto)[i].split('-')[1] === items.value) {
                  option[key].children[keys].children.push({
                    value: JSON.parse(this.props.attrsDto)[i].split('-')[2],
                    label: JSON.parse(this.props.attrsDto)[i].split('-')[2]
                  })
                } else {
                  if (keys === option[key].children.length - 1) {
                    option[key].children.push({
                      value: JSON.parse(this.props.attrsDto)[i].split('-')[1],
                      label: JSON.parse(this.props.attrsDto)[i].split('-')[1]
                    })
                    if (JSON.parse(this.props.attrsDto)[i].split('-')[2]) {
                      option[key].children[keys].children = [{
                        value: JSON.parse(this.props.attrsDto)[i].split('-')[2],
                        label: JSON.parse(this.props.attrsDto)[i].split('-')[2]
                      }]
                    }
                  }
                }
              })
            } else {
              if (key === option.length - 1) {
                option.push({
                  value: JSON.parse(this.props.attrsDto)[i].split('-')[0],
                  label: JSON.parse(this.props.attrsDto)[i].split('-')[0],
                  children: [{
                    value: JSON.parse(this.props.attrsDto)[i].split('-')[1],
                    label: JSON.parse(this.props.attrsDto)[i].split('-')[1]
                  }]
                })
                if (JSON.parse(this.props.attrsDto)[i].split('-')[2]) {
                  option[option.length - 1].children[0].children = [{
                    value: JSON.parse(this.props.attrsDto)[i].split('-')[2],
                    label: JSON.parse(this.props.attrsDto)[i].split('-')[2]
                  }]
                }
              }
            }
          })
        }
      }
      // this.option = option
    },
    validator (rule, value, callback) {
      if (this.props.isRequire === '1' && (!this.value.length)) {
        callback(new Error('请选择' + this.props.fieldTitle.replace('<br>', '')))
      } else {
        callback()
      }
    },
    update (v) {
      this.$emit('update:data', JSON.stringify(v))
      this.$emit('changeEvent', JSON.stringify(v))
      this.props.previewName = v.join('/')
    },
    getPreviewName (name) {
      this.props.previewName = name ? name.join('/') : ''
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-form-item {
    margin-bottom: 5px;
}
/deep/ .el-form-item__label {
  word-break: break-all;
}
// 填报说明提示
.fill-in-tips {
  position: absolute;
  top: 14px;
  right: -18px;
  @include color();
}
</style>
<style lang="scss">
.move-form-cascader {
  .el-cascader-node__label {
    max-width: 200px;
  }
}
</style>
