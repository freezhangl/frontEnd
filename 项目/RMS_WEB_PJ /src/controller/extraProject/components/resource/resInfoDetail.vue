<template>
  <div class="res-info-detail">
    <project-panel title="资源信息">
      <div class="res-info-body">
        <div class="select">
          <el-row>
            <el-col :span="12">
              <span style="padding-left: 12px;">是否需要EP资源：</span><span :class="{'highlightStyle':receiveData.highlightProps && receiveData.highlightProps.needEpResource}">{{needEpResource=='1' ? '是' : '否'}}</span>
            </el-col>
            <el-col :span="12">
              是否交维：<span :class="{'highlightStyle':receiveData.highlightProps && receiveData.highlightProps.deliveryMaintenance}">{{deliveryMaintenance=='1' ? '是' : '否'}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="list">
          <res-table-detail resource-type='virtual' title="虚拟机资源" :receive-data="virtualRes"></res-table-detail>
          <res-table-detail resource-type='physical' title="物理机资源" :receive-data="physicalRes"></res-table-detail>
          <res-table-detail resource-type='storage' title="存储资源" :receive-data="storageRes"></res-table-detail>
        </div>

      </div>
    </project-panel>
  </div>
</template>

<script>
import resTableDetail from './resTableDetail.vue'
import projectPanel from '@/controller/components/projectPanel'
export default {
  components: { resTableDetail, projectPanel },
  data () {
    return {
      needEpResource: '',
      deliveryMaintenance: '',
      virtualRes: [],
      physicalRes: [],
      storageRes: []
    }
  },
  props: {
    receiveData: { type: Object, default: () => {} }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.needEpResource = val.needEpResource
          this.deliveryMaintenance = val.deliveryMaintenance
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
          }
        }
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.res-info-detail{
  .res-info-body{
    .select{
      padding-bottom: 20px;
    }
    .list {
      padding: 0 12px;
    }
  }

  .highlightStyle{
    color: #FF3F3B;
  }
}
</style>
