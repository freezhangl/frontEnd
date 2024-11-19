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
        <el-input placeholder="请输入所属项目名称" v-model.trim="form.projectName"></el-input>
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
              :disabled="disabledDemand"
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
        <el-form-item :label="'所属项目编码：'">
          <el-input placeholder="请输入所属项目编码" v-model.trim="form.projectCode"></el-input>
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
              :disabled="disabledUndertake"
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
          <el-input placeholder="请输入里程碑责任人" v-model.trim="form.milestoneLeader"></el-input>
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
    <!-- <list :data="data" :pagination-data="paginationData"></list> -->
    <!-- type: 目录名 + 当前文件名 -->
    <list
      v-if="reload"
      ref="list"
      type="unit-entrustParentMilestone"
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
      options: [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ],
      form: {
        milestoneName: '', // 里程碑名称
        planEndTime: '', // 计划完成时间
        projectName: '', // 所属项目名称
        milestoneLeader: '', // 里程碑负责人
        demandUnitCode: '', // 需求单位
        commitmentUnitCode: '', // 承担单位
        projectCode: '', // 所属项目编码
        linkResultFlag: '' // 是否关联成果
      },
      disabledDemand: false, // 需求单位是否禁用
      disabledUndertake: false, // 承担单位是否禁用
      haveNum: 0, // 登录人的单位 存在几个清单中(需求、承担)
      reload: true,
      companyCode: '',
      orgCode: '',
      demandName: '', // 需求单位 选中名称
      undertakerName: '', // 承担单位 选中名称
      defaultUnitCode: '', // 默认选中单位的code
      isPackUp: false // 收起
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo'
    })
  },
  created () {
    this.haveNum = 0
    this.companyCode = this.userInfo.userAuth.companyCode
    this.orgCode = this.userInfo.userAuth.orgCode
    this.getEmployerUndertaker('1')//需求方单位清单
    // console.log(this.userInfo)
  },
  methods: {
    // 收起搜索条件
    packUp () {
      this.isPackUp = !this.isPackUp
    },
    reset () {
      const obj = {
        milestoneName: '', // 里程碑名称
        planEndTime: '', // 计划完成时间
        projectName: '', // 所属项目名称
        milestoneLeader: '', // 里程碑负责人
        demandUnitCode: '', // 需求单位
        commitmentUnitCode: '', // 承担单位
        projectCode: '', // 所属项目编码
        linkResultFlag: '' // 是否关联成果
      }
      if (this.disabledDemand) {
        obj.demandUnitCode = this.form.demandUnitCode
        this.changeDemand(obj.demandUnitCode)
      }
      if (this.disabledUndertake) {
        obj.commitmentUnitCode = this.form.commitmentUnitCode
        if (obj.commitmentUnitCode) {
          this.changeUndertake(obj.commitmentUnitCode)
        }
      }
      if (this.haveNum === 2) {
        obj.demandUnitCode = this.defaultUnitCode
        obj.commitmentUnitCode = ''
        this.changeDemand(obj.demandUnitCode)
      }
      this.form = obj
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    },
    getData () {
      if (this.form.demandUnitCode || this.form.commitmentUnitCode) {
        this.$refs.list.getData(true)
      } else {
        this.$message.error('需求单位和承担单位至少选择一个')
      }
    },
    // 获取 需求、承担 单位清单
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
            const codeArr = companyList.map(item => item.companyCode)
            const index = codeArr.indexOf(this.companyCode) // 当前登录人单位是否在清单中

            if (orgType === '1') { //需求方
              this.getEmployerUndertaker('2')
              this.demandUnitOptions = JSON.parse(JSON.stringify(companyList))
              if (index !== -1) {
                if (this.companyCode === 'hq') { // 如果是总部 需要多判断一步二级部门
                  companyList.forEach(item => {
                    if (item.organizationCode.substr(0, 8) === this.orgCode.substr(0, 8)) { // 判断二级部门
                      this.haveNum++
                      this.form.demandUnitCode = item.organizationCode
                      this.defaultUnitCode = item.organizationCode
                      this.demandName = item.organizationName
                    }
                  })
                } else {
                  this.haveNum++
                  this.form.demandUnitCode = companyList[index].organizationCode
                  this.defaultUnitCode = companyList[index].organizationCode
                  this.demandName = companyList[index].organizationName
                }
              }
            } else if (orgType === '2') { //承担方
              this.undertakerUnitOptions = JSON.parse(JSON.stringify(companyList))
              if (this.companyCode === 'hq') { // 如果是总部 需要多判断一步二级部门
                companyList.forEach(item => {
                  if (item.organizationCode.substr(0, 8) === this.orgCode.substr(0, 8)) { // 判断二级部门
                    this.haveNum++
                    if (!this.form.demandUnitCode) { // 需求单位有默认值 不能设置承担单位
                      this.form.commitmentUnitCode = item.organizationCode
                      this.defaultUnitCode = item.organizationCode
                      this.demandName = item.organizationName
                    }
                  }
                })
              } else {
                if (index !== -1) {
                  this.haveNum++
                  if (!this.form.demandUnitCode) { // 需求单位有默认值 不能设置承担单位
                    this.form.commitmentUnitCode = companyList[index].organizationCode
                    this.defaultUnitCode = companyList[index].organizationCode
                    this.undertakerName = companyList[index].organizationName
                  }
                }
              }
              this.disabledSelect()
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
    /**
     * 1. 当前登录人单位同时存在于需求单位清单和承担单位清单
     * 2. 需求单位选择了当前登录人单位 承担单位不能是当前登录人的单位
     * 3. 需求单位选择了非当前登录人单位 承担单位只能是当前登录人的单位
    */
      if (this.haveNum === 2) {
        let companyCode = ''
        let orgCode = ''
        this.demandUnitOptions.forEach(item => {
          if (val === item.organizationCode) {
            companyCode = item.companyCode
            this.demandName = item.organizationName
          }
          if (this.companyCode === 'hq') { // 如果是总部 需要多判断一步二级部门
            if (this.orgCode.substr(0, 8) === item.organizationCode.substr(0, 8)) {
              orgCode = item.organizationCode
            }
          } else if (item.companyCode === this.companyCode) {
            orgCode = item.organizationCode
          }
        })
        if (companyCode === 'hq' && this.orgCode.substr(0, 8) === orgCode.substr(0, 8)) {
          if (this.form.commitmentUnitCode.substr(0, 8) === orgCode.substr(0, 8)) {
            this.form.commitmentUnitCode = ''
          }
        } else if (this.companyCode === companyCode) {
          if (this.form.commitmentUnitCode === orgCode) {
            this.form.commitmentUnitCode = ''
          }
        } else {
          this.form.commitmentUnitCode = orgCode
        }
      }
    },
    // 承担单位 切换
    changeUndertake (val) {
    /**
     * 1. 当前登录人单位同时存在于需求单位清单和承担单位清单
     * 2. 承担单位选择了当前登录人单位 需求单位不能是当前登录人的单位
     * 3. 承担单位选择了非当前登录人单位 需求单位只能是当前登录人的单位
    */
      if (this.haveNum === 2) {
        let companyCode = ''
        let orgCode = ''
        this.undertakerUnitOptions.forEach(item => {
          if (val === item.organizationCode) {
            companyCode = item.companyCode
            this.undertakerName = item.organizationName
          }
          if (this.companyCode === 'hq') { // 如果是总部 需要多判断一步二级部门
            if (this.orgCode.substr(0, 8) === item.organizationCode.substr(0, 8)) {
              orgCode = item.organizationCode
            }
          } else if (item.companyCode === this.companyCode) {
            orgCode = item.organizationCode
          }
        })
        if (companyCode === 'hq' && this.orgCode.substr(0, 8) === orgCode.substr(0, 8)) {
          if (this.form.demandUnitCode.substr(0, 8) === orgCode.substr(0, 8)) {
            this.form.demandUnitCode = ''
          }
        } else if (this.companyCode === companyCode) {
          if (this.form.demandUnitCode === orgCode) {
            this.form.demandUnitCode = ''
          }
        } else {
          this.form.demandUnitCode = orgCode
        }
      }
    },
    // 单位选择下拉 禁用判断
    disabledSelect () {
      // console.log(this.haveNum)
      // 登录人所在单位在两个清单中 都不禁用
      if (this.haveNum === 2) return
      // 登录人所在单位不在清单中，清空清单
      if (this.haveNum === 0) {
        this.demandUnitOptions = []
        this.form.demandUnitCode = ''
        this.undertakerUnitOptions = []
        this.form.commitmentUnitCode = ''
        return
      }
      // 登录人所在单位在一个清单中 禁用所在清单
      if (this.form.demandUnitCode) { // 需求
        this.disabledDemand = true
      } else if (this.form.commitmentUnitCode) { // 承担
        this.disabledUndertake = true
      }
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
