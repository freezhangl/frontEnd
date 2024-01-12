const urlConfig = {
}
const detailConfig = {
  spare_warehouse_stock_record: {
    detailUrl: '',
    importList: [{ url: '/spare/spareWarehouseStockRecord/importExcelAsync', text: '批量导入', methods: 'POST', permission: 'spareWarehouseStockRecord:importExcel', showProgress: true }],
    exportList: [{ url: '/spare/spareWarehouseStockRecord/download/template', text: '下载模板', methods: 'GET', permission: 'spareWarehouseStockRecord:download:template' },
    { url: '/spare/spareWarehouseStockRecord/export', text: '导出', methods: 'GET', needQuery: true, needIdlist: true, permission: 'spareWarehouseStockRecord:export' }]
  },
  publicLiabilityInsurance: {
    detailUrl: '',
    importList: [{ url: '/power/powerStationInsure/importExcel?insureType=PUBLIC_LIABILITY_INSURANCE', text: '批量导入', methods: 'POST', selfUrl: true }],
    exportList: [{ url: '/power/powerStationInsure/download/template?insureType=PUBLIC_LIABILITY_INSURANCE', text: '下载模板', methods: 'GET' }]
  }
}
const businessTypeObj = {
  spare_operation_order: 'OPERATION_ORDER',
  spare_warehouse: 'WAREHOUSE',
  wms_warehouse: 'WMS_WAREHOUSE'
}
export {
  urlConfig, detailConfig, businessTypeObj
}
