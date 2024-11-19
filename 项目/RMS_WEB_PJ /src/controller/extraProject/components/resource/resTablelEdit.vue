<template>
  <div class="res-info-table">
    <project-panel :title="title" :show-expand='false'>
      <template v-slot:header>
        <el-button
          class="normal-btn"
          @click="addResInfo"
          v-if='!meberEditFlag'
          icon="el-icon-circle-plus-outline">添加{{title}}</el-button>
      </template>
      <el-form
        class="tableForm"
        ref="tableForm"
        :model="tableForm"
        :inline="true">
        <el-table
          :data="tableForm.tableData"
          style="width: 100%">
          <!-- 环境 -->
          <el-table-column
            align="left"
            prop="resourceEnvironment"
            min-width="120"
            class-name="padding-col">
            <template slot="header">
              <span>环境</span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.state==='detail'">{{scope.row.resourceEnvironmentValue}}</span>
              <el-form-item
                :prop="'resourceEnvironment'+scope.$index"
                v-if="scope.row.state==='edit'"
                style="margin-right:0;margin-bottom:0"
                :rules="setRules('resourceEnvironment',scope.row.id)">
                <el-select
                  v-model="scope.row.resourceEnvironment"
                  placeholder="请选择"
                  clearable
                  @change="changeEnv($event,scope.$index)">
                  <el-option
                    v-for="item in options"
                    :key="item.valueCode"
                    :label="item.name"
                    :value="item.valueCode"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- CPU -->
          <el-table-column
            v-if="resourceType!=='storage'"
            align="left"
            prop="cpuCoreNumber"
            min-width="120">
            <template slot="header">
              <span class="required">CPU(核)</span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.state==='detail'">{{scope.row.cpuCoreNumber}}</span>
              <el-form-item
                :prop="'cpuCoreNumber'+scope.$index"
                v-if="scope.row.state==='edit'"
                style="margin-right:0;margin-bottom:0"
                :rules="setRules('cpuCoreNumber',scope.row.id)">
                <el-input
                  v-model="scope.row.cpuCoreNumber"
                  placeholder="请输入"
                  maxlength="4"
                  @input="inputHandler('cpuCoreNumber',scope.$index)"
                  @change="changeHandler('cpuCoreNumber',scope.$index)"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 内存 -->
          <el-table-column
            v-if="resourceType!=='storage'"
            align="left"
            prop="ramSize"
            min-width="120">
            <template slot="header">
              <span class="required">内存(G)</span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.state==='detail'">{{scope.row.ramSize}}</span>
              <el-form-item
                :prop="'ramSize'+scope.$index"
                v-if="scope.row.state==='edit'"
                style="margin-right:0;margin-bottom:0"
                :rules="setRules('ramSize',scope.row.id)">
                <el-input
                  v-model="scope.row.ramSize"
                  placeholder="请输入"
                  @input="inputHandler('ramSize',scope.$index)"
                  @change="changeHandler('ramSize',scope.$index)"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 硬盘 -->
          <el-table-column
            v-if="resourceType!=='storage'"
            align="left"
            prop="hardDiskSize"
            min-width="120">
            <template slot="header">
              <span class="required">硬盘(G)</span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.state==='detail'">{{scope.row.hardDiskSize}}</span>
              <el-form-item
                :prop="'hardDiskSize'+scope.$index"
                v-if="scope.row.state==='edit'"
                style="margin-right:0;margin-bottom:0"
                :rules="setRules('hardDiskSize',scope.row.id)">
                <el-input
                  v-model="scope.row.hardDiskSize"
                  placeholder="请输入"
                  @input="inputHandler('hardDiskSize',scope.$index)"
                  @change="changeHandler('hardDiskSize',scope.$index)"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- NSA存储容量 -->
          <el-table-column
            v-if="resourceType==='storage'"
            align="left"
            prop="nsaCapacity"
            min-width="120">
            <template slot="header">
              <span class="required">NSA存储容量(T)</span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.state==='detail'">{{scope.row.nsaCapacity}}</span>
              <el-form-item
                :prop="'nsaCapacity'+scope.$index"
                v-if="scope.row.state==='edit'"
                style="margin-right:0;margin-bottom:0"
                :rules="setRules('nsaCapacity',scope.row.id)">
                <el-input
                  v-model="scope.row.nsaCapacity"
                  placeholder="请输入"
                  @input="inputHandler('nsaCapacity',scope.$index)"
                  @change="changeHandler('nsaCapacity',scope.$index)"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 对象存储容量 -->
          <el-table-column
            v-if="resourceType==='storage'"
            align="left"
            prop="objectStorageCapacity"
            min-width="120">
            <template slot="header">
              <span class="required">对象存储容量(T)</span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.state==='detail'">{{scope.row.objectStorageCapacity}}</span>
              <el-form-item
                :prop="'objectStorageCapacity'+scope.$index"
                v-if="scope.row.state==='edit'"
                style="margin-right:0;margin-bottom:0"
                :rules="setRules('objectStorageCapacity',scope.row.id)">
                <el-input
                  v-model="scope.row.objectStorageCapacity"
                  placeholder="请输入"
                  @input="inputHandler('objectStorageCapacity',scope.$index)"
                  @change="changeHandler('objectStorageCapacity',scope.$index)"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            prop="operation"
            label="操作"
            min-width="120"
            align="center"
            class-name="operation">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-if="scope.row.state==='edit'"
                @click="addRow(scope.row,scope.$index)">完成</el-button>
              <el-button
                size="mini"
                type="text"
                v-if="scope.row.state==='detail'&&!meberEditFlag"
                @click="editRow(scope.row)">编辑</el-button>
              <el-button
                v-if="!meberEditFlag"
                size="mini"
                type="text"
                @click="delRow(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </project-panel>
  </div>
</template>

<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_project'
export default {
  components: { projectPanel },
  data () {
    return {
      meberEditFlag: false,
      tableForm: {
        tableData: []
      },
      options: [
        // { valueCode: 'RE_PRODUCT', name: '生产', disabled: false },
        // { valueCode: 'RE_TEST', name: '测试', disabled: false },
        // { valueCode: 'RE_DEV', name: '开发', disabled: false }
      ],
      addTableRow: { id: 'addid', state: 'edit', resourceEnvironmentValue: '', resourceEnvironment: '', cpuCoreNumber: '', ramSize: '', hardDiskSize: '', nsaCapacity: '', objectStorageCapacity: '' },
      idCount: 0
    }
  },
  props: {
    title: { type: String, default: '' },
    resourceType: { type: String, default: '' },
    receiveData: { type: Array, default: () => [] },
    envOptions: { type: Array, default: () => [] }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.tableForm.tableData = JSON.parse(JSON.stringify(val))
        }
      }
    },
    envOptions: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.options = JSON.parse(JSON.stringify(val))
        }
      }
    }
  },
  mounted () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
  },
  methods: {
    //设置表格cell校验
    setRules (prop, id) {
      let temp = null
      this.tableForm.tableData.some(ele => {
        if (ele.id === id) {
          temp = ele[prop]
          return true
        }
      })
      let checkEmpty = (rule, value, callback) => {
        if (temp === '' || temp === null || temp === undefined) {
          callback(new Error('该项不能为空'))
        } else {
          callback()
        }
      }
      let rules = [
        { validator: checkEmpty, required: true, message: '该项不能为空', trigger: ['blur', 'change'] }
      ]
      return rules
    },
    //添加资源
    addResInfo () {
      if (this.tableForm.tableData.length === 3) {
        this.$message({
          type: 'warning',
          message: '无法添加资源，请先删除后再操作!',
          showClose: true
        })
        return
      }
      let flag = this.tableForm.tableData.some((item, index) => {
        return item.id === 'addid'
      })
      if (flag) {
        this.$message({
          type: 'warning',
          message: '请保存当前的新增数据!',
          showClose: true
        })
      } else {
        let addRow = JSON.parse(JSON.stringify(this.addTableRow))
        this.tableForm.tableData.push(addRow)
        this.$emit('change')
      }
    },
    //更改环境
    changeEnv () {
      this.setEnvOptions()
      this.$emit('change')
    },
    inputHandler (prop, index) {
      // let temp = this.tableForm.tableData[index][prop] + ''
      // if (temp === '') return
      // if (prop === 'cpuCoreNumber') {
      //   temp = temp.replace(/[^\d]/g, '')
      // } else {
      //   if (temp.indexOf('.') > -1) {
      //     let arr = temp.split('.')
      //     let integer = (arr[0] || '0').slice(0, 16)
      //     let decimals = arr[arr.length - 1]
      //     decimals = decimals.length > 2 ? decimals.slice(0, 2) : decimals
      //     temp = `${integer}.${decimals}` //保留两位小数
      //   } else {
      //     temp = temp.replace(/[^\d.]/g, '')
      //       .slice(0, 16)
      //   }
      // }
      // this.tableForm.tableData[index][prop] = temp
      let temp = this.tableForm.tableData[index][prop] + ''
      if (temp === '') return
      if (prop === 'cpuCoreNumber') {
        temp = temp.replace(/[^\d]/g, '')
      } else {
        if (temp.indexOf('.') > -1) {
          let arr = temp.split('.')
          let integer = (arr[0] || '0').replace(/[^\d.]/g, '')
            .slice(0, 16)
          let decimals = arr[arr.length - 1].replace(/[^\d.]/g, '')
          decimals = decimals.length > 2 ? decimals.slice(0, 2) : decimals
          temp = `${integer}.${decimals}` //保留两位小数
        } else {
          temp = temp.replace(/[^\d.]/g, '')
            .slice(0, 16)
        }
      }
      this.tableForm.tableData[index][prop] = temp
    },
    changeHandler (prop, index) {
      this.$emit('change')
      // let temp = this.tableForm.tableData[index][prop] + ''
      // if (temp === '') return
      // if (prop === 'cpuCoreNumber') {
      //   this.tableForm.tableData[index][prop] = parseInt(temp) //转整数，去除首部0
      // } else {
      //   if (temp.match(/^\d*.$/)) {
      //     this.tableForm.tableData[index][prop] = parseFloat(temp) //以点结尾直接转浮点型
      //   } else {
      //     let arr = temp.split('.')
      //     if (arr.length > 1) { //是小数
      //       let integer = parseInt(arr[0]) || '0'
      //       let decimals = arr[arr.length - 1]
      //       this.tableForm.tableData[index][prop] = `${integer}.${decimals}` //非点结尾，则只转整数部分
      //     } else {
      //       this.tableForm.tableData[index][prop] = parseFloat(temp)
      //     }
      //   }
      // }
    },
    //行完成
    addRow (row, rowIndex) {
      let valid = true
      this.$refs.tableForm.validateField(`resourceEnvironment${rowIndex}`, errorMessage => {
        if (errorMessage !== '') {
          valid = false
        }
      })
      if (this.resourceType !== 'storage') { //物理机、虚拟机资源
        this.$refs.tableForm.validateField(`cpuCoreNumber${rowIndex}`, errorMessage => {
          if (errorMessage !== '') {
            valid = false
          }
        })
        this.$refs.tableForm.validateField(`ramSize${rowIndex}`, errorMessage => {
          if (errorMessage !== '') {
            valid = false
          }
        })
        this.$refs.tableForm.validateField(`hardDiskSize${rowIndex}`, errorMessage => {
          if (errorMessage !== '') {
            valid = false
          }
        })
      } else { //存储资源
        this.$refs.tableForm.validateField(`nsaCapacity${rowIndex}`, errorMessage => {
          if (errorMessage !== '') {
            valid = false
          }
        })
        this.$refs.tableForm.validateField(`objectStorageCapacity${rowIndex}`, errorMessage => {
          if (errorMessage !== '') {
            valid = false
          }
        })
      }
      if (valid) {
        row.id = 'newRow' + this.idCount
        this.options.some(ele => {
          if (ele.valueCode === row.resourceEnvironment) {
            row.resourceEnvironmentValue = ele.name
            ele.disabled = true
            return true
          }
        })
        row.state = 'detail'
        this.idCount++
      }
    },
    //行编辑
    editRow (row) {
      row.state = 'edit'
      this.$emit('change')
    },
    //行删除
    delRow (row, index) {
      this.$confirm('一旦确定删除，结果将无法撤回，请谨慎考虑。', '确定要删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          this.tableForm.tableData.splice(index, 1)
          this.setEnvOptions()
          this.$emit('change')
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    //设置环境的下拉禁用项
    setEnvOptions () {
      let envs = this.tableForm.tableData.map(ele => ele.resourceEnvironment)
      this.options.forEach(ele => {
        ele.disabled = envs.indexOf(ele.valueCode) > -1
      })
    },
    //校验表单并获取数据
    async validate () {
      return new Promise((resolve, reject) => {
        this.$refs['tableForm'].validate(valid => {
          if (valid) {
            resolve(this.tableForm.tableData)
          } else {
            resolve(false)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.res-info-table{
  border: 1px solid #E9E9E9;
  margin-bottom: 20px;
  /deep/ .panel-body{
    margin-bottom: 10px;
  }
  /deep/ .panel-header{
    border-bottom-color: #E9E9E9;
  }
  /deep/ .el-table{
    .cell{
      line-height: 34px;
      padding: 0 5px;
      padding-left: 10px;
      .required{
        position: relative;
        display: inline-block;
        &::before{
          color: red;
          content: '*';
          position: absolute;
          left: -10px;
          top: 4px;
        }
      }
    }
    td,th{
      padding: 6px 0;
    }
    .el-table__row{
      td{
        &:nth-child(1){
          border-left: 1px solid #EBEEF5;
          // padding-left: 30px;
        }
        &:nth-last-child(1){
          border-right: 1px solid #EBEEF5;
        }
      }
    }
    .padding-col{
      padding-left: 30px;
    }
    .operation{
      // width: 100px;
    }
    .el-button{
      padding: 6px 5px;
      font-size: 14px;
    }
    .el-form-item .el-input__inner{
      width: 130px;
    }
    .padding-col .el-form-item .el-input__inner{
      width: 110px;
    }
  }
}
</style>
