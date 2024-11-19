let http = null
// 这里传出的来自root仓库的http的实例
export function getHttp () {
  if (!http) {
    return null
  }
  return http
}

export function setHttp (httpIns) {
  http = httpIns
}
