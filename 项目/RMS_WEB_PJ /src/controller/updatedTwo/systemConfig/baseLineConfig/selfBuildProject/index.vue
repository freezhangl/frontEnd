<template>
  <!-- 自立项目 -->
  <div class="wrapper">
    <!-- 按钮 -->
    <div class="top-button-wrapper">
      <div class="top-button-wrapper-outer">
        <el-button
          class="editor"
          icon="el-icon-edit"
          v-if="!isEdit"
          @click="isEdit = true">
          <!-- 字体图标的使用未定 -->
          <!-- <img src="./assets/编辑.svg" alt=""> -->
          编辑
        </el-button>
        <el-button class="save iconfont icon-baocun" v-if="isEdit" @click="save">
          <!-- <img src="./assets/保存.svg" alt=""> -->
          保存
        </el-button>
      </div>
    </div>
    <!-- 信息内容 -->
    <div class="module-wrapper">
      <div class="module-outer" v-for="(item,index) of checkData" :key="index">
        <template v-if="item.type === 'optionList'">
          <div class="module-title">
            <span class="module-title-text">{{item.cname}}</span>
          </div>
          <div class="module-option">
            <el-checkbox-group
              :disabled="!isEdit"
              v-model="item.checkList"
              @change="changeOption({cname:item.cname,type:item.type,checkList:item.checkList})">
              <el-checkbox
                v-for="(checkItem,checkIndex) of item.conList"
                :key="checkIndex"
                :label="checkItem.cname">
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </template>
        <template v-if="item.type === 'notConfig'">
          <div class="module-title">
            <span class="module-title-text">{{item.cname}}</span>
            <span>{{item.causeTxt || '（此处不配置，动态表单模块配置）'}}</span>
          </div>
        </template>
        <template v-if="item.type === 'optionTitle'">
          <div class="module-title">
            <el-checkbox
              :disabled="!isEdit"
              v-model="item.value"
              @change="changeOption({cname:item.cname,type:item.type,value:item.value})">{{item.cname}}</el-checkbox>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import data from './data.js'
import API from '@/serve/API_groupPlan'
export default {
  data () {
    return {
      isEdit: false,
      checkData: data.obj,
      dataId: null
    }
  },
  created () {
    this.getCheckboxMsg()
  },
  methods: {
    // 选择框值改变时触发
    changeOption (checkObj) {
    },
    // 获取多选框选择信息
    getCheckboxMsg () {
      // 初始化获取 如果数据库没有，默认使用data.js数据
      API.baseLineGetOption({ projectType: 'PC-SELF-UNIT' })
        .then(res => {
          // 加个判断 有无数据
          if (res && res.content && res.content.length) {
            this.checkData = JSON.parse(res.content)
            this.checkData.forEach((item, index) => {
              if (item.type === 'optionList') {
                let itemChecked = []
                item.conList.map((iitem) => {
                  if (item.checkList.includes(iitem.name)) {
                    itemChecked.push(iitem.cname)
                  }
                })
                item.checkList = itemChecked
              }
              if (item.type === 'optionTitle' && item.name === 'projectAchievementList') {
                item.cname = '子项目信息'
              }
            })
            this.dataId = res.id
          }
        })
        .catch(e => {
          this.isEdit = false
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 保存
    save () {
      if (!this.isEdit) return
      this.$confirm('基线信息变更影响全集团所有在途项目，请确认是否变更', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'self-build-project'
      })
        .then(response => {
          this.checkData.forEach((item, index) => {
            if (item.type === 'optionList') {
              let itemChecked = []
              item.conList.map((iitem) => {
                if (item.checkList.includes(iitem.cname)) {
                  itemChecked.push(iitem.name)
                }
              })
              item.checkList = itemChecked
            }
          })
          // 保存接口 projectType为后端提供的固定值
          API.baseLineSaveOption({ content: JSON.stringify(this.checkData), projectType: 'PC-SELF-UNIT' })
            .then(res => {
              this.isEdit = false
              this.getCheckboxMsg()
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
            })
            .catch(e => {
              this.loading = false
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '...失败，请稍后重试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        })
        .catch(() => {
        })
    }
  }
}
</script>
<style lang="scss">
.self-build-project{
  .el-button.el-button--primary:hover{
    @include background-color();
  }
}
</style>
<style lang='scss' scoped src="../scss/style.scss">
</style>
