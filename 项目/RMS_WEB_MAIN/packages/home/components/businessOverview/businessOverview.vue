<template>
  <div class="business-overview-tab">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      class="business-overview-tab-head">
      <el-tab-pane v-if="busWorkShow" label="工时填写情况" name="first">工时填写情况</el-tab-pane>
      <el-tab-pane v-if="busProCostShow" label="项目成本情况" name="second">项目成本情况</el-tab-pane>
      <el-tab-pane v-if="busProExtShow" label="项目执行情况" name="third">项目执行情况</el-tab-pane>
      <el-tab-pane v-if="busPlanShow" label="计划落地情况" name="fourth">计划落地情况</el-tab-pane>
      <el-tab-pane v-if="busFifthShow" label="第五个tab" name="fifth">第五个tab</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { BUSINESSOVERVIEW } from '@lib/common/const/const'
export default {
  name: 'businessOverview',
  data () {
    return {
      activeName: 'none',
      busWorkShow: false,
      busProCostShow: false,
      busProExtShow: false,
      busPlanShow: false,
      busFifthShow: false
    }
  },

  computed: {
    ...mapGetters({
      hasAuthTag: 'USERENTITY/hasAuthTag',
      outUserAuth: 'USERENTITY/outUserAuth'
    })
  },
  watch: {
    activeName: {
      immediate: true,
      handler (val) {
        // console.log('activeName', this.activeName)
        if (val === '') {
          this.$emit('hiddenArea')
        }
      }
    },
    outUserAuth: {
      deep: true,
      immediate: true,
      handler (val) {
        this.busWorkShow = this.hasAuthTag(BUSINESSOVERVIEW.BUSWOTK)
        this.busProCostShow = this.hasAuthTag(BUSINESSOVERVIEW.BUSPROCOST)
        this.busProExtShow = this.hasAuthTag(BUSINESSOVERVIEW.BUSPROEXE)
        this.busPlanShow = this.hasAuthTag(BUSINESSOVERVIEW.BUSPLAN)
        this.busFifthShow = this.hasAuthTag(BUSINESSOVERVIEW.BUSFIFTH)
        let temp = [this.busWorkShow, this.busProCostShow, this.busProExtShow, this.busPlanShow, this.busFifthShow]
        let hasShow = temp.some(ele => ele)
        if (hasShow) {
          this.$nextTick(() => {
            this.setTabsScroll()
          })
        } else {
          this.activeName = ''
        }
      }
    }

  },
  methods: {
    handleClick (tab, event) {
      this.activeName = tab.name
    },
    setTabsScroll () {
      //页面渲染时判断tab页签是否超过四个，如果超过四个左右滑动
      this.$nextTick(() => {
        let tabHead = document.getElementsByClassName('business-overview-tab-head')[0] //获取此组件tab父元素
        let tabs = tabHead.getElementsByClassName('el-tabs__nav-wrap')[0] //获取控制tab宽度的元素
        let tabsItem = tabHead.getElementsByClassName('el-tabs__item') //获取tab页签的集合
        if (tabsItem.length > 0) {
          this.activeName = tabsItem[0].id.split('-')[1]
        } else {
          this.activeName = ''
        }
        if (tabsItem.length > 4) {
          let tabWidth = 0
          for (var i = 0; i < 4; i++) {
            tabWidth += tabsItem[i].offsetWidth
          }
          tabs.style.width = tabWidth - 20 + 'px' //这里要去掉第四个页签的右内边距 影响视觉效果
        }
      })
    }
  },

  mounted () {

  }
}
</script>
<style lang="scss" scoped>
  .business-overview-tab {
    height: 43px;
    background: $color-background-normal;
    border-radius: 3px 3px 0 0;
    .el-tabs {
      height: 100%;
      padding: 0 10px;
      /deep/ .el-tabs__header {
        line-height: 43px;
        margin: 0;
        .el-tabs__nav-wrap {
          box-sizing: content-box;
          &::after {
            height: 0;
          }
        }
        .el-tabs__item {

          font-size: 16px;
          font-weight: 700;
        }
        .el-tabs__item.is-active {

        }
      }
    }
  }
</style>
