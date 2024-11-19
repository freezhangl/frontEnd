
<!--
 * @FileDescription: 父项目一般支撑包
 * @Author: 前端 许硕
 * @Author: 后端  吴武刚
 -->
<template>
  <div class="workInformation">
    <div class="timeSheet" style=" margin-top: 20px;">
      <div class="back-top" v-if="showBackTop" @click="backToTop">
        <img src="@/assets/icons/backtop.png" alt="">
      </div>
      <span style="float:right;margin-top: 20px;" class="renyue">(单位:人月)</span>
      <el-table
        :data="data.entrustLetterList"
        ref="table"
        border
        :span-method="arraySpanMethod"
      >
        <el-table-column
          prop="entrustLetter.taskName"
          align="center"
          class-name="is-leaf"
          label="任务名称">
        </el-table-column>
        <el-table-column
          prop="entrustLetter.letterState"
          align="center"
          class-name="is-leaf"
          label="状态"
        >
        </el-table-column>
        <el-table-column
          prop="createdDate"
          class-name="is-leaf"
          align="center"
          :formatter = formatter
          label="下达日期">
        </el-table-column>
        <el-table-column
          prop="group"
          align="center"
          label="集团批复">
          <el-table-column
            prop="group"
            align="center">
            <template slot="header" :class="scope" slot-scope="scope">
              <span>{{totalProjectTime.group}}
              </span>
              <el-tooltip content="项目预算总工时" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template></el-table-column>
        </el-table-column>
        <el-table-column
          prop="plan"
          align="center"
          label="计划工时">
          <el-table-column
            prop="plan"
            :label="'-'"
            align="center"></el-table-column>
        </el-table-column>
        <el-table-column
          prop="actualCost"
          align="center"
          width="217"
          label="已确认工时">
          <el-table-column
            prop="confirm"
            :label="'-'"
            align="center"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import API_PG from '@/serve/API_projectSearch'
import { getStore } from '@/store'
// import general from './general'
export default {
  name: 'gproGeneral',
  data () {
    return {
      projectCode: this.$route.params.projectCode || '',
      projectpCompanyCode: null,
      data: {},
      showBackTop: false,
      totalProjectTime: {}, //合计（只有集团批复有值）
      remainProjectTime: {}, //剩余工时
      usedProjectTime: {}, //小计（已使用工时）
      entrustLetterList: [],
      footerData: [{
        entrustLetter: { taskName: '小计' },
        letterState: '',
        createdDate: '',
        group: '',
        plan: '',
        confirm: null
      },
      {
        entrustLetter: { taskName: '剩余预算工时' },
        letterState: '',
        createdDate: '',
        group: '',
        plan: '-',
        confirm: '-'
      }]
    }
  },
  created () {
    this.getProjectInfo()
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  methods: {
    // 时间格式化
    formatter (row, column) {
      return this.getNowTime(row.entrustLetter.createdDate)
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if ((row.taskName ? row.taskName === '小计' : row.entrustLetter.taskName === '小计') || (row.taskName ? row.taskName === '剩余预算工时' : row.entrustLetter.taskName === '剩余预算工时')) {
        if (columnIndex === 0) {
          return [1, 3]
        } else if (columnIndex === 1 || columnIndex === 2) {
          return [0, 0]
        }
      }
    },
    getProjectInfo () {
      let params = {
        projectCode: this.projectCode,
        userAccount: getStore().getters['USERENTITY/userInfo'].userAuth.uid
      }
      API_PG.proGeneral(params)
        .then(res => {
          let newObj = {}
          this.totalProjectTime = res.totalProjectTime
          if (res && res.entrustLetterList && res.entrustLetterList.length) {
            for (let i = 0; i < res.entrustLetterList.length; i++) {
              res.entrustLetterList[i] = { ...res.entrustLetterList[i].remainProjectTime, ...res.entrustLetterList[i] }
            }
            this.footerData[0].group = res.usedProjectTime.group
            this.footerData[0].plan = res.usedProjectTime.plan
            this.footerData[0].confirm = res.usedProjectTime.confirm
            this.footerData[1].group = res.remainProjectTime.group
            res.entrustLetterList = res.entrustLetterList.concat(this.footerData)
            this.data = res
          } else {
            this.data = {}
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: !e.message ? '列表获取失败！' : e.message === '当前用户没有该项目的业务流程权限！' ? '当前用户没有该项目的工时信息查看权限！' : e.message,
            type: 'error',
            showClose: true
          })
        })
    },
    //  获取背景色
    columnStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 2 || columnIndex === 1) {
        //第一第二第三列的背景色就改变了0,1和2都是列数的下标
        return 'background:rgba(150, 154, 184,0.1);'
      }
    },
    //获取时间
    getNowTime (timestamp) {
      let now = timestamp ? new Date(timestamp) : new Date()
      let year = now.getFullYear()
      let month = now.getMonth()
      month = month + 1
      month = month.toString()
        .padStart(2, '0')
      let day = now
        .getDate()
        .toString()
        .padStart(2, '0')
      let defaultDate = `${year}-${month}-${day}`
      return defaultDate
    },
    // 回到顶部
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
    },
    scrollWindow () {
      let doc = document.documentElement || document.body
      if (doc === null) return
      let sTop = doc.scrollTop
      if (sTop > 500) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px) {
  .timeSheet {
    width: 1000px !important;
  }
  .sum_footer{
     width: 1000px !important;
  }
}

@media screen and (max-width: 1364px) {
  .timeSheet {
    width: 960px !important;
  }
  .sum_footer{
     width: 960px !important;
  }
}
.workInformation {
  background: #f6f6f6;
  height: 100%;
  width: 100%;
}
.timeSheet {
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 40px;
  background: #fff;
  width: 1180px;
  margin: 0 auto;
  box-sizing: border-box;
     .back-top{
      position: fixed;
      bottom: 20px;
      right : 10px;
      cursor: pointer;
      img{
        width: 50px;
        height: 50px;
      }
    }
}
.renyue {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #595959;
  letter-spacing: 0;
  line-height: 20px;
  margin-bottom: 10px;
}
.el-table /deep/{
  .el-table__header-wrapper th{
    background-color:#f4f4f4 !important;
  }
  .el-table__body tr{
    td.is-leaf{
      background-color:#f4f4f4;
    }
    &:hover > td{
      background-color:transparent !important;
      &.is-leaf{
        background-color:#f4f4f4 !important;
      }
    }
    &:nth-last-child(2),&:nth-last-child(1){
      div{
        text-align: center;
        @include color();
      }
      td.is-leaf div{
        color: rgba(0,0,0,0.85);
        font-weight: bold;
      }
    }

  }
}
.el-icon-info{
  @include color();
}
</style>
