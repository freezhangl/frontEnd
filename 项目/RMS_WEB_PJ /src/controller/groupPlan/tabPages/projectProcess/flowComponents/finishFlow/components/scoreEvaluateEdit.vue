<!-- 结项流程-打分和评价组件 -->
<template>
  <div class="wrapper">
    <div>
      <p>请对承担单位进行打分和评价：</p>
      <el-form :rules="rules">
        <el-table :data="data.groupFinishScoreUndertakeList">
          <el-table-column
            prop="undertakeOrganizationName"
            label="承担单位"
            align="center"
            header-align="center"
            min-width="25%">
            <template slot="header">
              <el-form-item label="承担单位" prop="undertake" class="company-item"></el-form-item>
            </template>
            <template slot-scope="scope">
              <span>{{scope.row.undertakeOrganizationName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            min-width="25%"
            align="center"
            header-align="center"
            label="分数">
            <template slot="header">
              <el-form-item label="分数" prop="score"></el-form-item>
            </template>
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.score"
                @input="inputHandler(scope)"
                @change="setInputValue(scope)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="评价"
            min-width="50%">
            <template slot="header">
              <el-form-item label="评价" prop="content"></el-form-item>
            </template>
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.content"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 6}"
                maxlength="200"
                show-word-limit></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div>
      <p>请对联合攻关单位进行打分和评价：</p>
      <el-form :rules="rules">
        <el-table :data="data.groupFinishScoreUniteAssaultList">
          <el-table-column
            prop="uniteAssaultOrganizationName"
            label="联合攻关单位"
            align="center"
            header-align="center"
            min-width="25%">
            <template slot="header">
              <el-form-item label="联合攻关单位" prop="joint" class="company-item"></el-form-item>
            </template>
            <template slot-scope="scope">
              <span>{{scope.row.uniteAssaultOrganizationName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            min-width="25%"
            align="center"
            header-align="center"
            label="分数">
            <template slot="header">
              <el-form-item label="分数" prop="score"></el-form-item>
            </template>
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.score"
                @input="inputHandler(scope)"
                @change="setInputValue(scope)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="评价"
            min-width="50%">
            <template slot="header">
              <el-form-item label="评价" prop="content"></el-form-item>
            </template>
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.content"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 6}"
                maxlength="200"
                show-word-limit></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div class="scope-referal">
      <span>
        打分标准：
      </span>
      <div class="referal">
        <p>
          <span>95-100：优秀</span>
          <span>80-89：合格</span>
        </p>
        <p>
          <span>90-94分：良好 </span>
          <span>80分以下：待改进</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/serve/API_businessFlow'
export default {
  props: {
    data: Object,
    processParams: Object,
    budgetData: Object
  },
  data () {
    return {
      ruleForm: {},
      rules: {
        demand: { required: true }, // 需求单位
        undertake: { required: true }, // 承担单位
        joint: { required: true }, // 联合攻关单位
        score: { required: true }, // 分数
        content: { required: true } // 评价
      }
    }
  },

  components: {},

  computed: {

  },

  mounted () {

  },

  methods: {
    // 打分限制位数
    inputHandler (scope) {
      let temp = scope.row.score
      if (!temp) return
      if (temp === '.') temp = '0.'
      let tempArr = temp.toString()
        .split('.')
      if (tempArr.length > 2) { // 防止输入多个点
        tempArr = [tempArr[0], tempArr[1]]
        temp = tempArr.join('.')
      }
      if (tempArr[1] && tempArr[1].length > 2) { // 保留两位小数
        tempArr[1] = tempArr[1].substr(0, 2)
        temp = tempArr.join('.')
      }
      if (temp > 100) temp = '100'
      if (temp < 0) temp = '0'
      scope.row.score = temp.replace(/[^\d.]/g, '')
    },
    setInputValue (scope) {
      if (isNaN(scope.row.score)) return '0'
      scope.row.score = parseFloat(scope.row.score) || '0'
    },
    // 打分提交
    async addFinishScore () {
      let isPass = await this.validate()
      if (!isPass) return
      let param = {
        // projectCode: this.$route.query.projectCode || this.budgetData.projectCode,
        // approveNo: this.$route.query.approveNo || this.processParams.businessSerialNumber,
        ...this.data
      }
      return new Promise((resolve, reject) => {
        API.addFinishScore(param)
          .then(res => {
            // if (res) {
            resolve(true)
            // }
            // console.log(res)
          })
          .catch(e => {
            this.loading = false
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '提交失败，请稍后重试！',
                type: 'error',
                showClose: true
              })
            }
          })
      })
    },
    validate () {
      let isPass = true
      this.$props.data.groupFinishScoreUndertakeList.forEach(element => {
        if (typeof parseInt(element.score) === 'number' && element.content) {
          element.score = element.score.toString()
          element.content = element.content.toString()
          if (!element.score.trim() || !element.content.trim()) {
            isPass = false
          }
        } else {
          isPass = false
        }
        element.projectCode = this.$route.query.projectCode || this.budgetData.projectCode
        element.approveNo = this.$route.query.approveNo || this.processParams.businessSerialNumber
      })
      this.$props.data.groupFinishScoreUniteAssaultList.forEach(element => {
        if (typeof parseInt(element.score) === 'number' && element.content) {
          element.score = element.score.toString()
          element.content = element.content.toString()
          if (!element.score.trim() || !element.content.trim()) {
            isPass = false
          }
        } else {
          isPass = false
        }
        element.projectCode = this.$route.query.projectCode || this.budgetData.projectCode
        element.approveNo = this.$route.query.approveNo || this.processParams.businessSerialNumber
      })
      if (!isPass) {
        this.$message({
          showClose: true,
          message: '请填写完整的打分信息',
          type: 'warning'
        })
      }
      return isPass
    }
  }
}

</script>
<style lang='scss' scoped>
.wrapper{
  padding: 20px 30px;
  background:#fff;
  margin-top: 30px;
}
.el-form{
  .el-form-item{
    margin:0;
    &.company-item /deep/ .el-form-item__label{
      float:none;
    }
  }
  .el-table{
    border:1px solid #e5e5e5;
    border-bottom:none;
    /deep/{
      th{
        padding:0;
      }
    }
  }
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
.scope-referal{
  display: flex;
  margin-top: 15px;
  .referal{
    display: flex;
  }
  p{
    margin:0;
    display: flex;
    margin-right: 45px;
    flex-direction: column;
    span{
      margin-bottom: 10px;
    }
  }
}
.el-table .el-input /deep/ .el-input__inner{
  padding-right:60px;
}
</style>
