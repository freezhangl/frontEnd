<template>
  <div class="editFunction">
    <el-dialog
      title="编辑常用功能"
      :visible.sync="showDialog"
      :before-close="beforeCloseDig"
      :close-on-click-modal="false">
      <div class="content-wrapper">
        <div class="moduleFunc">
          <div class="header">已选择<span>（拖拽已选图标调整排序，最多可选择9个）</span></div>
          <div class="content">
            <!-- 拖拽插件 -->
            <vuedraggable
              class="draggable-wrapper"
              v-model="selfCheckedFuncData"
              :group="{ name: 'selectedFunc', put: true }"
              @choose="chooseItem"
              @add="addItem2Checked">
              <!-- 过度效果 -->
              <transition-group>
                <div class="funcItem" v-for="func in selfCheckedFuncData" :key="func.resCode">
                  <!-- <img :src="getImgUrl(func.functionIcon)" alt=""> -->
                  <span class="funcIcon" :class="getImgUrl(func.icon)"></span>
                  <el-tooltip
                    v-if="func.showTooltip"
                    :content="func.resName"
                    placement="top"
                    effect="dark">
                    <p>{{func.resName}}</p>
                  </el-tooltip>
                  <p v-else>{{func.resName}}</p>
                </div>
              </transition-group>
            </vuedraggable>
          </div>
        </div>
        <div class="moduleFunc">
          <div class="header">可选择</div>
          <div class="content">
            <el-tabs v-model="activeParentRes" @tab-click="changeTab">
              <el-tab-pane v-for="(item,index) in selfCancheckedFuncData" :key="index" :label="item.resName">
                <el-scrollbar>
                  <vuedraggable
                    class="draggable-wrapper"
                    v-model="item.funcList"
                    :sort="false"
                    :group="{ name: 'selectedFunc', put: true }"
                    @choose="chooseItem"
                    @add="addItem2Unchecked">
                    <transition-group>
                      <div class="funcItem" v-for="func in item.funcList" :key="func.resCode">
                        <!-- <img :src="getImgUrl(func.functionIcon)" alt=""> -->
                        <span class="funcIcon" :class="getImgUrl(func.icon)"></span>
                        <el-tooltip
                          v-if="func.showTooltip"
                          :content="func.resName"
                          placement="top"
                          effect="dark">
                          <p>{{func.resName}}</p>
                        </el-tooltip>
                        <p v-else>{{func.resName}}</p>
                      </div>
                    </transition-group>
                  </vuedraggable>
                </el-scrollbar>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="closeDialog(false)">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import vuedraggable from 'vuedraggable'
import images from '@lib/home/assets/imgPath'
import API from '../../serve'
export default {
  name: 'editCommonFunc',
  components: { vuedraggable },
  data () {
    return {
      showDialog: true,
      activeParentRes: '',
      selfCheckedFuncData: this.checkedFuncData, //绑定值
      selfCancheckedFuncData: this.cancheckedFuncData, //绑定值
      beforeDragChecked: [],
      beforeDragCanChecked: []
    }
  },
  props: {
    checkedFuncData: {
      type: Array,
      default: () => []
    },
    cancheckedFuncData: {
      type: Array,
      default: () => []
    },
    //未排除已选的全部常用功能
    allCanCheckdFuncData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getImgUrl (icon) {
      if (icon) {
        let arr = icon.split('/')
        let img = images[arr[arr.length - 1]] || ''
        let imgName = icon.split('.svg')[0] || ''
        return 'svgfont-' + imgName
      }
    },
    changeTab (tab, event) {

    },
    //将要拖拽前的数据
    chooseItem (event) {
      this.beforeDragChecked = JSON.parse(JSON.stringify(this.selfCheckedFuncData))
      this.beforeDragCanChecked = JSON.parse(JSON.stringify(this.selfCancheckedFuncData))
    },
    addItem2Unchecked (event) {
      // console.log(this.beforeDragChecked)
      let resCode = this.beforeDragChecked[event.oldIndex].resCode //被拖拽资源的资源编码
      this.selfCancheckedFuncData = JSON.parse(JSON.stringify(this.beforeDragCanChecked)) //可选择区域的数据
      let rootResCode = ''
      //从未过滤数组中找出资源对应的频道资源编码
      this.allCanCheckdFuncData.some(ele => {
        let flag = ele.funcList.some(ele1 => ele1.resCode === resCode)
        if (flag) {
          rootResCode = ele.resCode
          return true
        }
      })
      //赋值到下面可选区域
      this.selfCancheckedFuncData.some(model => {
        if (model.resCode === rootResCode) {
          model.funcList.push(this.beforeDragChecked[event.oldIndex])
          return true
        }
      })
    },
    addItem2Checked (event) {
      if (this.selfCheckedFuncData.length > 9) {
        this.$message({
          message: '已选图标已超过9个，请删除后继续添加！',
          showClose: true,
          type: 'warning'
        })
        this.selfCheckedFuncData = JSON.parse(JSON.stringify(this.beforeDragChecked))
        this.selfCancheckedFuncData = JSON.parse(JSON.stringify(this.beforeDragCanChecked))
      }
    },
    beforeCloseDig () {
      this.closeDialog()
    },
    closeDialog (refresh = false) {
      this.showDialog = false
      this.$emit('closeEditMyFunc', refresh)
    },
    submit () {
      // console.log('selfCheckedFuncData', this.selfCheckedFuncData)
      let params = []
      this.selfCheckedFuncData.forEach((ele, index) => {
        params.push({
          resCode: ele.resCode,
          sort: index
        })
      })
      API.updateCommonFunction(params)
        .then(res => {
          this.closeDialog(true)
          this.$message({
            message: '常用功能更新成功！',
            showClose: true,
            type: 'success'
          })
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '服务器异常，请稍后再试！',
            showClose: true,
            type: 'error'
          })
        })
    }
  },
  mounted () {
    this.showDialog = true
  },
  created () {
    // 阻止火狐浏览器默认的拖拽搜索行为
    document.body.ondrop = function (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
</script>
<style lang="scss" scoped>
.editFunction{
  .moduleFunc{
    border: $color-border-normal;
    border-radius: 4px;
    margin-bottom: 20px;
    .header{
      height: 45px;
      line-height: 45px;
      padding: 0 25px;
      background: $color-background-normal;
      font-size: 16px;
      color: $color-text-normal;
      font-weight: bold;
      & > span{
        font-weight: normal;
      }
    }
    .draggable-wrapper>span{
      display: flex;
      flex-wrap: wrap;
      height: 195px;
      box-sizing: border-box;
      margin: 20px 15px;
      // align-content: space-between;
      .funcItem{
        width: 20%;
        height: 77px;
        text-align: center;
        margin-bottom: 41px;
        img{
          width: 44px;
          height: 44px;
        }
        .funcIcon{
          display: inline-block;
          min-width: 44px;
          height: 44px;
          font-size: 44px;
          @include color();
        }
        p{
          height: 33px;
          line-height: 33px;
          padding: 0;
          margin: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }

  /deep/ .el-dialog{
    width: 605px;
    .el-dialog__body{
      padding: 30px 50px 0;
    }

    .el-tabs__header{
      margin-bottom: 0;
    }
    .el-tabs__content{
      height: 235px;
      .el-scrollbar{
      height: 235px;
      }
    }
    .el-tabs__nav-scroll{
      width: 100%;
      margin: auto;
      .el-tabs__nav{
        margin: 0 24px;
      }
    }
    .el-tabs__nav-wrap::after{
      height: 1px;
      background-color: #e5e5e5;
    }
  }

}
</style>
