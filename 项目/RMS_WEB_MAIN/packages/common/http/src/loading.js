import { Loading } from 'element-ui'

let loadObj = null
let loadCount = 0
let preText = ''

/**
 * 加载loading图
 * @param  {String} showText 加载的String
 */
let show = (showText = '') => {
  if (loadCount === 0 || preText !== showText) {
    loadCount++
    if (loadCount !== 0 && loadObj) {
      loadObj.close()
    }
    preText = showText

    loadObj = Loading.service({
      body: true,
      fullscreen: true,
      background: 'rgba(255, 255, 255, 0)',
      text: showText
    })
  } else if (loadCount > 0) {
    loadCount++
  }
}

/**
 * 隐藏loading
 */
let hide = () => {
  if (loadCount === 1) {
    loadCount--
    if (loadObj) {
      loadObj.close()
    }
  } else if (loadCount > 1) {
    loadCount--
  }
}

export default {
  show,
  hide,
  open: show,
  close: hide,
  service: Loading.service
}
