<template>
  <div class="team-info">
    <project-panel title="团队信息" @changeExpand="changeExpand" :show-expand="showExpand">
      <div class="team-body">
        <el-form
          :model="teamInfoForm"
          ref="teamInfoForm"
          label-width="130px">
          <el-form-item label="项目经理:" prop="manageList">
            <div class="row-item">
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.manageList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.manageList"
                    :key="item.userAccount"
                    :class="{'highlightStyle':item.highlightProp}">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.userAccount"
                      placement="top-start"
                      size="small">
                      <span> {{ item.userName }}</span>
                    </el-tooltip>
                    <span v-if="index !== teamInfoForm.manageList.length-1">；</span>
                  </el-tag>
                </template>
                <span v-else class="placeholder"></span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="项目成员:" prop="memberList">
            <div class="row-item">
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.memberList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.memberList"
                    :key="item.userAccount"
                    :class="{'highlightStyle':item.highlightProp}">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.userAccount"
                      placement="top-start"
                      size="small">
                      <span> {{ item.userName }}</span>
                    </el-tooltip>
                    <span v-if="index !== teamInfoForm.memberList.length-1">；</span>
                  </el-tag>
                </template>
                <span v-else class="placeholder"></span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="项目观察员:" prop="observerList">
            <div class="row-item">
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.observerList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.observerList"
                    :key="item.userAccount"
                    :class="{'highlightStyle':item.highlightProp}">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.userAccount"
                      placement="top-start"
                      size="small">
                      <span> {{ item.userName }}</span>
                    </el-tooltip>
                    <span v-if="index !== teamInfoForm.observerList.length-1">；</span>
                  </el-tag>
                </template>
                <span v-else class="placeholder"></span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="专家:" prop="expertList">
            <div class="row-item">
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.expertList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.expertList"
                    :key="item.userAccount"
                    :class="{'highlightStyle':item.highlightProp}">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.userAccount"
                      placement="top-start"
                      size="small">
                      <span> {{ item.userName }}</span>
                    </el-tooltip>
                    <span v-if="index !== teamInfoForm.expertList.length-1">；</span>
                  </el-tag>
                </template>
                <span v-else class="placeholder"></span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </project-panel>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_projectInfo'
import { mapGetters } from 'vuex'
export default {
  components: { projectPanel },
  data () {
    return {
      teamInfoForm: {
        manageList: [],
        memberList: [],
        observerList: [],
        expertList: []
      },
      roleList: [
        { name: '项目经理', selfName: 'manage', valueCode: 'PR-MANAGER' },
        { name: '项目成员', selfName: 'member', valueCode: 'PR-MEMBER' },
        { name: '项目观察员', selfName: 'observer', valueCode: 'PR-PROJECT-OBSERVER' },
        { name: '专家', selfName: 'expert', valueCode: 'PR-EXPERT' }
      ]
    }
  },
  props: {
    //详情接收数据
    receiveData: {
      type: Array,
      default: () => []
    },
    showExpand: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val.length > 0) {
          this.getRoleType()
        }
      }
    }
  },
  methods: {
    getRoleType () {
      API.dictValByCode('PROJECT-ROLE')
        .then(res => {
          this.roleList.forEach(ele => {
            res.some(item => {
              if (item.name === ele.name) {
                ele.valueCode = item.valueCode
                ele.id = item.id
                return true
              }
            })
          })
          this.analyzeData()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '数据字典获取失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    analyzeData () {
      this.teamInfoForm = {
        manageList: [],
        memberList: [],
        observerList: [],
        expertList: []
      }
      this.receiveData.forEach(item => {
        this.roleList.some(role => {
          if (role.valueCode === item.projectRoleCode) {
            this.teamInfoForm[`${role.selfName}List`].push(item)
            return true
          }
        })
      })
    },
    changeExpand (isExpand) {
      this.$emit('changeExpand', isExpand)
    }
  },
  mounted () {
  },
  created () {

  }
}
</script>
<style lang="scss" scoped>
.team-info{
  margin-top: 20px;
  background: #ffffff;
  .team-body{
    /deep/ .el-form-item__label{
      height: 25px;
      line-height: 25px;
    }
    .row-item{
      min-height: 25px;
      line-height: 25px;
      // border: 1px solid #E5E5E5;
      // border-radius: 2px;
      .el-tag{
        background: none;
        border: none;
        font-size: 14px;
        color: #333;
        height: 25px;
        line-height: 25px;
        padding-right: 0;
      }
      .placeholder{
        color: #999;
        padding-left: 10px;
      }
      .highlightStyle{
        color: #FF3F3B;
      }
    }
  }
}
</style>
