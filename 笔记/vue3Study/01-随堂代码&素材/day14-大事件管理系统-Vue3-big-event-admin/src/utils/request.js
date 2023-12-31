import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
// const baseURL = 'http://big-event-vue-api-t.itheima.net'
const baseURL = 'http://124.222.113.11:3008'
// const baseURL = 'http://localhost:3008'
// const baseURL = ':3008'
// 你好吗
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 1000000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    if (config.responseType) {
      config.headers.responseType = config.responseType
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.request.responseType === 'blob') {
      return res
    }
    // TODO 4. 摘取核心响应数据
    if (res.data.status === 0) {
      return res
    }
    if (res.data.status == 2) {
      router.push('/login')
    }
    // TODO 3. 处理业务失败
    // 处理业务失败, 给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      router.push('/login')
    }

    // 错误的默认情况 => 只要给提示
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
