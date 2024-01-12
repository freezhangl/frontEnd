<template>
  <div class="thumbnail__wrap">
    <div class="thumbnail__img" @click="modalVisible = true">
      <p class="thumbnail__hover">
        <!-- <img src="http://116.198.18.192/gfkj-files/imgs/jby/magnifier.png" alt=""> -->
      </p>
      <img v-if="src" :src="src" />
    </div>
    <detail-pics-display-comp
      v-if="src"
      :dataList="record.fileList || []"
      :modal-visible="modalVisible"
      title="图片预览"
      @closeModal="closeBigImg"
    ></detail-pics-display-comp>
  </div>
</template>

<script>
import DetailPicsDisplayComp from '../DetailPicsDisplayComp'
import { pictureType, ThreeModelType } from '@/assets/js/const'
import { handleImg } from '@/utils/util'
export default {
  name: 'Thumbnail',
  components: {
    DetailPicsDisplayComp
  },
  props: {
    record: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    slotName: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      modalVisible: false
    }
  },
  computed: {
    src() {
      const firstImg = this.record.fileList?.find(item => pictureType.includes(item.fileSuffix))
      const is3DModelExists = this.record.fileList?.find(item => ThreeModelType.includes(`.${item.fileSuffix}`))
      return is3DModelExists
        ? 'http://116.198.18.192/gfkj-files/imgs/jby/ME1652170412537.png'
        : firstImg
        ? handleImg(firstImg.id, 208, 208)
        : ''
    }
  },
  methods: {
    closeBigImg() {
      this.modalVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.thumbnail__img {
  width: 50px;
  height: 50px;
  cursor: pointer;
  margin: 0 auto;
  position: relative;
  & > img {
    width: 100%;
    height: 100%;
  }
  .thumbnail__hover {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url(http://116.198.18.192/gfkj-files/imgs/jby/magnifier.png);
    background-size: 16px 16px;
    background-position: center center;
    background-repeat: no-repeat;
    position: absolute;
    margin: 0;
    left: 0;
    top: 0;
    display: none;
  }
  &:hover {
    .thumbnail__hover {
      display: block;
    }
  }
}
</style>
