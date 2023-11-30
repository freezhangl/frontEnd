import selfTable from './table'
import selfUpload from './upload'

const components = [
  selfTable, selfUpload
]

function install (Vue) {
  components.map(component => {
    Vue.component(component.name, component)
  })
}
export default {
  install,
  selfTable,
  selfUpload
}
