export const AddProductAndResource = {
  data () {
    return {
      projectProductInfoList: [], //产品信息
      projectResourceInfo: {}, //资源信息
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true //项目信息中有资源信息
    }
  },
  created () {
  },
  methods: {
    deleteNavItem (id) {
      // console.log('navMenus', this.navMenus)
      let index = -1
      this.navMenus.some((ele, i) => {
        if (ele.id === id) {
          index = i
          return true
        }
      })
      if (index > -1) {
        this.navMenus.splice(index, 1)
      }
    }
  }
}
