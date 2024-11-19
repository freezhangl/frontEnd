<template>
  <!-- 委托项目-单位父项目里程碑 -->
  <div class="wrapper">
    <el-form
      ref="form"
      :model="form"
      label-width="160px"
      :inline="true">
      <el-form-item :label="'里程碑名称：'">
        <el-input placeholder="请输入里程碑名称" v-model.trim="form.milestoneName"></el-input>
      </el-form-item>
      <el-form-item :label="'里程碑计划完成时间：'" class="date">
        <el-date-picker
          v-model="form.planEndTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="'所属项目名称：'">
        <el-input placeholder="请输入" v-model.trim="form.projectName"></el-input>
      </el-form-item>
      <template v-if="!isPackUp">
        <el-form-item :label="'需求单位：'">
          <el-tooltip
            effect="dark"
            :content="demandName"
            placement="top-start"
            size="small"
            :disabled="!demandName">
            <el-select
              clearable
              @change="changeDemand"
              v-model="form.demandUnitCode"
              placeholder="请选择">
              <el-option
                v-for="item in demandUnitOptions"
                :key="item.id"
                :label="item.organizationName"
                :value="item.organizationCode"
              ></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="'是否关联成果：'">
          <el-select clearable v-model="form.linkResultFlag" placeholder="请选择是否关联成果">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'集团项目类别：'">
          <el-select clearable v-model="form.projectClass" placeholder="请选择">
            <el-option
              v-for="item in classList"
              :key="item.valueCode"
              :label="item.name"
              :value="item.valueCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'承担单位：'">
          <el-tooltip
            effect="dark"
            :content="undertakerName"
            placement="top-start"
            size="small"
            :disabled="!undertakerName">
            <el-select
              clearable
              @change="changeUndertake"
              v-model="form.commitmentUnitCode"
              placeholder="请选择">
              <el-option
                v-for="item in undertakerUnitOptions"
                :key="item.id"
                :label="item.organizationName"
                :value="item.organizationCode"
              ></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="'里程碑责任人：'">
          <el-input placeholder="请输入里程碑责任人" v-model="form.milestoneLeader"></el-input>
        </el-form-item>
        <el-form-item :label="'集团项目级别：'">
          <el-select clearable v-model="form.projectLevel" placeholder="请选择">
            <el-option
              v-for="item in levelList"
              :key="item.valueCode"
              :label="item.name"
              :value="item.valueCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'所属项目编码：'">
          <el-input placeholder="请输入" v-model.trim="form.projectCode"></el-input>
        </el-form-item>
        <el-form-item :label="'项目所属年份：'">
          <el-date-picker
            suffix-icon="el-icon-date"
            v-model="form.projectYear"
            type="year"
            value-format="yyyy"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </template>
      <div class="form-button">
        <span :class="isPackUp ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="packUp"></span>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="getData">查 询</el-button>
        <el-button
          icon="el-icon-refresh-left"
          @click="reset">重 置</el-button>
      </div>
    </el-form>
    <!-- type: 目录名 + 当前文件名 -->
    <list
      v-if="reload"
      ref="list"
      type="group-entrustParentMilestone"
      :form="form"></list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import list from '../components/list'
import api from '@/serve/API_groupPlanProject'
export default {
  components: { list },
  data () {
    return {
      demandUnitOptions: [], // 需求方清单
      undertakerUnitOptions: [], // 承担方清单
      levelList: [], // 项目级别
      classList: [], // 项目类别
      options: [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ],
      form: {
        milestoneName: '', // 里程碑名称
        planEndtime: '', // 计划完成时间
        projectName: '', // 所属项目名称
        demandUnitCode: '', // 需求单位
        linkResultFlag: '', // 是否关联成果
        projectClass: '', // 集团项目类别
        commitmentUnitCode: '', // 承担单位
        milestoneLeader: '', // 里程碑责任人
        projectLevel: '', // 集团项目级别
        projectCode: '', // 所属项目编码
        projectYear: '' // 项目所属年份
      },
      reload: true,
      demandName: '', // 需求单位 选中名称
      undertakerName: '', // 承担单位 选中名称
      isPackUp: false // 收起
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo'
    })
  },
  created () {
    this.getEmployerUndertaker('1') //需求方单位清单
    this.getEmployerUndertaker('2') //承担方单位清单
    this.getProjectClass() // 项目类别
    this.getProjectLevel() // 项目级别
  },
  methods: {
    // 收起搜索条件
    packUp () {
      this.isPackUp = !this.isPackUp
    },
    // 重置
    reset () {
      this.form = {
        milestoneName: '', // 里程碑名称
        planEndtime: '', // 计划完成时间
        projectName: '', // 所属项目名称
        demandUnitCode: '', // 需求单位
        linkResultFlag: '', // 是否关联成果
        projectClass: '', // 集团项目类别
        commitmentUnitCode: '', // 承担单位
        milestoneLeader: '', // 里程碑责任人
        projectLevel: '', // 集团项目级别
        projectCode: '', // 所属项目编码
        projectYear: '' // 项目所属年份
      }
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    },
    // 获取数据
    getData () {
      this.$refs.list.getData(true)
    },
    // 数据字典 - 获取项目级别
    getProjectLevel () {
      api.getDictValByCode('CO-PROJECT-LEVEL')
        .then(res => {
          this.levelList = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 数据字典 - 获取项目类别
    getProjectClass () {
      api.getDictValByCode('ITEM_CATEGORY')
        .then(res => {
          if (res && res.length) {
            this.classList = res.filter(item => !item.name.includes('自立项目'))
          }
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 获取 需求|承担 单位清单
    getEmployerUndertaker (orgType) {
      api.getEmployerUndertaker({ orgType: orgType })
        .then(res => {
          if (res) {
            let companyList = []
            res.forEach(ele => {
              let company = {
                id: ele.id,
                organizationCode: ele.orgCode,
                organizationName: ele.orgName,
                companyCode: ele.companyCode,
                companyName: ele.companyName,
                disabled: false
              }
              companyList.push(company)
            })
            if (orgType === '1') { //需求方
              this.demandUnitOptions = JSON.parse(JSON.stringify(companyList))
            } else if (orgType === '2') { //承担方
              this.undertakerUnitOptions = JSON.parse(JSON.stringify(companyList))
            }
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取需求方承担方清单失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 需求单位 切换
    changeDemand (val) {
      this.demandUnitOptions.forEach(item => {
        if (val === item.organizationCode) {
          this.demandName = item.organizationName
        }
      })
    },
    // 承担单位 切换
    changeUndertake (val) {
      this.undertakerUnitOptions.forEach(item => {
        if (val === item.organizationCode) {
          this.undertakerName = item.organizationName
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form{
  background-color: #fff;
  margin-bottom: 10px;
  padding: 20px 30px 10px;
  .el-form-item{
    /deep/ .el-form-item__content{
      width: 230px;
      & > * {
        width: 100%;
        input {
          width: 100%;
        }
      }
    }
  }
}
.form-button{
  margin-top: 10px;
  text-align: right;
  span{
    cursor: pointer;
    text-align: center;
    line-height: 28px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    border: 1px solid #e5e5e5;
    color: #e5e5e5;
    border-radius: 2px;
    width: 28px;
    height: 28px;
  }
}
.el-button {
  @include color($color-blue);
  @include border($color-blue);
}
</style>
