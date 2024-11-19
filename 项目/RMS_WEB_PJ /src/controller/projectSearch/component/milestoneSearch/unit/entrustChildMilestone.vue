<template>
  <!-- 委托项目-单位子项目里程碑 -->
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
        <el-form-item :label="'里程碑责任人：'">
          <el-input placeholder="请输入里程碑责任人" v-model.trim="form.milestoneLeader"></el-input>
        </el-form-item>
        <el-form-item :label="'所属项目编码：'">
          <el-input placeholder="请输入所属项目编码" v-model.trim="form.projectCode"></el-input>
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
      type="unit-entrustChildMilestone"
      :form="form"></list>
  </div>
</template>

<script>
import list from '../components/list'
export default {
  components: { list },
  data () {
    return {
      options: [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ],
      form: {
        milestoneName: '', // 里程碑名称
        planEndTime: '', // 计划完成时间
        projectName: '', // 所属项目名称
        linkResultFlag: '', // 是否关联成果
        projectCode: '', // 所属项目编码
        milestoneLeader: '' // 里程碑责任人
      },
      reload: true,
      isPackUp: false // 收起
    }
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
        planEndTime: '', // 计划完成时间
        projectName: '', // 所属项目名称
        linkResultFlag: '', // 是否关联成果
        projectCode: '', // 所属项目编码
        milestoneLeader: '' // 里程碑责任人
      }
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    },
    getData () {
      this.$refs.list.getData(true)
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
