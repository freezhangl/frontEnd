<template>
  <div class="form__container" :class="`form__container--${size} style__${!isShowlimited && 'page'}`">
    <a-form-model
      ref="ruleForm"
      :model="queryParam"
      :layout="inline"
      :colon="true"
      v-if="searchConfig.length > 0"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol">
      <div class="form__contentbox">
        <template v-for="(item, index) in searchConfig">
          <br v-if="searchPropsConfig[item].isNewLine" :key="index + searchPropsConfig[item].label" />
          <a-divider
            v-if="searchPropsConfig[item].extraProps && Object.keys(searchPropsConfig[item].extraProps.divider || {}).length > 0"
            :key="index"
            orientation="left"
            :type="searchPropsConfig[item].extraProps.divider.type || 'horizontal'"> {{
              searchPropsConfig[item].extraProps.divider.text
            }}</a-divider>
          <a-form-model-item
            v-if="!isShowlimited || (isShowlimited && index < limitNum)"
            :key="searchPropsConfig[item].label"
            :label="!searchPropsConfig[item].tips ? searchPropsConfig[item].labelName : undefined"
            :prop="searchPropsConfig[item].label"
            :rules="item === 'faultNo' && searchPropsConfig[item].rules ? [...searchPropsConfig[item].rules, { validator: spareFaultCheckFaultNo }] : searchPropsConfig[item].rules"
            :class="{ 'files': searchPropsConfig[item].type === 'files', 'custom__search': searchPropsConfig[item].type === 'custominputsearch', 'keep__normal': searchPropsConfig[item].keep__normal }"
            :ref="searchPropsConfig[item].label"
            :validate-status="searchPropsConfig[item].validateStatus"
            :auto-link="['select', 'text'].includes(searchPropsConfig[item].type) && false"
            :label-col="{ style: handleWidth(searchPropsConfig[item], 'label') }"
            :wrapper-col="{ style: handleWidth(searchPropsConfig[item], 'wrapper') }">
            <span slot="label">
              <a-tooltip v-if="searchPropsConfig[item].tips" :title="searchPropsConfig[item].tips">
                <a-icon type="question-circle-o" />
              </a-tooltip>&nbsp;
              {{ searchPropsConfig[item].labelName }}
            </span>
            <a-range-picker
              width="100%"
              v-if="searchPropsConfig[item].type === 'range'"
              v-model="queryParam[searchPropsConfig[item].label]"
              :format="searchPropsConfig[item].format"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              :disabled-date="searchPropsConfig[item].disabledDate"
              v-bind="searchPropsConfig[item].extraProps"
              @blur="reWriteBlur(searchPropsConfig[item].label, searchPropsConfig[item])"
              @change="event => onSelectChange(event, searchPropsConfig[item].label)"
              allow-clear />
            <a-date-picker
              v-if="searchPropsConfig[item].type === 'date'"
              v-model="queryParam[searchPropsConfig[item].label]"
              :format="searchPropsConfig[item].format"
              :disabled-date="searchPropsConfig[item].disabledDate"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              v-bind="searchPropsConfig[item].extraProps"
              @blur="reWriteBlur(searchPropsConfig[item].label, searchPropsConfig[item])"
              @change="event => onSelectChange(event, searchPropsConfig[item].label)"/>
            <a-input
              v-if="searchPropsConfig[item].type === 'text' && !searchPropsConfig[item].nottrim"
              :maxLength="parseInt(searchPropsConfig[item].maxLength) ? parseInt(searchPropsConfig[item].maxLength) : Infinity"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              v-model="queryParam[searchPropsConfig[item].label]"
              v-bind="searchPropsConfig[item].extraProps"
              allow-clear
              @blur="reWriteBlur(searchPropsConfig[item].label, searchPropsConfig[item])"
              @change="event => onSelectChange(event, searchPropsConfig[item].label)"
              :placeholder="`请输入${searchPropsConfig[item].labelName}`">
              <component
                v-if="searchPropsConfig[item].addonBefore"
                :is="searchPropsConfig[item].addonBefore.component"
                slot="addonBefore">{{ searchPropsConfig[item].addonBefore.text }}</component>
              <component
                v-if="searchPropsConfig[item].addonAfter"
                :is="searchPropsConfig[item].addonAfter.component"
                default-value="月"
                slot="addonAfter"
                :style="searchPropsConfig[item].addonAfter.style"
                v-model="queryParam[searchPropsConfig[item].addonAfter.label]">
                <template
                  v-if="searchPropsConfig[item].addonAfter.component === 'a-select' && Object.keys(searchPropsConfig[item].addonAfter.dataList || []).length > 0">
                  <component
                    :is="searchPropsConfig[item].addonAfter.subComponent"
                    v-for="option in searchPropsConfig[item].addonAfter.dataList"
                    :key="searchPropsConfig[item].addonAfter.replaceFileds ? option[searchPropsConfig[item].addonAfter.replaceFileds.value] : option.value"
                    :value="searchPropsConfig[item].addonAfter.replaceFileds ? option[searchPropsConfig[item].addonAfter.replaceFileds.value] : option.value"
                    :disabled="option.disabled || false">{{ searchPropsConfig[item].addonAfter.replaceFileds ?
                      option[searchPropsConfig[item].addonAfter.replaceFileds.text] : option.text
                    }}</component>
                </template>
              </component>
            </a-input>
            <a-input
              v-if="searchPropsConfig[item].type === 'text' && searchPropsConfig[item].nottrim"
              :maxLength="parseInt(searchPropsConfig[item].maxLength) ? parseInt(searchPropsConfig[item].maxLength) : Infinity"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              v-model="queryParam[searchPropsConfig[item].label]"
              v-bind="searchPropsConfig[item].extraProps"
              allow-clear
              @blur="reWriteBlur(searchPropsConfig[item].label, searchPropsConfig[item])"
              @change="event => onSelectChange(event, searchPropsConfig[item].label)"
              :placeholder="`请输入${searchPropsConfig[item].labelName}`">
              <component
                v-if="searchPropsConfig[item].addonBefore"
                :is="searchPropsConfig[item].addonBefore.component"
                slot="addonBefore">{{ searchPropsConfig[item].addonBefore.text }}</component>
              <component
                v-if="searchPropsConfig[item].addonAfter"
                :is="searchPropsConfig[item].addonAfter.component"
                default-value="月"
                slot="addonAfter"
                :style="searchPropsConfig[item].addonAfter.style">
                <template
                  v-if="searchPropsConfig[item].addonAfter.component === 'a-select' && Object.keys(searchPropsConfig[item].addonAfter.dataList || []).length > 0">
                  <a-select-option
                    v-for="option in searchPropsConfig[item].addonAfter.dataList"
                    :key="searchPropsConfig[item].addonAfter.replaceFileds ? option[searchPropsConfig[item].addonAfter.replaceFileds.value] : option.value"
                    :value="searchPropsConfig[item].addonAfter.replaceFileds ? option[searchPropsConfig[item].addonAfter.replaceFileds.value] : option.value"
                    :disabled="option.disabled || false">{{ searchPropsConfig[item].addonAfter.replaceFileds ?
                      option[searchPropsConfig[item].addonAfter.replaceFileds.text] : option.text
                    }}</a-select-option>
                </template>
              </component>
            </a-input>
            <a-textarea
              v-if="searchPropsConfig[item].type === 'textarea'"
              :maxLength="parseInt(searchPropsConfig[item].maxLength) ? parseInt(searchPropsConfig[item].maxLength) : Infinity"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              v-model="queryParam[searchPropsConfig[item].label]"
              :placeholder="`请输入${searchPropsConfig[item].labelName}`"
              :autoSize="{ minRows: 2 }"
              v-bind="searchPropsConfig[item].extraProps"
              @blur="reWriteBlur(searchPropsConfig[item].label, searchPropsConfig[item])"
              @change="event => onSelectChange(event, searchPropsConfig[item].label)"
              allow-clear />
            <a-input-number
              v-if="searchPropsConfig[item].type === 'inputnumber'"
              :max="parseInt(searchPropsConfig[item].maximum) || parseInt(searchPropsConfig[item].maximum) === 0 ? parseInt(searchPropsConfig[item].maximum) : Infinity"
              :min="parseInt(searchPropsConfig[item].minimum) || parseInt(searchPropsConfig[item].minimum) === 0 ? parseInt(searchPropsConfig[item].minimum) : -Infinity"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              v-model="queryParam[searchPropsConfig[item].label]"
              allow-clear
              v-bind="searchPropsConfig[item].extraProps"
              @blur="reWriteBlur(searchPropsConfig[item].label, searchPropsConfig[item])"
              :placeholder="`请输入${searchPropsConfig[item].labelName}`"
              @change="event => onSelectChange(event, searchPropsConfig[item].label)" />
            <a-input
              v-if="searchPropsConfig[item].type === 'custominputsearch'"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              v-model="queryParam[searchPropsConfig[item].label]"
              v-bind="searchPropsConfig[item].extraProps"
              @blur="reWriteBlur(searchPropsConfig[item].label, searchPropsConfig[item])"
              @change="event => onSelectChange(event, searchPropsConfig[item].label, searchPropsConfig[item].type)"
              :placeholder="`请输入${searchPropsConfig[item].labelName}`" />
            <a-button
              v-if="searchPropsConfig[item].type === 'custominputsearch'"
              v-permission="searchPropsConfig[item].enterButtonProps && searchPropsConfig[item].enterButtonProps.permission"
              type="primary"
              :loading="searchPropsConfig[item].extraProps && searchPropsConfig[item].extraProps.loading"
              :disabled="handleSearchButtonStatus(searchPropsConfig[item])"
              @click="onSearch(searchPropsConfig[item])">{{
                searchPropsConfig[item].enterButtonProps && searchPropsConfig[item].enterButtonProps.text || '验证'
              }}</a-button>
            <upload-comp
              v-if="searchPropsConfig[item].type === 'files'"
              :ref="`uploadComp${searchPropsConfig[item].label}`"
              :existsImgs="existsImgs"
              :multiple="true"
              :format="searchPropsConfig[item].format"
              :maxSize="searchPropsConfig[item].maxSize"
              :maxPicsLength="searchPropsConfig[item].maxPicsLength"
              @imgUploadingStatus="imgUploadingStatus"
              :isCloseUpload="isCloseUpload"
              v-bind="searchPropsConfig[item].extraProps"
              @getNewPics="id => getNewPics(searchPropsConfig[item].label, id)"
              @deletePic="id => deletePics(searchPropsConfig[item].label, id)" />
            <a-cascader
              v-if="searchPropsConfig[item].type === 'cascader'"
              :fieldNames="searchPropsConfig[item].replaceFileds"
              :options="searchPropsConfigCascader[item].dataList"
              :load-data="(value) => searchPropsConfig[item].loadData(value, item, searchPropsConfig[item].label)"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              :placeholder="`请选择${searchPropsConfig[item].labelName}`"
              v-bind="searchPropsConfig[item].extraProps"
              change-on-select
              v-model="queryParam[searchPropsConfig[item].label]"
              @change="event => onSelectChange(event, searchPropsConfig[item].label)"
              @blur="reWriteBlur(searchPropsConfig[item].label, searchPropsConfig[item])" />
            <AddressCascader
              v-if="searchPropsConfig[item].type === 'address_cascader'"
              :configType="configType"
              :initValues="initValues"
              :searchPropsData="searchPropsConfig[item]"
              @handleAddressCascaderChange="(value,text)=>handleAddressCascaderChange(item,value,text)"/>
            <a-select
              v-if="searchPropsConfig[item].type === 'select'"
              :defaultActiveFirstOption="false"
              v-model="queryParam[searchPropsConfig[item].label]"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              :dropdownMatchSelectWidth="false"
              @change="event => onSelectChange(event, searchPropsConfig[item].label)"
              @blur="reWriteBlur(searchPropsConfig[item].label, searchPropsConfig[item])"
              @search="event => onSelectSearch(event, searchPropsConfig[item].label)"
              @select="(event, options) => onSelectItems(event, options, searchPropsConfig[item].label)"
              :placeholder="`请选择${searchPropsConfig[item].labelName}`"
              v-bind="searchPropsConfig[item].extraProps"
              v-on="searchPropsConfig[item].events"
              :allow-clear="searchPropsConfig[item].allowClear === false ? false : true">
              <template
                v-if="searchPropsConfig[item].dataList && searchPropsConfig[item].dataList.length > 0 && !!searchPropsConfig[item].isShowAddMore">
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0;" />
                  <div
                    style="padding: 4px 8px; cursor: pointer;"
                    @mousedown="e => e.preventDefault()"
                    @click="() => addItem(searchPropsConfig[item].label)">
                    <a-icon v-if="!searchPropsConfig[item].finished" type="plus" /> {{ !searchPropsConfig[item].finished
                      ? '加载更多' :
                        '没有更多了'
                    }}
                  </div>
                </div>
                <template v-if="fetching" slot="notFoundContent">
                  <a-spin size="small" />
                </template>
                <a-select-option
                  v-for="option in searchPropsConfig[item].dataList"
                  :title="searchPropsConfig[item].replaceFileds ? option[searchPropsConfig[item].replaceFileds.text] : option.text"
                  :key="searchPropsConfig[item].replaceFileds ? option[searchPropsConfig[item].replaceFileds.value] : option.value"
                  :value="searchPropsConfig[item].replaceFileds ? option[searchPropsConfig[item].replaceFileds.value] : option.value"
                  :disabled="option.disabled || false">{{ searchPropsConfig[item].replaceFileds ?
                    option[searchPropsConfig[item].replaceFileds.text] : option.text
                  }}</a-select-option>
              </template>
              <template v-else>
                <a-select-option
                  v-for="option in searchPropsConfig[item].dataList"
                  :title="searchPropsConfig[item].replaceFileds ? option[searchPropsConfig[item].replaceFileds.text] : option.text"
                  :key="searchPropsConfig[item].replaceFileds ? option[searchPropsConfig[item].replaceFileds.value] : option.value"
                  :value="searchPropsConfig[item].replaceFileds ? option[searchPropsConfig[item].replaceFileds.value] : option.value"
                  :disabled="option.disabled || false">{{ searchPropsConfig[item].replaceFileds ?
                    option[searchPropsConfig[item].replaceFileds.text] : option.text
                  }}</a-select-option>
              </template>
            </a-select>
            <a-select
              v-if="searchPropsConfig[item].type === 'search_select'"
              v-model="queryParam[searchPropsConfig[item].label]"
              show-search
              :dropdownMatchSelectWidth="false"
              :default-active-first-option="false"
              :filter-option="false"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              @change="event => onSelectChange(event, searchPropsConfig[item].label)"
              @search="event => onSelectSearch(event, searchPropsConfig[item].label)"
              @focus="event => onSelectSearch(event, searchPropsConfig[item].label)"
              :placeholder="`请选择${searchPropsConfig[item].labelName}`"
              v-bind="searchPropsConfig[item].extraProps"
              v-on="searchPropsConfig[item].events"
              :allow-clear="searchPropsConfig[item].allowClear === false ? false : true">
              <a-select-option
                v-for="option in searchPropsConfig[item].dataList"
                :title="searchPropsConfig[item].replaceFileds ? option[searchPropsConfig[item].replaceFileds.text] : option.text"
                :key="searchPropsConfig[item].replaceFileds ? option[searchPropsConfig[item].replaceFileds.value] : option.value"
                :value="searchPropsConfig[item].replaceFileds ? option[searchPropsConfig[item].replaceFileds.value] : option.value"
                :disabled="option.disabled || false">{{ searchPropsConfig[item].replaceFileds ?
                  option[searchPropsConfig[item].replaceFileds.text] : option.text
                }}</a-select-option>
            </a-select>
            <a-checkbox-group
              v-if="searchPropsConfig[item].type === 'checkbox'"
              v-model="queryParam[searchPropsConfig[item].label]"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              :options="handleCheckBoxData(searchPropsConfig[item].dataList, searchPropsConfig[item].replaceFileds, searchPropsConfig[item].label)"
              v-bind="searchPropsConfig[item].extraProps"
              @change="event => onSelectChange(event, searchPropsConfig[item].label)" />
            <a-radio-group
              v-if="searchPropsConfig[item].type === 'radio'"
              v-model="queryParam[searchPropsConfig[item].label]"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              v-bind="searchPropsConfig[item].extraProps"
              @change="event => onSelectChange(event, searchPropsConfig[item].label)">
              <a-radio
                v-for="(radio, idx ) in searchPropsConfig[item].dataList"
                :key="idx"
                :value="radio[searchPropsConfig[item].replaceFileds && searchPropsConfig[item].replaceFileds.value || 'value']"
                :title="radio.title">{{ radio[searchPropsConfig[item].replaceFileds &&
                  searchPropsConfig[item].replaceFileds.value
                  || 'label']
                }}</a-radio>
            </a-radio-group>
            <a-switch
              v-if="searchPropsConfig[item].type === 'switch'"
              v-model="queryParam[searchPropsConfig[item].label]"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              v-bind="searchPropsConfig[item].extraProps" />
            <colorPicker
              v-if="searchPropsConfig[item].type === 'color_select'"
              v-model="queryParam[searchPropsConfig[item].label]"
              :disabled="searchPropsConfig[item].disabled || (searchPropsConfig[item].isEditable === 'false' && configType === 'EDIT')"
              v-bind="searchPropsConfig[item].extraProps" />
            <a-button
              v-if="searchPropsConfig[item].type === 'select' && searchPropsConfig[item].dictTypeCode && !searchPropsConfig[item].dictDataUrl && hasPerm('sysDictData:edit')"
              v-permission="searchPropsConfig[item].enterButtonProps && searchPropsConfig[item].enterButtonProps.permission"
              type="link"
              @click="clickToDic(searchPropsConfig[item])">编辑</a-button>
          </a-form-model-item>
        </template>
        <span v-if="showBtn && !configType" class="table__submitbuttons" :class="{ 'right__position': !isShowlimited }">
          <template v-if="btnProps.otherBtns && !btnProps.otherBtnsPosition">
            <a-Button
              v-for="(btn, index) in btnProps.otherBtns"
              :key="index"
              :type="btn.type"
              :icon="btn.icon"
              v-permission="btn.permission"
              :disabled="btn.disabled"
              @click="btn.onClick">
              <slot :name="btn.slot"></slot>
              {{ btn.text }}
            </a-Button>
          </template>
          <a-button
            v-if="!(btnProps.empty && btnProps.empty.isHidden)"
            :type="(btnProps.empty && btnProps.empty.type) || 'primary'"
            :disabled="btnProps.empty && btnProps.empty.disabled || false"
            :icon="btnProps.empty.icon"
            @click="handleClear('CLEAR')">{{ btnProps.empty.text || '清空' }}</a-Button>
          <!-- :loading="!!btnProps.confirm.loading" -->
          <a-button
            v-if="!(btnProps.confirm && btnProps.confirm.isHidden)"
            :type="btnProps.confirm && btnProps.confirm.type || 'primary'"
            :disabled="!!(btnProps.confirm && btnProps.confirm.disabled)"
            :icon="btnProps.confirm.icon"
            :style="btnProps.confirm.style"
            v-permission="permission"
            @click="handleSearch">
            <slot name="diyConfirmIcon"></slot>
            {{ btnProps.confirm && btnProps.confirm.text || '搜索' }}
          </a-button>
          <template v-if="btnProps.otherBtns && btnProps.otherBtnsPosition === 'AFTER'">
            <a-Button
              v-for="(btn, index) in btnProps.otherBtns"
              :key="index"
              :type="btn.type"
              v-permission="btn.permission"
              :disabled="btn.disabled"
              :icon="btn.icon"
              @click="btn.onClick">
              <slot :slot="btn.slot"></slot>
              {{ btn.text }}
            </a-Button>
          </template>
          <a-Button v-if="isShowlimited && searchConfig.length > 3" class="check__more" type="link" @click="showMore">{{
            limitNum < searchConfig.length ? '高级搜索' : '收起'
          }}<a-icon
            class="item-icon"
            :type="limitNum < searchConfig.length ? 'down' : 'up'">
          </a-icon>
          </a-Button>
        </span>
      </div>
      <span v-if="showBtn && configType" class="table__submitbuttons extend">
        <a-button
          v-if="!(btnProps.empty && btnProps.empty.isHidden)"
          :type="(btnProps.empty && btnProps.empty.type) || 'primary'"
          :disabled="btnProps.empty && btnProps.empty.disabled || false"
          :icon="btnProps.empty.icon"
          @click="handleClear('CLEAR')">{{ btnProps.empty.text || '清空' }}</a-Button>
        <!-- :loading="!!btnProps.confirm.loading" -->
        <a-button
          v-if="!(btnProps.confirm && btnProps.confirm.isHidden)"
          :type="btnProps.confirm && btnProps.confirm.type || 'primary'"
          :disabled="!!(btnProps.confirm && btnProps.confirm.disabled)"
          :icon="btnProps.confirm.icon"
          :style="btnProps.confirm.style"
          v-permission="permission"
          @click="handleSearch">
          <slot name="diyConfirmIcon"></slot>
          {{ btnProps.confirm && btnProps.confirm.text || '搜索' }}
        </a-button>
      </span>
    </a-form-model>
  </div>
</template>
<script>
import { UploadComp } from '@/components'
import moment from 'moment'
import { SUCCESS } from '@/assets/js/responseCode'
import { spareFaultCheckNo } from '@/api/sparefault/spareFaultManage'
import { getListData } from '@/api/spare/index'
import cloneDeep from 'lodash.clonedeep'
import AddressCascader from './addressCascader'
export default {
  name: 'SearchComp',
  components: {
    UploadComp,
    AddressCascader,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  props: {
    size: {
      type: String,
      default: 'default'
    },
    configType: {
      type: String,
      default: ''
    },
    searchProps: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    isExtendedFields: {
      type: Boolean,
      default: false
    },
    btnProps: {
      type: Object,
      default () {
        return {
          empty: {},
          confirm: {}
        }
      }
    },
    initValues: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    labelWidth: {
      type: Number,
      default: 0
    },
    formElementWidth: {
      type: Number,
      default: 199
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    inline: {
      type: String,
      default: 'inline'
    },
    isShowlimited: {
      type: Boolean,
      default: true
    },
    fetching: {
      type: Boolean,
      default: false
    },
    permission: {
      type: String,
      default: ''
    },
    labelAuto: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      extendKeyList: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
      queryParam: {},
      isCloseUpload: false,
      limitNum: 3,
      enterButtonStatus: true,
      existsImgs: [],
      Infinity: window.Infinity,
      page: this.$route.params.page ? this.$route.params.page : '',
      isWarehouse: false
    }
  },
  computed: {
    searchConfig () {
      const _this = this
      let initConfig = []
      if (this.configType === 'ADD') {
        for (const key in this.searchProps) {
          if (this.searchProps[key].showAdd === 'Y') {
            initConfig.push(key)
          }
        }
      } else if (this.configType === 'EDIT') {
        for (const key in this.searchProps) {
          if (this.searchProps[key].showEdit === 'Y') {
            initConfig.push(key)
          }
        }
      } else {
        initConfig = Object.keys(this.searchProps)
      }
      if (initConfig.includes('lineColor') && !this.queryParam.lineColor) {
        _this.queryParam.lineColor = '#f00'
      }
      return initConfig
    },
    searchPropsConfigCascader() {
      const searchPropsConfigCascader = this.searchProps
      return searchPropsConfigCascader
    },
    searchPropsConfig () {
      const configObj = cloneDeep(this.searchProps)
      console.log(this.searchProps)
      for (const key in this.searchProps) {
        if (this.searchProps[key].isEditable === 'false' && this.configType === 'EDIT') {
          configObj[key].rules = []
        }
      }

      return configObj
    }
  },
  created () {
    console.log(this.page)
    console.log(this.searchPropsConfig)
  },
  watch: {
    initValues: {
      handler: function (newval) {
        if (newval) {
          Object.keys(this.searchPropsConfig).forEach(item => {
            if (this.searchPropsConfig[item].type === 'date' && newval[item]) {
              this.$set(this.queryParam, item, moment(newval[item]))
            }
          })
          this.$set(this, 'queryParam', {
            ...newval, ...this.queryParam
          })
          this.existsImgs = this.queryParam.fileIds ? JSON.parse(JSON.stringify(this.queryParam.fileIds)) : []
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    moment,
    clickToDic(configObj) {
      console.log(configObj)
      this.$emit('editDictData', configObj)
    },
    spareFaultCheckFaultNo (rule, value, callback) {
      console.log(12343)
      const deviceModelNoList = this.queryParam.deviceModelNoList
      const id = this.queryParam.id
      console.log(deviceModelNoList)
      if (!deviceModelNoList || (Array.isArray(deviceModelNoList) && deviceModelNoList.length < 1)) {
        callback()
      } else {
        spareFaultCheckNo({ deviceModelNo: deviceModelNoList, faultNo: value, id: id || '' }).then(res => {
          if (res.code === SUCCESS) {
            if (res.data) {
              callback()
            } else {
              // eslint-disable-next-line standard/no-callback-literal
              callback('该设备型号下故障代码已存在')
            }
          }
        })
      }
    },
    handleWidth (item, type) {
      if (type === 'label') {
        const width = item?.extraProps?.width?.label || this.labelWidth
        if (this.inline === 'inline' && this.labelAuto) {
          return 'width: auto;'
        } else {
          if (width > 0) {
            return `width: ${width}px;flex: 0 0 1;`
          } else {
            return 'width: auto;'
          }
        }
      } else {
        const width = item?.extraProps?.width?.formElementWidth || this.formElementWidth
        if (this.inline === 'inline') {
          if (width > 0) {
            return `width: ${width}px;flex: 0 0 ${width}px;`
          } else {
            return 'width: auto;'
          }
        } else {
          return ''
        }
      }
    },
    showMore () {
      if (this.limitNum < this.searchConfig.length) {
        this.limitNum = this.searchConfig.length
      } else {
        this.limitNum = 3
      }
    },
    clearValidate (params) {
      this.$refs.ruleForm.clearValidate(params)
    },
    getNewPics (key, id) {
      let currentImgArr = this.queryParam[key]
      if (!currentImgArr) {
        currentImgArr = []
      }
      this.existsImgs.push(id)
      this.$set(this.queryParam, key, [...currentImgArr, id])
    },
    deletePics (key, id) {
      let deleteIndex = ''
      this.$set(this.queryParam, key, this.queryParam[key].filter(img => img.id !== id))
      this.existsImgs.forEach((img, index) => {
        if (img.id === id) {
          deleteIndex = index
        }
      })
      this.existsImgs.splice(deleteIndex, 1)
      this.$message.success('删除成功')
    },
    handleClear (from) {
      this.$nextTick(() => {
        this.$set(this, 'queryParam', {})
      })
      if (Object.keys(this.initValues).length > 0) {
        this.$set(this, 'queryParam', JSON.parse(JSON.stringify(this.initValues)))
      } else {
        this.queryParam = {}
      }
      this.$emit('handleClear', this.queryParam, from || '')
      this.isCloseUpload = true
      Object.keys(this.$refs).forEach(key => {
        if (key.indexOf('upload') > -1) {
          this.$refs[key].forEach(item => {
            item.clearTimer()
          })
        }
      })
    },
    resetUploadStatus () {
      this.isCloseUpload = false
    },
    handleSearch () {
      console.log(this.searchPropsConfig)
      console.log(this.searchProps)
      // 库房管理添加  禁用的不可添加
      if (this.isWarehouse) {
        this.$message.error('该库房禁用,不可添加！')
        return false
      }
      this.$refs.ruleForm.validate((valid, errObj = {}) => {
        if (valid && Object.keys(errObj).length < 1) {
          console.log(this.queryParam)
          this.$emit('handleConfirm', this.queryParam, this.searchConfig, this.extendKeyList)
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // console.log('handleSearch', this.queryParam)
    },
    handleValidateItems (cb) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          typeof cb === 'function' && cb(this.queryParam)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearInner (key, event) {
      if (this.searchPropsConfig[key].sonCode) {
        this.$set(this.queryParam, this.searchPropsConfig[key].sonCode, '')
        this.$emit('clearDataList', this.searchPropsConfig[key].sonCode, event)
        this.clearInner(this.searchPropsConfig[key].sonCode)
      }
    },
    // onDataPickerChange(value, key) {
    //   if (value === null && this.configType === 'EDIT') {
    //     this.queryParam[key] = ''
    //   }
    // },
    onSelectChange (event, key, type) {
      if (this.searchPropsConfig[key].sonCode) {
        this.clearInner(key, event)
      }
      this.$forceUpdate()
      this.$emit('onSelectChange', event, key)
      this.$refs[key][0].onFieldChange()
      // if (type && type === 'custominputsearch') {
      //   this.enterButtonStatus = event.target.value.length < 1
      // }
      // 选择库房类型时 this.queryParam.type
      if (key === 'type' && this.queryParam.warehouseNo) this.selectOther(this.queryParam.warehouseNo)
    },
    // 库房管理(wms)   添加时带出其他信息
    selectOther(val) {
      // debugger
      let adminOrigin = ''
      const locationOrigin = window.location.origin
      if (locationOrigin.indexOf('localhost') > -1) {
        adminOrigin = 'http://116.198.18.192'
      } else {
        adminOrigin = window.location.origin
      }
      getListData(`${adminOrigin}/admin/erp/user/getUserListByRoleList`, 'POST', { data: { userNo: val, pageNo: 1, pageSize: 20 } }).then(res => {
        if (res.code === '0000') {
          // this.skuList = res.data.data
          if (res.data.data.length > 0) {
            this.queryParam = { ...this.queryParam, name: '', contact: '', contactPhone: '' }
            this.queryParam.name = res.data.data[0].name + '的个人仓库'
            this.queryParam.contact = res.data.data[0].name
            this.queryParam.contactPhone = res.data.data[0].phone
          }
          if (res.data.data.length > 0 && res.data.data[0].enableStatus === 0) {
            this.$message.error('该库房禁用！')
            this.isWarehouse = true
          } else {
            this.isWarehouse = false
          }
        }
      })
    },
    onSelectSearch (event, key) {
      this.$emit('onSelectSearch', event, key)
    },
    onSelectItems (event, options, key) {
      this.$emit('onSelectItems', event, key, options)
    },
    reWriteBlur (key, item) {
      this.$refs[key][0].onFieldBlur()
      if (item.blurEvents) {
        this.$emit(item.blurEvents, this.queryParam)
      }
    },
    resetFields () {
      this.$refs.ruleForm.resetFields()
      this.$set(this, 'queryParam', {
        ...this.initValues
      })
    },
    validateField (options) {
      this.$refs.ruleForm.validateField(options, (err) => {
        console.log('validateField', err)
      })
    },
    changeQueryParams (key, value) {
      this.$set(this.queryParam, [key], value)
    },
    handleAddressCascaderChange(item, value, nameString) {
      const allList = [...value, ...nameString.split(',')]
      const allVal = { [item]: nameString }
      const keyList = this.searchPropsConfig[item].setAddressValue ? this.searchPropsConfig[item].setAddressValue.split(',') : []
      keyList.forEach((item, index) => {
        allVal[item] = allList[index]
      })
      this.$set(this, 'queryParam', { ...this.queryParam, ...allVal })
      this.extendKeyList = keyList
    },
    imgUploadingStatus (e) {
      this.$emit('imgUploadingStatus', e)
    },
    handleSearchButtonStatus (item) {
      if (item?.enterButtonProps?.status === '0') {
        return true
      } else {
        return false
      }
      // else if (this.queryParam[item.label]) {
      //   return false
      // }
      //  else {
      //   return this.enterButtonStatus
      // }
    },
    _resetEnterButtonStatus () {
      this.enterButtonStatus = true
    },
    onSearch (item) {
      item.onSearch && item.onSearch(this.queryParam[item.label])
    },
    _getFormValues () {
      return this.queryParam
    },
    addItem (key) {
      this.$emit('loadMoreData', key, this.queryParam)
    },
    handleCheckBoxData (data = [], replaceKeysObj = {}, type) {
      if (Object.keys(replaceKeysObj).length > 0) {
        return data.map(item => {
          return {
            label: item[replaceKeysObj.text],
            value: item[replaceKeysObj.value],
            name: type
          }
        })
      } else {
        return data
      }
    }
  }
}
</script>
<style lang="less" scoped>
.form__container {
  transition: height 0.3s linear;

  // border-bottom: 10px solid rgba(0,0,0,0.1);
  .table__submitbuttons {
    display: inline-block;
    margin-top: 4px;
    text-align: right;

    &.extend {
      width: 100%;
      margin-top: 16px;
    }

    &.right__position {
      display: flex;
      justify-content: flex-end;
    }

    .check__more {
      padding: 0 6px;
    }
  }

  .ant-row.ant-form-item {
    margin-bottom: 4px;

    .ant-select,
    .ant-input-number {
      width: 199px;
    }

    &.ant-form-item-with-help {
      margin-bottom: 0px;
    }

    &.custom__search {
      /deep/ .ant-form-item-children {
        display: inline-flex !important;
        width: 100%;

        .ant-input {
          border-radius: 4px 0 0 4px;
        }

        .ant-btn {
          border-radius: 0 4px 4px 0;
          border-left: 0 !important;
        }
      }
    }

    /deep/ .has-feedback {
      // .ant-input {
      //   padding-right: 30px;
      // }
      width: 100%;

      .ant-input-suffix {
        padding-right: 0;
      }
    }

    /deep/ .ant-input-suffix {
      z-index: 9;
    }

    /deep/ .ant-calendar-picker:not(.notSmall) {
      width: 100% !important;
    }
  }

  .files {
    display: flex;
    margin-top: 4px;

    /deep/ .ant-col.ant-form-item-label {
      flex: 0 0 140px;
    }

    /deep/ .ant-form-item-control-wrapper {
      flex: 1 !important;
      width: calc(100% - 140px) !important;
    }
  }

  &.form__container--small {
    .table__submitbuttons {
      margin-bottom: 7px;
    }

    /deep/ .ant-row:not(.keep__normal) {
      .ant-form-item-control-wrapper {
        width: 145px !important;
        flex: 0 0 145px !important;

        .ant-select {
          width: 100%;
        }
      }
    }
  }

  &.style__page {
    .ant-row.ant-form-item {
      // margin-bottom: 10px;
      margin-bottom: 17px;

      &.ant-form-item-with-help {
        margin-bottom: -2px;
        // margin-bottom: -7px;
      }
    }

    // /deep/ .ant-form-explain{
    //   font-size: 12px;
    //   line-height: 1;
    //   margin-top: 0px;
    //   min-height: 18px;
    // }
  }

  .ant-form-vertical,
  .ant-form-horizontal {
    .ant-row {
      display: flex;
      width: 100%;

      /deep/ .ant-form-item-label {
        padding-bottom: 0;
      }

      /deep/ .ant-form-item-control-wrapper {
        flex: 1;

        .ant-select,
        .ant-input-number {
          width: 100%;
        }
      }
    }
  }

  /deep/ .ant-form-item-control-wrapper {
    .has-error {
      .ant-input-affix-wrapper {
        .ant-input-disabled {
          background-color: #f5f5f5 !important;
        }
      }
    }

    textarea {
      margin-bottom: 0;
    }
  }
  /deep/ .ant-col.ant-form-item-control-wrapper{
    .ant-form-item-control{
      margin-top: 4px;
      .ant-form-item-children{
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
<style lang="less">
.form__container {
  .form__contentbox {
    max-height: 600px;
    overflow: auto;
    padding-bottom: 16px;
  }

  .table__submitbuttons {
    .ant-btn {
      margin-right: 10px;
    }
  }

  .ant-row.ant-form-item .ant-select {
    width: 100% !important;
  }

  .m-colorPicker .box {
    padding: 5px 10px;
    transform: translate(0px, -205px);
    margin-top: 0px;
    display: none;
    visibility: visible !important;

    &.open {
      z-index: 10 !important;
      visibility: visible !important;
      display: block;
    }

    h3 {
      margin-top: 5px !important;
    }
  }
}
</style>
