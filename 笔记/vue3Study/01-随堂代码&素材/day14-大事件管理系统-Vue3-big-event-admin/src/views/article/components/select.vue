<template>
  <div>
    <a-collapse :bordered="false" v-model="activeKey">
      <template v-slot:expandIcon>
        <a-divider type="vertical" />
      </template>
      <a-collapse-panel key="1">
        <template v-slot:header>
          <div class="descriptions__title">
            <div class="title__inner">
              <p>出险信息</p>
            </div>
            <div class="expand__title">
              <p>{{ activeKey.includes('1') ? '收起' : '展开' }}</p>
              <a-icon type="caret-up" v-if="activeKey.includes('1')" />
              <a-icon type="caret-down" v-else />
            </div>
          </div>
        </template>
        <a-form-model
          ref="ruleForm"
          :model="formData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="rules"
        >
          <a-form-model-item required label="出险时间" prop="emergenceTime">
            <a-date-picker
              :disabled="entryType == '4'"
              v-model="formData.emergenceTime"
              :show-time="{
                defaultValue: moment('00:00:00', 'HH:mm:ss')
              }"
              format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
              placeholder="请选择出险时间"
            />
          </a-form-model-item>
          <a-form-model-item label="电站编号" prop="stationNo">
            <a-select
              :disabled="
                entryType == 4 ||
                formData.insureTypeCode == 'PROPERTY_ALL_RISKS'
              "
              v-model="formData.stationNo"
              show-search
              placeholder="请选择电站"
              :dropdownMatchSelectWidth="false"
              :default-active-first-option="false"
              :show-arrow="true"
              :filter-option="false"
              @popupScroll="handleStationPopupScroll"
              @search="
                (val) => {
                  handleStationNoSearch(val, true)
                }
              "
              @select="handleStationNoChange"
            >
              <a-select-option
                v-for="item in stationNoList"
                :key="item.stationNo"
              >
                {{ `${item.stationNo}：${item.stationName}` }}
              </a-select-option>
              <a-select-option
                key="disabled"
                disabled
                v-if="
                  stationNoList.length > 0 &&
                  (stationListLoading || stationListFeatched)
                "
              >
                <!-- <p style="color:gray" v-if="stationNoList.length === stationNoListTotal">没有更多数据了</p> -->
                <p
                  style="color: gray"
                  v-if="stationNoList.length === stationNoListTotal"
                ></p>
                <p style="color: gray" v-else>数据加载中...</p>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="安装地址" prop="addressDetail">
            <a-input v-model="formData.addressDetail" disabled />
          </a-form-model-item>
          <a-form-model-item label="事故描述" prop="accidentDesc">
            <a-input
              :disabled="entryType == '4'"
              v-model="formData.accidentDesc"
              type="textarea"
            />
          </a-form-model-item>
          <a-form-model-item
            label="组件受损数量（块）"
            prop="moduleDamageQuantity"
          >
            <a-input
              :disabled="entryType == '4'"
              type="number"
              v-model="formData.moduleDamageQuantity"
            />
          </a-form-model-item>
          <a-form-model-item
            label="组件受损容量（W）"
            prop="moduleDamageMergePower"
          >
            <a-input
              :disabled="entryType == '4'"
              type="number"
              v-model="formData.moduleDamageMergePower"
            />
          </a-form-model-item>
          <a-form-model-item label="组件厂家" prop="moduleManufacturer">
            <a-input
              :disabled="entryType == '4'"
              v-model="formData.moduleManufacturer"
            />
          </a-form-model-item>
        </a-form-model>
      </a-collapse-panel>
      <a-collapse-panel key="2">
        <template v-slot:header>
          <div class="descriptions__title">
            <div class="title__inner">
              <p>保单信息</p>
            </div>
            <div class="expand__title">
              <p>{{ activeKey.includes('1') ? '收起' : '展开' }}</p>
              <a-icon type="caret-up" v-if="activeKey.includes('2')" />
              <a-icon type="caret-down" v-else />
            </div>
          </div>
        </template>
        <a-form-model
          :model="formData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="险种" prop="insureTypeDesc">
            <a-input v-model="formData.insureTypeDesc" disabled />
          </a-form-model-item>
          <a-form-model-item label="保单号" prop="insureCode">
            <a-input v-model="formData.insureCode" disabled />
          </a-form-model-item>
        </a-form-model>
      </a-collapse-panel>
      <a-collapse-panel key="3">
        <template v-slot:header>
          <div class="descriptions__title">
            <div class="title__inner">
              <p>报案人信息</p>
            </div>
            <div class="expand__title">
              <p>{{ activeKey.includes('1') ? '收起' : '展开' }}</p>
              <a-icon type="caret-up" v-if="activeKey.includes('3')" />
              <a-icon type="caret-down" v-else />
            </div>
          </div>
        </template>
        <a-form-model
          ref="ruleForm1"
          :rules="rules"
          :model="formData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="报案人姓名" prop="reporterName">
            <a-input
              :disabled="entryType == '4'"
              v-model="formData.reporterName"
              :maxLength="50"
            />
          </a-form-model-item>
          <a-form-model-item label="报案人电话" prop="reporterPhone">
            <a-input
              :disabled="entryType == '4'"
              v-model="formData.reporterPhone"
              :maxLength="11"
            />
          </a-form-model-item>
          <a-form-model-item label="与被保人关系" prop="reporterRelationCode">
            <a-select
              :disabled="entryType == '4'"
              v-model="formData.reporterRelationCode"
              placeholder="请选择"
            >
              <a-select-option v-for="item in partsTypeList" :key="item.value"
                >{{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
import moment from 'moment'
import { getListData } from '@/api/spare/index'
export default {
  props: ['entryType', 'entryInfo'],
  data() {
    return {
      stationNoPage: { pageNo: 1, pageSize: 50, searchVal: '' },
      stationNoListTotal: 0,
      stationListLoading: false,
      stationListFeatched: false,
      stationNoList: false,
      partsTypeList: [
        { label: '本人', value: 'SELF' },
        { label: '亲属', value: 'KINSMAN' },
        { label: '朋友', value: 'FRIEND' },
        { label: '同事', value: 'WORKMATE' },
        { label: '代理人', value: 'AGENT' },
        { label: '保险公司人员', value: 'INSURE_SELF' },
        { label: '其他', value: 'OTHER' }
      ],
      activeKey: ['1', '2', '3', '4', '5'],
      formData: {
        emergenceTime: null,
        stationNo: '',
        stationName: '',
        addressDetail: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        townCode: '',
        provinceName: '',
        cityName: '',
        areaName: '',
        townName: '',
        accidentDesc: '',
        moduleDamageQuantity: '',
        moduleDamageMergePower: '',
        moduleManufacturer: '',
        insureTypeDesc: '',
        insureTypeCode: '',
        reporterName: '',
        insureCode: '',
        reporterPhone: '',
        reporterRelationCode: '',
        reporterRelationDesc: ''
      },
      rules: {
        emergenceTime: [
          { required: true, message: '请选择出险时间', trigger: 'blur' }
        ],
        stationNo: [
          { required: true, message: '请输入电站编号', trigger: 'blur' }
        ],
        addressDetail: [
          { required: true, message: '请选择安装地址', trigger: 'blur' }
        ],
        accidentDesc: [
          { required: true, message: '请输入事故描述', trigger: 'blur' }
        ],
        moduleDamageQuantity: [
          {
            required: true,
            message: '请输入组件受损数量（块）',
            trigger: 'blur'
          }
        ],
        moduleDamageMergePower: [
          {
            required: true,
            message: '请输入组件受损容量（W）',
            trigger: 'blur'
          }
        ],
        moduleManufacturer: [
          { required: true, message: '请输入组件厂家', trigger: 'blur' }
        ],
        reporterName: [
          { required: true, message: '请输入报案人姓名', trigger: 'blur' }
        ],
        reporterPhone: [
          { required: true, message: '请输入报案人电话', trigger: 'blur' }
        ],
        reporterRelationCode: [
          { required: true, message: '请选择与被保人关系', trigger: 'blur' }
        ]
      },
      modifyTimeDateString: '',
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
  },
  watch: {
    entryInfo: {
      handler(val) {
        if (this.entryType === '1') {
          this.handleStationNoSearch(val.stationNo, true)
          this.formData.insureTypeCode = val.insureTypeCode
          this.formData.insureTypeDesc = val.insureTypeDesc
          this.formData.insureCode = val.insureCode
        }
        if (this.entryType === '2') {
          this.formData.insureTypeCode = val.insureTypeCode
          this.formData.insureTypeDesc = val.insureTypeDesc
          this.formData.insureCode = val.insureCode
          this.handleStationNoSearch('', true)
        }
        if (this.entryType === '3' || this.entryType === '4') {
          this.handleStationNoSearch(val.stationNo, true)
          this.formData = {
            ...val,
            emergenceTime: moment(val.emergenceTime)
          }
        }
      }
    },
    deep: true,
    immediate: true
  },
  mounted() {},
  methods: {
    moment,
    handleStationPopupScroll(e) {
      if (this.stationNoList.length >= this.stationNoListTotal) return
      const { scrollHeight, scrollTop, clientHeight } = e.target
      if (scrollHeight - scrollTop <= clientHeight + 20) {
        this.stationListLoading = true
        const pageNoMiddle = this.stationNoPage.pageNo
        this.stationNoPage.pageNo = pageNoMiddle + 1
        this.handleStationNoSearch(this.stationNoPage.searchVal, false)
      }
    },
    handleStationNoSearch(value, init) {
      if (init) {
        this.stationNoPage.pageNo = 1
      }
      this.stationListFeatched = false
      let searchObj = {}
      this.stationListLoading = true
      this.stationNoPage.searchVal = value
      searchObj = { stationNoOrName: value }
      getListData('/spare/spareOperationOrder/powerStation/page', 'GET', {
        params: { ...searchObj, ...this.stationNoPage }
      }).then((res) => {
        if (res.code === 200) {
          this.stationNoList = init
            ? res.data.rows
            : [].concat(this.stationNoList, res.data.rows)
          this.stationNoListTotal = res.data.totalRows
          this.stationListLoading = false
          this.stationListFeatched = true
          if (this.entryType === '1') {
            if (this.stationNoList.length === 1) {
              this.formData.stationNo = this.stationNoList[0].stationNo
              this.formData.stationName = this.stationNoList[0].stationName
              this.formData.addressDetail = this.stationNoList[0].stationAddress
              this.formData.provinceCode = this.stationNoList[0].provinceCode
              this.formData.cityCode = this.stationNoList[0].cityCode
              this.formData.areaCode = this.stationNoList[0].areaCode
              this.formData.townCode = this.stationNoList[0].townCode
              this.formData.provinceName = this.stationNoList[0].provinceName
              this.formData.cityName = this.stationNoList[0].cityName
              this.formData.areaName = this.stationNoList[0].areaName
              this.formData.townName = this.stationNoList[0].townName
            }
          }
        }
      })
    },
    handleStationNoChange(value) {
      const {
        stationName,
        stationAddress,
        provinceCode,
        cityCode,
        areaCode,
        townCode,
        provinceName,
        cityName,
        areaName,
        townName
      } = this.stationNoList.filter((item) => {
        return item.stationNo === value
      })[0]
      console.log(
        this.stationNoList.filter((item) => {
          return item.stationNo === value
        })[0],
        '辅导时间'
      )
      this.$set(this, 'formData', {
        ...this.formData,
        stationName: stationName,
        addressDetail: stationAddress,
        provinceCode,
        cityCode,
        areaCode,
        townCode,
        provinceName,
        cityName,
        areaName,
        townName
      })
    },
    save() {
      return new Promise((resolve, reject) => {
        let flag = 0
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            flag++
          }
        })
        this.$refs.ruleForm1.validate((valid) => {
          if (valid) {
            flag++
          }
        })
        if (flag === 2) {
          let reporterRelationDesc = ''
          this.partsTypeList.some((item) => {
            if (item.value === this.formData.reporterRelationCode) {
              reporterRelationDesc = item.label
              return true
            }
          })
          resolve({
            ...this.formData,
            emergenceTime: this.formData.emergenceTime.format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            reporterRelationDesc: reporterRelationDesc,
            validType: '1'
          })
        } else {
          resolve({
            validType: '2'
          })
        }
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
</style>
