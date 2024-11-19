import projectDocumentUpload from './src/main'

projectDocumentUpload.install = function (Vue) {
  Vue.component(projectDocumentUpload.name, projectDocumentUpload)
}

export default projectDocumentUpload
