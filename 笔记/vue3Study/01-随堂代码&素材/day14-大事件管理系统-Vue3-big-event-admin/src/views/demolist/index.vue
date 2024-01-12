<template>
  <div class="storagecheck__list">
    <div class="storagecheck__list__search">
      <!-- 电站资产过户 -->
      <search-comp
        ref="formComp"
        :search-props="queryList"
        :size="size"
        :initValues="queryParam"
        @handleConfirm="handleConfirm"
        @handleClear="handleClear"
        @onSelectSearch="onSelectSearch"
      ></search-comp>
    </div>
    <div class="demandforecast__list">
      <!-- <a-button type="primary" style="margin-right: 10px">批量导入</a-button>
      <a-button type="primary">下载模板</a-button> -->
      <XDownLowCode
        v-if="
          detailConfig[pageTypeParam] &&
            detailConfig[pageTypeParam].exportList &&
            detailConfig[pageTypeParam].exportList.length &&
            !pageTypeIsTab
        "
        :importList="detailConfig[pageTypeParam].importList"
        :exportList="detailConfig[pageTypeParam].exportList"
        @importSuccess="importSuccess"
      >
      </XDownLowCode>
    </div>
    <div class="storage__list__wrap">
      <table-comp
        :columns="columns"
        :dataSource="tableData"
        :rowKey="(record, index) => index + 'key'"
        :extraProps="extraProps"
        :slots="slots"
        :events="events"
      ></table-comp>
    </div>
  </div>
</template>
<script>
import { TableComp, SearchComp } from '@/components'
import { newTabOpenPage } from '@/utils/util'
import { getStorageList } from '@/api/storeManage/index'
import { SUCCESS } from '@/assets/js/responseCode'
import { businessParams } from '@/assets/js/const'
import { getListData1 } from '@/api/cwApi/index'
import { getListDataNew } from '@/api/spare/index'
// handleRequestParams
import { getAreaList } from '@/api/modular/system/areaManage'
import moment from 'moment'
import { detailConfig } from '../../components/tableIndex/components/apiUrl'
const XDownLowCode = () => import('@/components/xnComponents/XDownLowCode')
export default {
  props: {
    size: {
      type: String,
      default: 'default'
    },
    pageType: {
      type: String,
      default: 'PAGE'
    }
  },
  components: {
    TableComp,
    SearchComp,
    XDownLowCode
  },
  data() {
    return {
      pageTypeParam: 'spare_warehouse_stock_record',
      pageTypeIsTab: false,
      detailConfig,
      addWarehouseBtnProps: {
        empty: {
          type: 'normal',
          text: '取消'
        },
        confirm: {
          text: '确定'
        }
      },
      queryParam: {},
      queryList: {
        insureCode: { label: 'insureCode', labelName: '申请编号', type: 'text' },
        stationNo: {
          label: 'stationNo',
          labelName: '电站资产编号',
          type: 'text'
        },
        serviceProviderNo: {
          label: 'serviceProviderNo',
          labelName: '运维合作方',
          type: 'search_select',
          dataList: [],
          replaceFileds: {
            text: 'serviceProviderName',
            value: 'serviceProviderNo'
          }
        },
        customerName: {
          label: 'customerName',
          labelName: '业主姓名',
          type: 'text'
        },
        transferTypeCode: {
          label: 'transferTypeCode',
          labelName: '过户类型',
          type: 'select',
          dataList: [
            { value: '10', text: '继承' },
            { value: '20', text: '转让' },
            { value: '30', text: '分家' },
            { value: '40', text: '其他' }
          ]
        },
        createTimeStart: {
          label: 'createTimeStart',
          labelName: '申请时间',
          type: 'range',
          format: 'YYYY-MM-DD HH:mm:ss',
          extraProps: {
            showTime: {
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
            },
            width: {
              formElementWidth: 320
            }
          }
        },
        statusCode: {
          label: 'statusCode',
          labelName: '申请状态',
          type: 'select',
          dataList: [
            { value: 'WAITING_SUBMIT', text: '待提交' },
            { value: 'APPROVING', text: '审批中' },
            { value: 'APPROVE_PASS', text: '审批通过' },
            { value: 'REJECT', text: '审批驳回' }
          ]
        }
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          scopedSlots: { customRender: 'index' },
          align: 'center'
        },
        {
          title: '申请编号',
          dataIndex: 'changeCode',
          key: 'changeCode',
          align: 'center'
        },
        {
          title: '电站资产编号',
          dataIndex: 'stationNo',
          key: 'stationNo',
          align: 'center'
        },
        {
          title: '运维合作方',
          dataIndex: 'serviceProviderNo',
          key: 'serviceProviderNo',
          align: 'center'
        },
        {
          title: '业主姓名',
          dataIndex: 'customerName',
          key: 'customerName',
          align: 'center'
        },
        {
          title: '过户类型',
          dataIndex: 'transferTypeDesc',
          key: 'transferTypeDesc',
          align: 'center'
        },
        {
          title: '变更原因',
          dataIndex: 'changeReason',
          key: 'changeReason',
          align: 'center'
        },
        {
          title: '申请时间',
          dataIndex: 'premium',
          key: 'premium',
          align: 'center'
        },
        {
          title: '申请状态',
          dataIndex: 'statusDesc',
          key: 'statusDesc',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          key: 'operation',
          width: '170px',
          align: 'center',
          fixed: 'right'
        }
      ],
      editInfo: {},
      tableData: [],
      extraProps: {
        loading: true,
        size: 'middle',
        pagination: {
          pageSize: 10,
          current: 1,
          total: 0,
          showTotal: (total) => `共${total}条`
        }
      },
      slots: [
        {
          slotName: 'operation',
          slotContent: [
            {
              component: 'a-Button',
              props: {
                type: 'link'
              },
              // permission: 'powerStationClaim:add',
              text: '详情',
              clickHandler: this.gotoStockSpareDetail
            }
          ]
        }
      ],
      events: {
        change: (pagination) => {
          this.$set(this.extraProps.pagination, 'current', pagination.current)
          this.getStorageListData({
            pageNo: pagination.current
          })
        }
      }
    }
  },
  methods: {
    onSelectSearch(value, key) {
      const targetParams = {
        pageNo: 1,
        pageSize: 20,
        type: 'PARTNER',
        partnerType: 'OPERATION',
        serviceProviderName: value || ''
      }
      getListDataNew('/admin/erp/serviceProvider/list', 'GET', {
        params: targetParams
      }).then((res) => {
        if (res.code === '0000') {
          const finalData = res.data.data
          this.$set(this.queryList[key], 'dataList', finalData)
        }
      })
    },
    importSuccess(val) {
      if (val) {
        this._refreshFn()
      }
    },
    gotoStockSpareDetail(record) {
      record.stockSpareNo = 'D23120400019'
      if (record.statusCode === 'LOSE_EFFECTIVE') {
        this.$message.error('此状态不支持操作')
        return
      }
      const url = '/powerAssetChangeDetail?entryType=2&entryInfo=' + encodeURIComponent(JSON.stringify(record))
      newTabOpenPage(url)
    },
    getStorageListData(opt) {
      let targetParams = {
        ...this.queryParam,
        pageNo: this.extraProps.pagination.current,
        pageSize: this.extraProps.pagination.pageSize
      }
      if (opt && Object.keys(opt).length > 0) {
        targetParams = {
          ...targetParams,
          ...opt,
          changeTypeCode: 'TRANSFER'
        }
        if (targetParams.createTimeStart) {
          targetParams.createTimeEnd = targetParams.createTimeStart[1].format('YYYY-MM-DD HH:mm:ss')
          targetParams.createTimeStart = targetParams.createTimeStart[0].format('YYYY-MM-DD HH:mm:ss')
        }
      }
      this.extraProps.loading = true
      getListDataNew('/szyw/api/power/powerAssetChangeRecord/page', 'GET', {
        params: targetParams
      })
        .then((res) => {
          if (res.code === SUCCESS) {
            this.$set(this.extraProps.pagination, 'current', res.data.pageNo)
            const list = res.data?.rows || []
            list.forEach((item) => {
              item.serviceProviderNo = `${item.provinceName} ${item.cityName} ${item.areaName} ${item.townName}`
            })
            this.$set(this, 'tableData', list)
            this.$set(this.extraProps.pagination, 'total', res.data?.totalRows)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          console.log('getStorageList', err)
        })
        .finally(() => {
          this.extraProps.loading = false
        })
    },
    handleConfirm(data) {
      this.queryParam = data
      this.getStorageListData({
        ...data,
        pageNo: 1
      })
    },
    handleClear() {
      this.extraProps.pagination.current = 1
      // this.queryParam = {
      //   insureTypeCode: 'PUBLIC_LIABILITY_INSURANCE'
      // }
    },
    _refreshFn() {
      this.getStorageListData({
        pageNo: 1
      })
    }
  },
  created() {
    const requestParams = {
      pageNo: 1
    }
    // this.queryParam = {
    //   insureTypeCode: 'PUBLIC_LIABILITY_INSURANCE'
    // }
    // 获取地址信息
    this.onSelectSearch('', 'serviceProviderNo')
    this.getStorageListData(requestParams)
  }
}
</script>
<style lang="less" scoped>
.storagecheck__list {
  background: #fff;
  .demandforecast__list {
    box-sizing: border-box;
    padding: 0 0 10px 20px;
  }
  .storage__list__wrap {
    padding: 0 16px;
    background: #fff;
    & > h3 {
      border-bottom: 1px solid #e1e1e1;
      padding: 2px 0 14px;
      margin-bottom: 20px;
    }
    /deep/ .ant-table {
      td {
        max-width: 320px;
      }
    }
  }
  .storagecheck__list__search {
    background: #fff;
    padding: 16px 16px 12px;
    .ant-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
