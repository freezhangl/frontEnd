import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
const baseUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/project/projectAchievement/v1/2/deleteAchievement'

export default {
  deleteAchievement (param) {
    return Http.post(baseUrl + '/' + param, null, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}
