import projectImportList from './src/main'

projectImportList.install = function (Vue) {
  Vue.component(projectImportList.name, projectImportList)
}

export default projectImportList
