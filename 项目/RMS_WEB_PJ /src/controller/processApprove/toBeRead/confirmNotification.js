import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
const confirmNotificationUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/flow/ext/notification/v1/3/v1/confirmNotification'

export default {
  confirmNotification (params) {
    return Http.post(confirmNotificationUrl + '/' + params, null)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(e => {
        return Promise.reject(e)
      })
  }
}
