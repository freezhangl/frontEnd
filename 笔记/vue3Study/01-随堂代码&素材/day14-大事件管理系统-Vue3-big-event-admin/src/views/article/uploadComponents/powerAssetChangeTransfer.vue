<template>
  <div>
    <a-collapse :bordered="false" v-model="activeKey">
      <template slot="expandIcon">
        <a-divider type="vertical" />
      </template>
      <a-collapse-panel key="1">
        <template slot="header">
          <div class="descriptions__title">
            <div class="title__inner">
              <p>资产过户申请信息</p>
            </div>
            <div class="expand__title">
              <p>{{ activeKey.includes('1') ? '收起' : '展开' }}</p>
              <a-icon type="caret-up" v-if="activeKey.includes('1')" />
              <a-icon type="caret-down" v-else />
            </div>
          </div>
        </template>
        <div class="detail__info" v-if="Object.keys(keyData).length > 0">
          <description-comp
            class="parts__detail-table"
            :description-props="descriptionProps"
            :key-data="keyData"
            :data-list="dataList"
          ></description-comp>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="2">
        <template slot="header">
          <div class="descriptions__title">
            <div class="title__inner">
              <p>资产过户申请详情</p>
            </div>
            <div class="expand__title">
              <p>{{ activeKey.includes('2') ? '收起' : '展开' }}</p>
              <a-icon type="caret-up" v-if="activeKey.includes('2')" />
              <a-icon type="caret-down" v-else />
            </div>
          </div>
        </template>
        <div class="tablecon">
          <table border="1" cellspacing="0">
            <tr>
              <td style="width: 80px">序号</td>
              <td style="width: 150px">信息名称</td>
              <td>变更前</td>
              <td>变更后</td>
            </tr>
            <tr>
              <td>1</td>
              <td>业主名称</td>
              <td>{{ entryInfo.oldCustomerName }}</td>
              <td>{{ entryInfo.newCustomerName }}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>业主联系电话</td>
              <td>{{ entryInfo.oldCustomerPhone }}</td>
              <td>{{ entryInfo.newCustomerPhone }}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>证件类型</td>
              <td>{{ entryInfo.oldIdTypeDesc }}</td>
              <td>{{ entryInfo.newIdTypeDesc }}</td>
            </tr>
            <tr>
              <td>4</td>
              <td>业主证件号</td>
              <td>{{ entryInfo.oldCustomerIdCard }}</td>
              <td>{{ entryInfo.newCustomerIdCard }}</td>
            </tr>
            <tr>
              <td>5</td>
              <td>原业主身份证（正面）</td>
              <td>{{ entryInfo.oldIdCardA }}</td>
              <td>{{ entryInfo.idCardA }}</td>
            </tr>
            <tr>
              <td>6</td>
              <td>原业主身份证（反面）</td>
              <td>{{ entryInfo.oldIdCardB }}</td>
              <td>{{ entryInfo.idCardB }}</td>
            </tr>
            <tr>
              <td>7</td>
              <td>其他附件</td>
              <td>{{ entryInfo.oldOtherDocumentList }}</td>
              <td>{{ entryInfo.otherDocumentList }}</td>
            </tr>
          </table>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="3">
        <template slot="header">
          <div class="descriptions__title">
            <div class="title__inner">
              <p>过户材料</p>
            </div>
            <div class="expand__title">
              <p>{{ activeKey.includes('3') ? '收起' : '展开' }}</p>
              <a-icon type="caret-up" v-if="activeKey.includes('3')" />
              <a-icon type="caret-down" v-else />
            </div>
          </div>
        </template>
        <div class="tablecon">
          <a-form-model ref="ruleForm2" :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
            <table border="1" cellspacing="0">
              <tr>
                <td style="width: 80px">序号</td>
                <td style="width: 150px">信息名称</td>
                <td style="width: 150px">说明</td>
                <td>附件</td>
              </tr>
              <tr v-for="(item, index) in formList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.Infotext }}</td>
                <td>{{ item.text }}</td>
                <td>
                  <a-form-model-item
                    label=""
                    :prop="'fileList' + (index + 1) + 'Length'"
                    :rules="[{ required: item.required, message: '请上传文件', trigger: 'blur' }]"
                  >
                    <UploadCompNew
                      ref="uploadComp"
                      :existsImgs="formData['fileList' + (index + 1)]"
                      :maxSize="20"
                      :maxPicsLength="item.maxPicsLength"
                      @imgUploadingStatus="imgUploadingStatus"
                      :isCloseUpload="isCloseUpload"
                      @getNewPics="
                        (id) => getNewPics('fileList' + (index + 1), 'fileList' + (index + 1) + 'Length', id)
                      "
                      @deletePic="(id) => deletePics('fileList' + (index + 1), 'fileList' + (index + 1) + 'Length', id)"
                    >
                    </UploadCompNew>
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </a-form-model>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
import moment from 'moment'
import { DescriptionComp } from '@/components'
import { UploadCompNew } from '@/components/'
export default {
  props: ['entryType', 'entryInfo'],
  components: {
    DescriptionComp,
    UploadCompNew
  },
  data() {
    return {
      activeKey: ['1', '2', '3', '4', '5'],
      formData: {
        claimCost: '',
        fileList1: []
      },
      canHideModal: true,
      isCloseUpload: false,
      formList: [],
      rules: {
        claimCost: [{ required: true, message: '请输入索赔费用', trigger: 'blur' }],
        claimCostReason: [{ required: true, message: '请输入费用说明', trigger: 'blur' }]
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      descriptionProps: {
        title: '',
        bordered: true,
        column: 3
      },
      keyData: {
        changeCode: {
          labelName: '申请编号'
        },
        stationNo: {
          labelName: '电站资产编号'
        },
        statusDesc: {
          labelName: '申请状态'
        },
        customerName: {
          labelName: '业主姓名'
        },
        changeTypeDesc: {
          labelName: '变更类型'
        },
        spareLevel: {
          labelName: '运维合作方'
        },
        remark: {
          labelName: '提交人'
        },
        changeReason: {
          labelName: '变更原因'
        },
        remark2: {
          labelName: '创建时间'
        }
      },
      dataList: {}
    }
  },
  watch: {
    entryInfo: {
      handler(val) {
        this.dataList = val
      }
    },
    deep: true,
    immediate: true
  },
  mounted() {
    this.setformList()
  },
  methods: {
    setformList() {
      this.formList = [
        { id: '1', Infotext: '新业主身份证正面', text: '说明1', maxPicsLength: 1, required: true },
        { id: '2', Infotext: '新业主身份证反面', text: '说明2', maxPicsLength: 2, required: false },
        { id: '3', Infotext: '业主授权信息', text: '说明3', maxPicsLength: 1, required: true },
        { id: '4', Infotext: '营业执照', text: '说明4', maxPicsLength: 3, required: true },
        { id: '5', Infotext: '法人身份证正面', text: '说明5', maxPicsLength: 9, required: false }
      ]
      this.formList.forEach((item, index) => {
        this.$set(this.formData, 'fileList' + (index + 1), [])
        this.$set(this.formData, 'fileList' + (index + 1) + 'Length', '')
      })
    },
    moment,
    imgUploadingStatus(e) {
      console.log('imgUploadingStatus', e)
      if (e < 1) {
        this.canHideModal = true
      } else {
        this.canHideModal = false
      }
    },
    getNewPics(key, keylength, fileInfo) {
      console.log(key, fileInfo, '获取')
      let currentImgArr = this.formData[key]
      if (!currentImgArr) {
        currentImgArr = []
      }
      this.$set(this.formData, key, [...currentImgArr, fileInfo])
      this.$set(this.formData, keylength, this.formData[key].length ? this.formData[key].length.toString() : '')
      this.$refs.ruleForm2.validateField(keylength)
    },
    deletePics(key, keylength, id) {
      console.log(key, id, '删除')
      this.$set(
        this.formData,
        key,
        this.formData[key].filter((img) => img.id !== id)
      )
      this.$set(this.formData, keylength, this.formData[key].length ? this.formData[key].length.toString() : '')
      this.$refs.ruleForm2.validateField(keylength)
      this.$message.success('删除成功')
    },
    save() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            resolve({
              ...this.formData,
              validType: '1'
            })
          } else {
            resolve({
              validType: '2'
            })
          }
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.descriptions__title {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title__inner {
    display: flex;
    align-items: center;

    p {
      font-weight: 600;
      font-size: 20px;
      color: #000;
      line-height: 1.5;
    }

    img {
      width: 20px;
      height: 20px;
      margin-left: 15px;
      cursor: pointer;
    }
  }

  .expand__title {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #323232;
    font-weight: 400;
    transition: all 0.3s;
    margin-right: 8px;
  }
}
/deep/ .ant-divider,
.ant-divider-vertical {
  width: 3px;
  border-radius: 1.5px;
  background: #ffcb2b;
  height: 15px;
}

/deep/ .ant-collapse-item {
  border-bottom: solid 20px #f0f2f5;
}
.tablecon {
  table {
    width: 100%;
    height: 100%;
    table-layout: fixed;
    word-break: break-all;
    tr {
      &:nth-child(1) {
        background-color: #fafafa;
      }
      td {
        padding: 8px 12px;
      }
    }
  }
}
</style>
