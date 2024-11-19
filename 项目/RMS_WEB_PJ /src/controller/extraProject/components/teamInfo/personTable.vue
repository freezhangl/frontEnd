<template>
  <div class="person-list">
    <el-form :inline="true" :model="personForm">
      <el-form-item label="员工姓名：">
        <el-input v-model.trim="personForm.userNameLike" placeholder="请输入" clearable >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="用户账号：">
        <el-input v-model.trim="personForm.uid" placeholder="请输入" clearable >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item>
      <el-form-item class="search-btn">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="search"
          class="primary-button">查 询</el-button>
        <el-button
          icon="el-icon-refresh-left"
          @click="reset"
          class="normal-btn">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="person-list-table">
      <self-table
        :table-data="personList"
        :table-cols="personTableCols"
        :loading="personTableLoading"
        :is-pagination="true"
        :is-selection="true"
        :pagination="{ pageSize: personForm.pageSize, pageNum: personForm.pageNum, total: personForm.pageTotal }"
        @refresh="getList"
        @select="seclectRow"></self-table>
    </div>
  </div>
</template>

<script>
import SelfTable from '@/components/table'
import API from '@/serve/API_project'
export default {
  name: 'personTable',
  components: { SelfTable },
  data () {
    return {
      personForm: {
        userNameLike: '', //员工姓名
        uid: '', //员工工号
        uids: [],
        pageNum: 1, // 页码
        pageSize: 10, // 分页
        pageTotal: 0 // 总页数
      }, //查询条件
      personList: [], //角色所包含人员列表
      personTableCols: [
        {
          label: '用户账号',
          prop: 'uid',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '员工姓名',
          prop: 'chineseName',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '职位',
          prop: 'position',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '部门',
          prop: 'companyName',
          align: 'left',
          overflow: true,
          resizable: false
        }
      ], //人员列表配置项
      personTableLoading: false, // 人员列表加载提示
      selectedPerson: []
    }
  },
  props: {
    excludeUser: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 查询角色包含人员
    getList (pageNum = this.personForm.pageNum, pageSize = this.personForm.pageSize) {
      this.selectedPerson = []
      this.personTableLoading = true
      let uids = this.excludeUser.map(item => item.userAccount)
      let params = {
        uid: this.personForm.uid,
        userNameLike: this.personForm.userNameLike,
        currentPage: pageNum,
        pageSize: pageSize,
        uids: uids.join(',')
      }
      this.personForm.pageNum = pageNum
      this.personForm.pageSize = pageSize
      API.queryUserList(params)
        .then(res => {
          this.personList = res.records
          this.personForm.pageTotal = parseInt(res.total)
          this.personTableLoading = false
        })
        .catch(e => {
          this.personTableLoading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '获取人员列表失败',
            type: 'error',
            showClose: true
          })
        })
    },
    // 重置查询列表
    reset () {
      this.personForm.userNameLike = ''
      this.personForm.uid = ''
      this.personForm.pageNum = 1
      this.personForm.pageSize = 10
      this.personForm.pageTotal = 0
      this.getList()
    },
    // 查询
    search () {
      this.personForm.pageNum = 1
      this.getList()
    },
    //选择行
    seclectRow (rows, row) {
      this.selectedPerson = rows
    },
    getSeclectedPerson () {
      let persons = this.selectedPerson.map(item => {
        return {
          userName: item.chineseName,
          employeeNum: item.employeeNum,
          userAccount: item.uid
        }
      })
      return persons
    }
  },

  mounted () {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
  .person-list {
    padding: 0 10px;
    .primary-button {
      height: 30px;
    }
    .search-btn{
      width: 180px;
      float: right;
      margin-right: 0;
    }
  }
</style>
