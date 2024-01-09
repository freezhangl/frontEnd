export const pictureType = ['jpeg', 'jpg', 'png', 'gif']
export const ThreeModelType = ['.json', '.obj', '.dae', '.ply', '.gltf', '.stl', '.fbx', '.stp', '.step', '.STP', '.STEP']
export const pictureFormatType = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg']
export const TransfomModelType = ['.obj', '.stl', '.fbx', '.iges', '.step', '.stp']
export const VideoType = ['.mp4', '.m4v', '.mov']
export const VideoFormatType = ['video/mp4', 'video/m4v']

export const handlefileTypeClassifyByType = (fileType) => {
  if (ThreeModelType.includes(fileType)) {
    return 'threed'
  } else if (VideoFormatType.includes(fileType)) {
    return 'video'
  } else if (pictureFormatType.includes(fileType)) {
    return 'imgs'
  } else {
    return ''
  }
}
export const handlefileTypeClassifyBySuffix = (fileType) => {
  if (ThreeModelType.includes(fileType)) {
    return 'threed'
  } else if (VideoType.includes(fileType)) {
    return 'video'
  } else if (pictureType.includes(fileType)) {
    return 'imgs'
  } else {
    return ''
  }
}

export const businessParams = {
  // 设备详情页
  devicedetail: {
    businessType: 'DEVICE'
  },
  // 设备型号详情页
  devicemodeldetail: {
    businessType: 'DEVICE_MODEL'
  },
  // 零件详情页暨备件信息详情页
  partsdetail: {
    businessType: 'PARTS'
  },
  // 物料详情页
  stocksparedetail: {
    businessType: 'STOCK_SPARE'
  },
  // 库房
  warehouse: {
    businessType: 'WAREHOUSE'
  },
  // 库存
  storage: {
    businessType: 'STOCK'
  },
  supplier: {
    businessType: 'SUPPLIER'
  },
  // 需求预测详情页
  forcastdetail: {
    businessType: 'FORCAST'
  },
  // 需求预测详情页
  faultdetail: {
    businessType: 'FAULT'
  }
}

export const cellPhonePattern = /^1[3-9]\d{9}$/

export const regObj = {
  mobile: cellPhonePattern,
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  bankCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
  citizen_id: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
  url: /^http(s*):\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
}

export const dateFormat = 'YYYY-MM-DD HH:mm:ss'
