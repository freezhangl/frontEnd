<template>
  <div class="body-con2" style="margin-bottom: 30px;">
    <projectPanel title="子项目" @changeExpand="changeExpand" :show-expand="showExpand">
      <div v-if="list.length > 0">
        <!-- 列表框 -->
        <projectPanel
          :title="listItem.projectName"
          v-for="(listItem, i) in list"
          :key="listItem.id"
          :expand-prop="i===0?true:false"
          class="addcon"
          style="border: 1px solid #E9E9E9;"
          @changeExpand="clickPanel(i)"
          :class="{'highlightStyleTitle':listItem.highlightProps && listItem.highlightProps.projectName,'allHighlightStyle':listItem.newSubProjectInfo && listItem.newSubProjectInfo}">
          <el-form
            label-position='right'
            ref="ruleForm"
            label-width="130px"
          >
            <el-row>
              <el-col :span="16">
                <el-form-item
                  label="子项目名称:"
                  prop="projectName"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.projectName}">
                  {{listItem.projectName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="项目经理:"
                  prop="projectManagerName"
                  :class="{'highlightStyle':listItem.highlightProps && listItem.highlightProps.projectManagerName}">
                  {{listItem.projectManagerName}}
                </el-form-item>
              </el-col>
            </el-row>
            <!-- table列表 -->
            <div class="achievement-list" v-if="listItem.projectAchievementList && listItem.projectAchievementList.length > 0">
              <div class="header">
                <div class="box">
                  <div class="title">预期成果</div>
                  <div style="padding-top:2px;margin-left:8px;">
                    <img @click="dataStyle('list', i)" :src="listItem.style === 'list' ? listIcon.checked : listIcon.notChecked">
                    <img @click="dataStyle('card', i)" :src="listItem.style === 'card' ? cardIcon.checked : cardIcon.notChecked">
                  </div>
                </div>
              </div>
              <div class="table" v-show="listItem.style === 'list'">
                <self-table
                  :table-data="listItem.projectAchievementList"
                  :table-cols="tableCols"
                  :row-class-name="rowClassName"
                >
                </self-table>
              </div>
              <!-- 卡片样式 -->
              <div style="padding: 0px 16px 16px 16px;" v-show="listItem.style === 'card'">
                <el-row v-if="listItem.projectAchievementList && listItem.projectAchievementList.length > 0" :gutter="30">
                  <el-col
                    :span="8"
                    v-for="itemCard of listItem.projectAchievementList"
                    :key="itemCard.id">
                    <el-card shadow="never">
                      <div slot="header" class="clearfix">
                        <el-tooltip
                          :disabled="itemCard.achievementName && itemCard.achievementName.length < 7"
                          :content="itemCard.achievementName"
                          effect="dark"
                          placement="top">
                          <span class="results-name" :class="getHighlightStyle(itemCard, 'achievementName') ? 'highlightStyle' : ''">{{itemCard.achievementName}}</span>
                        </el-tooltip>
                      </div>
                      <div class="card-body">
                        <div>
                          <el-tooltip
                            :content="itemCard.achievementTypeValue"
                            effect="dark"
                            placement="top">
                            <div style="display: flex;">
                              <span>成果类型：
                              </span>
                              <span :class="getHighlightStyle(itemCard, 'achievementTypeValue') ? 'highlightStyle' : ''" style="flex:1;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{itemCard.achievementTypeValue}}
                              </span>
                            </div>
                          </el-tooltip>
                        </div>
                        <div>预期交付时间：
                          <el-tooltip
                            :content="dateFilter(itemCard.deliveryTime)"
                            effect="dark"
                            placement="top">
                            <span :class="getHighlightStyle(itemCard, 'deliveryTime') ? 'highlightStyle' : ''">{{dateFilter(itemCard.deliveryTime)}}</span>
                          </el-tooltip>
                        </div>
                        <div>成果负责人：
                          <el-tooltip
                            :disabled="itemCard.responsiblePerson && itemCard.responsiblePerson.length < 5"
                            :content="itemCard.responsiblePerson"
                            effect="dark"
                            placement="top">
                            <span :class="getHighlightStyle(itemCard, 'responsiblePerson') ? 'highlightStyle' : ''">{{itemCard.responsiblePerson}}</span>
                          </el-tooltip>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
                <div v-else style="text-align: center;padding-top: 16px;color: #999">暂无数据</div>
              </div>
            </div>
          </el-form>
        </projectPanel>
      </div>
      <div class="no-data" v-else>暂无数据</div>
    </projectPanel>
  </div>
</template>
<script>
import projectPanel from '../../../components/projectPanel/index'
import selfTable from '@/components/table'
import API from '@/serve/API_project'
export default {
  props: ['receiveData', 'showExpand'],
  data () {
    return {
      list: [],
      tableCols: [
        {
          label: '子项目名称',
          prop: 'achievementName',
          align: 'left',
          minwidth: '200px',
          overflow: true,
          resizable: false,
          padding: true,
          itemClass: this.getHighlightStyle
        },
        {
          label: '成果类型',
          prop: 'achievementTypeValue',
          align: 'left',
          minwidth: '150px',
          overflow: true,
          resizable: false,
          itemClass: this.getHighlightStyle
        },
        {
          label: '成果负责人',
          prop: 'responsiblePerson',
          align: 'center',
          minwidth: '150px',
          overflow: true,
          resizable: false,
          itemClass: this.getHighlightStyle
        },
        {
          label: '预期交付时间',
          prop: 'deliveryTime',
          align: 'center',
          minwidth: '150px',
          overflow: true,
          resizable: false,
          formatter: this.dateFilter,
          itemClass: this.getHighlightStyle
        }
      ], // 表格配置
      rowClass: [],
      listIcon: {
        checked: require('@/assets/icons/列表选中.svg'),
        notChecked: require('@/assets/icons/列表未选中.svg')
      }, // 选择列表样式图标
      cardIcon: {
        checked: require('@/assets/icons/卡片选中.svg'),
        notChecked: require('@/assets/icons/卡片未选中.svg')
      } // 选择卡片样式图
    }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          val.forEach((item, index) => {
            item.style = 'list'
          })
          this.list = JSON.parse(JSON.stringify(val))
          if (this.list && this.list.length > 0) {
            this.clickPanel(0)
          }
        }
      }
    }
  },
  components: {
    projectPanel,
    selfTable
  },
  mounted () {
  },
  methods: {
    clickPanel (i) {
      if (this.list[i].isUpdate) {
        return false
      }
      let param = {
        projectCode: this.list[i].parentCode,
        subProjectCode: this.list[i].subProjectCode,
        versionNo: this.list[i].versionNo
      }
      API.subProjectDetailInfo(param)
        .then(res => {
          this.list[i].projectAchievementList = res.projectAchievementList
          this.list[i].isUpdate = true
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message,
            type: 'error',
            showClose: true
          })
        })
    },
    dataStyle (style, i) {
      this.list[i].style = style
    },
    // 时间戳过滤
    dateFilter (val) {
      if (!val) {
        return ''
      }
      let date = new Date(val)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return Y + M + D
    },
    getHighlightStyle (row, prop) {
      if (row.highlightProps && row.highlightProps[prop]) {
        return 'highlightStyle'
      }
    },
    // 成果列表数据对比高亮
    rowClassName ({ row, rowIndex }) {
      //console.log(row, '对比的当前子项目行')
      let className = ''
      if (row.highlightProps && row.highlightProps.achievementName && row.highlightProps.achievementType &&
      row.highlightProps.responsiblePerson && row.highlightProps.deliveryTime) {
        if (rowIndex > 0 && this.rowClass[rowIndex - 1]) {
          className = 'highlight-border highlight-border-none-top'
        } else {
          className = 'highlight-border'
        }
      }
      this.rowClass[rowIndex] = className
      return className
    },
    changeExpand (isExpand) {
      this.$emit('changeExpand', isExpand)
    }
  }
}
</script>
<style lang="scss" scoped>
.body-con2 /deep/{
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
    padding: 20px 30px 20px 30px;
    height: auto;
    margin-bottom:30px;
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
        color: #0b82ff;
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
.achievement-list {
  width: 100%;
  margin-top: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  .header {
    width: 100%;
    padding: 12px 0;
    border-bottom: 1px solid #e5e5e5;
    .box {
      display: flex;
      justify-content: space-between;
      padding: 0 16px;
      .title {
        color: #333;
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
  .table {
    padding: 16px;
    /deep/ .highlightStyle{
      color: #FF3F3B;
    }
    /deep/ .highlightStyle{
      color: #FF3F3B;
    }
    /deep/ .el-table .el-table__row.highlight-border{
      td{
        position: relative;
        z-index: 1000;
        border-top: 1px solid #ff3f3b;
        border-bottom: 1px solid #FF3F3B !important;
        &:nth-child(1){
          border-left: 1px solid #FF3F3B;
        }
        &:nth-last-child(1){
          border-right: 1px solid #FF3F3B;
        }
      }
      &.highlight-border-none-top td{
        border-top: 1px solid #EBEEF5;
      }
    }
  }
}

.no-data {
  padding: 16px 0;
  text-align: center;
  color: #999
}
// 卡片样式
.clearfix {
  height: 35px;
  line-height: 35px;
  &:before,
  &:after {
    display: table;
    content: "";
  }
  &:after {
    clear: both
  }
  .results-name {
    display: inline-block;
    width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
/deep/ .el-col {
  margin-top: 16px !important;
}

/deep/ .el-card__header {
  padding: 0 20px !important;
}
</style>
