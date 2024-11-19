<template>
  <div class="home-wrapper">
    <div class="banner">
      <banner></banner>
    </div>
    <div class="middle">
      <div class="middle-left">
        <my-task></my-task>
      </div>
      <div class="middle-right">
        <common-function ref="myCommomFunc" class="commonFun" @editMyFunc="openEditMyFunc"></common-function>
        <div class="notice">
          <notification-announcement></notification-announcement>
        </div>
      </div>
    </div>
    <!-- <div class="bottom" v-if="bottomVis"> -->
    <div class="bottom" v-if="false">
      <business-overview @hiddenArea="hiddenBusOverview"></business-overview>
    </div>

    <edit-function
      class="editMyFunc"
      v-if="editMyFuncVis"
      :checked-func-data="checkedMyFunc"
      :canchecked-func-data="canCheckdMyFunc"
      :all-can-checkd-func-data="allCanCheckdMyFunc"
      @closeEditMyFunc="closeEditMyFunc"></edit-function>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import API from '../serve'
import CommonFunction from '../components/commonFunction/homeCommonFunc'
import EditFunction from '../components/commonFunction/editCommonFunc'
import Banner from '../components/banner/banner'
import BusinessOverview from '../components/businessOverview/businessOverview'
import MyTask from '../components/myTask/myTask'
import NotificationAnnouncement from '../components/notificationAnnouncement/notificationAnnouncement'
// import { commomFunction } from '../serve/mockData'
import { isShowToolTip } from '@lib/common/util/common'
export default {
  name: 'home',
  components: { CommonFunction, EditFunction, Banner, BusinessOverview, MyTask, NotificationAnnouncement },
  computed: {
    ...mapGetters({
      selfName: 'HOME/description',
      hasRole: 'USERENTITY/hasRole',
      hasAuthTag: 'USERENTITY/hasAuthTag',
      menus: 'MENU/menus',
      curUserOrg: 'USERENTITY/curUserOrg'
    })
  },
  data () {
    return {
      editMyFuncVis: false, //编辑常用功能弹出框
      checkedMyFunc: [], //已选常用功能
      canCheckdMyFunc: [], //可选常用功能
      allCanCheckdMyFunc: [], //全部可选常用功能
      bottomVis: true //底部业务概览是否展示
    }
  },
  methods: {
    openEditMyFunc () {
      this.getMyFuncList('open')
    },
    closeEditMyFunc (refresh) {
      if (refresh) {
        this.$refs['myCommomFunc'].getMyFuncList('close')
      }
      this.editMyFuncVis = false
    },
    getMyFuncList (status) {
      this.checkedMyFunc = []
      this.canCheckdMyFunc = []
      this.allCanCheckdMyFunc = []
      API.getCommonFunction()
        .then(res => {
          if (!res || res.length === 0) {
            if (status === 'close') {
              /* this.$message({
                message: '我的常用功能配置不存在！',
                showClose: true,
                type: 'error'
              }) */
            }
          } else {
            res.forEach(ele => {
              ele.showTooltip = isShowToolTip(ele.resName, 95)
            })
            this.checkedMyFunc = res.slice(0, 9)
          }
          this.canCheckdMyFunc = []
          this.allCanCheckdMyFunc = []
          this.menus.forEach(menu => {
            this.canCheckdMyFunc.push(menu)
            this.allCanCheckdMyFunc.push(Object.assign({}, menu))
            this.getAllFuncList(menu.resCode)
          })
        })
        .catch(e => {
          if (e.selfError) return
          if (e.code === '112301') {
            if (status === 'close') {
              this.$message({
                message: e.message,
                showClose: true,
                type: 'error'
              })
            }
            this.checkedMyFunc = []
            this.canCheckdMyFunc = []
            this.allCanCheckdMyFunc = []
            this.menus.forEach(menu => {
              this.canCheckdMyFunc.push(menu)
              this.allCanCheckdMyFunc.push(Object.assign({}, menu))
              this.getAllFuncList(menu.resCode)
            })
            return
          }
          this.$message({
            message: e.message || '服务器异常，请稍后再试！',
            showClose: true,
            type: 'error'
          })
        })
    },
    getAllFuncList (resCode) {
      let params = {
        parentResCode: resCode,
        recursion: true,
        resScope: '1',
        resType: '1',
        orgCode: this.curUserOrg.orgCode
      }
      API.getAllFunctionList(params)
        .then(res => {
          let funcList = res || []
          funcList.forEach(ele => {
            ele.icon = ele.functionIcon
            ele.showTooltip = isShowToolTip(ele.resName, 95)
          })
          let newList = funcList.filter(ele => {
            let exclude = this.checkedMyFunc.some(element => element.resCode === ele.resCode)
            return !exclude
          })
          this.canCheckdMyFunc.some(ele => {
            if (ele.resCode === resCode) {
              this.$set(ele, 'funcList', newList)
              return true
            }
          })
          //未过滤已选的常用功能
          this.allCanCheckdMyFunc.some(ele => {
            if (ele.resCode === resCode) {
              this.$set(ele, 'funcList', funcList)
              return true
            }
          })
          this.editMyFuncVis = true
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '服务器异常，请稍后再试！',
            showClose: true,
            type: 'error'
          })
        })
    },
    hiddenBusOverview () {
      // console.log('hiddenBusOverview')
      this.bottomVis = false
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home-wrapper {
  height: 100%;
  background: #F5F6FA;
  .banner{
    width: 100%;
    height: 140px;
    background-color: bisque;
  }
  .middle{
    width: 100%;
    height: 587px;
    display: flex;
    justify-content: space-between;
    margin: 14px 0;
    .middle-left{
      // width: calc(100% - 597px);
      width: 50%;
      min-width: 50%;
      max-width: 50%;
      /*border: 1px solid #E5E5E5;*/
      /*border-radius: 4px;*/
      /*background-color:#FFFFFF;*/
      /*box-shadow: 0 2px 6px 0px rgba(0,0,0,.15);*/
    }
    .middle-right{
      // width: 583px;
      width: 50%;
      min-width: 50%;
      max-width: 50%;
      /*margin-left: 14px;*/
      display: flex;
      flex-direction: column;
      align-content: space-between;
      & > div{
        border: 1px solid #E5E5E5;
        border-radius: 4px;
        box-shadow: 0 2px 6px 0px rgba(0,0,0,.15);
      }
      .commonFun{
        height: 272px;
        margin-bottom: 14px;
        background-color:#FFFFFF;
        margin-left: 7px;
      }
      .notice{
        height: calc(100% - 286px);
        background-color:#FFFFFF;
        margin-left: 7px;
      }
    }
  }
  .bottom{
    width: 100%;
    height: 370px;
    background-color:#FFFFFF;
    border: 1px solid #E5E5E5;
    border-radius: 4px;
    box-shadow: 0 2px 6px 0px rgba(0,0,0,.15);
  }
}
</style>
