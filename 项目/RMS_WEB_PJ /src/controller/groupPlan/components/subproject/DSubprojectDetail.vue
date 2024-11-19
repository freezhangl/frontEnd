<template>
  <div class="body-con1" style="margin-bottom: 30px;">
    <!-- 需求单位非一般支撑包和一般支撑包详情 -->
    <projectPanel title="子项目">
      <div>
        <!-- 列表框 -->
        <projectPanel
          :title="listItem.projectName"
          class="addcon"
          style="border: 1px solid #E9E9E9;"
          :class="{'highlightStyleTitle':listItem.highlightProps && listItem.highlightProps.projectName,'allHighlightStyle':listItem.newSubProjectInfo && listItem.newSubProjectInfo}"
          v-for="listItem in list"
          :key="listItem.id"
          :expand-prop="listItem.isExpand"
          @changeExpand="changeExpand(listItem)">
          <el-form
            label-position='right'
            ref="ruleForm"
            label-width="190px">
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="子项目名称:"
                  prop="projectName"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.projectName}">
                  {{listItem.projectName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="研究领域:"
                  prop="researchFieldValue"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.researchFieldValue}">
                  {{listItem.researchFieldValue}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="所属市场业务:"
                  prop="marketBusinessValue"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.marketBusinessValue}">
                  {{listItem.marketBusinessValue}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="子项目牵头需求单位:"
                  prop="leadDemandUnit"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.leadDemandUnit}">
                  {{listItem.leadDemandUnit?listItem.leadDemandUnit.organizationName:''}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="子项目牵头需求单位经理:"
                  prop="leadDemandManager"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.leadDemandManager}">
                  {{listItem.leadDemandManager?listItem.leadDemandManager.userName:''}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="承担方开展模式:"
                  prop="developmentMode"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.developmentMode}">
                  {{listItem.developmentMode | devMode}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="子项目牵头承担单位:"
                  prop="leadUndertakeUnit"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.leadUndertakeUnit}">
                  {{listItem.leadUndertakeUnit?listItem.leadUndertakeUnit.organizationName:''}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="子项目牵头承担单位经理:"
                  prop="leadUndertakeManager"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.leadUndertakeManager}">
                  {{listItem.leadUndertakeManager?listItem.leadUndertakeManager.userName:''}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="listItem.developmentMode?listItem.developmentMode.toString()!=='DM_B':false">
              <el-col :span="24">
                <el-form-item
                  label="自研内容:"
                  prop="researchContent"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.researchContent}">
                  {{listItem.researchContent}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="listItem.developmentMode?listItem.developmentMode.toString()!=='DM_A':false">
              <el-col :span="24">
                <el-form-item
                  label="委托方研发内容:"
                  prop="demandContent"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.demandContent}">
                  {{listItem.demandContent}}
                </el-form-item>
              </el-col>
            </el-row>
            <achievementDetail :receive-data='listItem.projectAchievementList' :project-base-info='projectBaseInfo'></achievementDetail>
          </el-form>
        </projectPanel>
      </div>
    </projectPanel>
  </div>
</template>
<script>
import API from '@/serve/API_groupPlanProject'
import projectPanel from '../../../components/projectPanel/index'
import achievementDetail from './achievement/dAchievementDetail'
export default {
  props: {
    receiveData: { //接受参数子项目是个数组列表
      type: Array,
      default: () => []
    },
    projectBaseInfo: {
      type: Object,
      default: () => {}
    },
    expandDefault: {
      type: Boolean,
      default: true
    },
    versionNo: {
      type: String,
      default: ''
    }
  },
  components: { projectPanel, achievementDetail },
  data () {
    return {
      list: [],
      marketBusiList: [],
      searchFieldList: [],
      timer: null,
      hasVersionNo: false,
      versionTimer: null
    }
  },
  filters: {
    devMode: function (val) {
      switch (val) {
        case 'DM_A' :
          return '自研'
        case 'DM_B' :
          return '委托研发'
        case 'DM_A&DM_B' :
          return '自研、委托研发'
        case 'DM_B&DM_A' :
          return '自研、委托研发'
        default:
          return ''
      }
    }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.list = []
          let listTemp = JSON.parse(JSON.stringify(val)) || []
          let step = 5
          let num = Math.ceil(listTemp.length / step)
          let index = 0
          this.timer = setInterval(() => {
            if (num > 0) {
              let tempArr = listTemp.filter((l, i) => i >= index && i < index + step)
              index += step
              tempArr.forEach(item => {
                item.isExpand = false //是否展开
                item.isCached = false //是否已缓存
                item.projectName = item.projectName ? item.projectName : ''
              })
              this.list = this.list.concat(tempArr)
              num--
            } else {
              if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
              }
            }
          }, 10)
          if (listTemp.length > 0 && this.expandDefault) { //对比页面默认不展开expandDefault:false
            this.changeExpand(listTemp[0]) //第一个默认展开
          }
        }
      }
    },
    versionNo: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.hasVersionNo = true
        }
      }
    }
  },
  created () {
  },
  mounted () {
    // this.getDocParams()
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.versionTimer) {
      clearInterval(this.versionTimer)
      this.versionTimer = null
    }
  },
  methods: {
    getDocParams () {
      // 批量获取所属市场业务、研究领域
      let param = {
        codes: 'MARKET_BUSINESS_RANGE,RESEARCH_DOMAIN'
      }
      API.dictValByCodes(param)
        .then(res => {
          res.forEach(dicItem => {
            switch (dicItem.code) {
              case 'MARKET_BUSINESS_RANGE':
                this.marketBusiList = dicItem.dictionarys
                break
              case 'RESEARCH_DOMAIN':
                this.searchFieldList = dicItem.dictionarys
                break
            }
          })
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    /**
     * 展开/收起 子项目
     */
    changeExpand (item) {
      if (!item.isExpand && !item.isCached) { //未展开且未缓存数据时调接口
        if (this.$route.query.versionNo || this.hasVersionNo) {
          this.getDetail(item)
        } else {
          this.versionTimer = setInterval(() => {
            if (this.hasVersionNo) {
              if (this.versionTimer) {
                clearInterval(this.versionTimer)
                this.versionTimer = null
              }
              this.getDetail(item)
            }
          }, 500)
        }
      } else {
        item.isExpand = !item.isExpand
      }
    },
    getDetail (item) {
      let params = {
        projectCode: this.projectBaseInfo.projectCode,
        subProjectCode: item.subProjectCode,
        versionNo: this.versionNo || this.$route.query.versionNo
      }
      API.querySubProjectDetailD(params)
        .then(async res => {
          if (res) {
            item.isCached = true
            item.isExpand = true
            Object.assign(item, res)
            this.$emit('expandSubPro', item)
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '子项目详情获取失败',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.body-con1 /deep/{
    margin-bottom: 30px;
    .el-form-item .el-input__inner{
      width : 100%;
    }
    .el-select{
      width:100%;
    }
    .el-date-editor{
      width:100%;
    }
    .project-panel .panel-body{
      margin-bottom: 0;
    }
    .project-panel .panel-body.is-expand {
      padding: 10px 20px 10px 20px;
      height: auto;
      margin-bottom: 30px;
    }
    .addcon{
       border: 1px solid #E9E9E9;
       margin-bottom: 20px;
       &:last-child{
         margin-bottom: 0;
       }
    }
    .el-textarea .el-input__count{
      height: 22px;
      line-height: 22px;
      bottom: 1px;
      right: 22px;
    }
    .tabcon{
        padding: 0px 15px;
        border: 1px solid #E5E5E5;
        float: left;
        width: 100%;
        box-sizing: border-box;
        border-radius: 4px;
        font-size: 14px;
      .butt{
        float: right;
        height: 100%;
        i{
          // color: #0b82ff;
        }
      }
      .item{
        display: flex;
        float: left;
        margin-right: 10px;
        max-width: 100px;
        .tooltip-span{
          display: inline-block;
          width: 100%;
          height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .close{
        cursor: pointer;
        font-size: 16px;
        color: #6666;
        margin-left: 3px;
      }
    }

    .highlightStyleTitle > .panel-header > .header-title{
      color: #FF3F3B !important;
    }
    .highlightStyle{
      color: #FF3F3B;
    }
    .highlightStyle .el-form-item__content{
      color: #FF3F3B;
    }
    .allHighlightStyle{
      border: 1px solid #FF3F3B !important;
    }
  }
</style>
