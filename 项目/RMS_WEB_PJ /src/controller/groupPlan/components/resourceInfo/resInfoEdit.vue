<template>
  <div class="res-info-edit">
    <project-panel title="资源信息" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button class="normal-btn" @click="saveResInfo" v-if='!meberEditFlag'>保存本区块信息</el-button>
      </template>

      <div class="res-info-body">
        <el-form
          :model="selectForm"
          :rules="selectRules"
          label-position='right'
          ref="selectForm"
          label-width="90px">
          <el-row>
            <el-col :span="12">
              <el-form-item
                label-width="140px"
                label="是否需要EP资源："
                prop="needEpResource">
                <el-select
                  v-model="selectForm.needEpResource"
                  placeholder="请选择"
                  :disabled="meberEditFlag"
                  @change="changeInfo(true)">
                  <el-option
                    v-for="item in needEPResOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label-width="130px"
                label="是否交维："
                prop="deliveryMaintenance">
                <el-select
                  v-model="selectForm.deliveryMaintenance"
                  placeholder="请选择"
                  :disabled="meberEditFlag"
                  @change="changeInfo(true)">
                  <el-option
                    v-for="item in toOperateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <res-tablel-edit
          ref="virtual"
          resource-type='virtual'
          title="虚拟机资源"
          :receive-data="virtualRes"
          :env-options="virtualEnvOptions"
          @change="changeInfo"></res-tablel-edit>
        <res-tablel-edit
          ref="physical"
          resource-type='physical'
          title="物理机资源"
          :receive-data="physicalRes"
          :env-options="physicalEnvOptions"
          @change="changeInfo"></res-tablel-edit>
        <res-tablel-edit
          ref="storage"
          resource-type='storage'
          title="存储资源"
          :receive-data="storageRes"
          :env-options="storageEnvOptions"
          @change="changeInfo"></res-tablel-edit>
      </div>
    </project-panel>
  </div>
</template>

<script>
import resTablelEdit from './resTablelEdit.vue'
import projectPanel from '@/controller/components/projectPanel'
import bus from '@/common/bus'
import API from '@/serve/API_groupPlanProject'
export default {
  components: { resTablelEdit, projectPanel },
  data () {
    return {
      meberEditFlag: false,
      selectForm: {
        needEpResource: '',
        deliveryMaintenance: ''
      },
      selectRules: {
        needEpResource: [{ required: true, message: '请选择是否需要EP资源', trigger: ['change', 'blur'] }],
        deliveryMaintenance: [{ required: true, message: '请选择是否交维', trigger: ['change', 'blur'] }]
      },
      needEPResOptions: [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ],
      toOperateOptions: [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ],
      virtualRes: [],
      physicalRes: [],
      storageRes: [],
      virtualEnvOptions: [], //环境 数据字典值集
      physicalEnvOptions: [], //环境 数据字典值集
      storageEnvOptions: [], //环境 数据字典值集
      language: '资源信息中所有可编辑字段都是基线字段' //基线提示语
    }
  },
  props: {
    receiveData: { type: Object, default: () => {} },
    tipLanguage: { type: Boolean, default: false },
    projectCode: { type: String, default: '' }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.selectForm.needEpResource = val.needEpResource
          this.selectForm.deliveryMaintenance = val.deliveryMaintenance
          if (val.resourceDetailInfoList && val.resourceDetailInfoList.length) {
            this.virtualRes = []
            this.physicalRes = []
            this.storageRes = []
            val.resourceDetailInfoList.forEach(res => {
              switch (res.resourceType) {
                case 'RT_VIRTUAL':
                  this.virtualRes.push(res)
                  break
                case 'RT_PHYSICAL':
                  this.physicalRes.push(res)
                  break
                case 'RT_STORAGE':
                  this.storageRes.push(res)
                  break
              }
            })
            this.setData(this.virtualRes, this.virtualEnvOptions)
            this.setData(this.physicalRes, this.physicalEnvOptions)
            this.setData(this.storageRes, this.storageEnvOptions)
          }
        }
      }
    },
    tipLanguage: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.language = '资源信息中所有可编辑字段都是基线字段；'
        } else {
          this.language = '资源信息中没有基线字段；'
        }
      }
    }
  },
  mounted () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
  },
  async created () {
    await this.getDic()
  },
  methods: {
    //暂存
    async saveResInfo () {
      if (!this.projectCode) {
        this.$message({
          message: '请先保存基本信息',
          type: 'warning',
          showClose: true
        })
        return
      }
      let params = await this.validate()
      if (!params) return
      API.batchEditProjectResourceInfo(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '资源信息保存成功',
            showClose: true
          })
          this.changeInfo(false)
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '资源信息保存失败',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //校验表格
    async validate () {
      return new Promise(async (resolve, reject) => {
        let virtual = await this.$refs['virtual'].validate()
        let physical = await this.$refs['physical'].validate()
        let storage = await this.$refs['storage'].validate()
        this.$refs['selectForm'].validate(valid => {
          if (valid && virtual && physical && storage) {
            let virtualList = virtual.map(item => {
              return {
                resourceInfoCode: item.resourceInfoCode,
                projectCode: this.projectCode,
                resourceType: 'RT_VIRTUAL',
                resourceEnvironment: item.resourceEnvironment,
                cpuCoreNumber: item.cpuCoreNumber,
                ramSize: item.ramSize,
                hardDiskSize: item.hardDiskSize
              }
            })
            let physicalList = physical.map(item => {
              return {
                resourceInfoCode: item.resourceInfoCode,
                projectCode: this.projectCode,
                resourceType: 'RT_PHYSICAL',
                resourceEnvironment: item.resourceEnvironment,
                cpuCoreNumber: item.cpuCoreNumber,
                ramSize: item.ramSize,
                hardDiskSize: item.hardDiskSize
              }
            })
            let storageList = storage.map(item => {
              return {
                resourceInfoCode: item.resourceInfoCode,
                projectCode: this.projectCode,
                resourceType: 'RT_STORAGE',
                resourceEnvironment: item.resourceEnvironment,
                nsaCapacity: item.nsaCapacity,
                objectStorageCapacity: item.objectStorageCapacity
              }
            })
            let params = {
              projectCode: this.projectCode,
              needEpResource: this.selectForm.needEpResource,
              deliveryMaintenance: this.selectForm.deliveryMaintenance,
              resourceDetailInfoList: virtualList.concat(physicalList)
                .concat(storageList)
            }
            resolve(params)
          } else {
            resolve(false)
            return false
          }
        })
      })
    },
    //有信息发生修改
    changeInfo (edited = true, msg = false) {
      let params = {
        curBlock: 'resourceInfo',
        hasEdited: edited,
        onlyShowMsg: msg
      }
      bus.$emit('groupPlanProjectEdit', params)
    },
    //处理数据
    setData (data, envOptions) {
      data.forEach(ele => {
        this.$set(ele, 'state', 'detail') //默认获取数据为详情展示
        envOptions.some(opt => {
          if (opt.valueCode === ele.resourceEnvironment) { //已经存在某环境
            opt.disabled = true
            return true
          }
        })
      })
    },
    //获取环境下拉值集
    getDic () {
      API.dictValByCodes({ codes: 'RESOURCE_ENVIRONMENT' })
        .then(res => {
          res.forEach(dicItem => {
            switch (dicItem.code) {
              case 'RESOURCE_ENVIRONMENT':
                let envOptions = dicItem.dictionarys
                envOptions.forEach(ele => {
                  this.$set(ele, 'disabled', false)
                })
                this.virtualEnvOptions = JSON.parse(JSON.stringify(envOptions))
                this.physicalEnvOptions = JSON.parse(JSON.stringify(envOptions))
                this.storageEnvOptions = JSON.parse(JSON.stringify(envOptions))
                break
            }
          })
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.res-info-edit{
  /deep/.el-form-item__error{
    right: inherit!important;
    left: 85px!important;
  }
}
</style>
