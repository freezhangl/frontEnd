<template>
  <section>
    <section class="view-box">
      <section class="task-info">

        <mk-view-row>
          <mk-view-item title="ID" label-width="70">
            {{ form.id }}
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="头像" label-width="70">
            <el-image
              style="width: 100px; height: 100px"
              :src="form.img"
              :preview-src-list="[form.img]">
            </el-image>
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="昵称" label-width="70">
            {{ form.nickname }}
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="留言邮箱" label-width="70">
            {{ form.email }}
          </mk-view-item>
        </mk-view-row>
        <mk-view-row>
          <mk-view-item title="是否管理员" label-width="70">
            <el-tag>{{form.isAdmin?'是':'否'}}</el-tag>
          </mk-view-item>
        </mk-view-row>
        <mk-view-row>
          <mk-view-item title="回复状态" label-width="70">
            <el-tag>{{form.status?'是':'否'}}</el-tag>
          </mk-view-item>
        </mk-view-row>
        <mk-view-row>
          <mk-view-item title="留言内容" label-width="70">
           <div v-html="form.content"></div>
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="CREATEDAT" label-width="70">
            <mk-view-date :date="form.createdAt"/>
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="UPDATEDAT" label-width="70">
            <mk-view-date :date="form.updatedAt"/>
          </mk-view-item>
        </mk-view-row>


      </section>
    </section>
  </section>
</template>

<script>

export default {
  name: 'view-website-message',
  components: {},
  data() {
    return {
      form: {}
    }
  },
  props: {
    viewData: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  created() {

    this.loadData(this.viewData);
  },
  methods: {
    loadData(data) {
      this.form = data || {};
    },
  },
}
</script>

<style lang="scss" scoped>

.task-view-box {
  width: 100%;
  font-size: 16px;
  padding-left: 10px;
  .art-head {
    width: 500px;
    font-weight: bold;

  }
  .box-head {
    padding: 15px 0px;
    color: #000000;
    font-weight: bold;
  }

  .task-info {
    padding-top: 10px;
    //background-color: rgba(191, 190, 190, 0.1);
    border-radius: 8px;

  }

  .task-chart {
    display: flex;
    flex-wrap: wrap;
    border-radius: 8px;
  }

  .show-section {
    width: calc(30% - 30px);
    min-width: 450px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin: 15px;
    border-radius: 8px;
  }

  .icon-bangzhu {
    font-size: 14px;
    cursor: pointer;

    &:hover {
      color: #1890FF;
    }
  }

  .icon-weibiaoti-_huabanfuben {
    color: #FCDC00;
    font-size: 14px;
  }

  .tagBox {
    display: flex;

    .tag {
      margin-right: 5px;
    }
  }

}

.tagBox {
  max-width: 550px;
  margin-top: -5px;
  display: flex;
  flex-wrap: wrap;
}

//强调字体颜色
.blue {
  color: #1890FF;
}

.concat-link {
  color: rgba(24, 144, 255, 0.75);

  &:hover {
    color: #1890FF;
  }
}

.el-icon-circle-check {
  color: green;
}

.view-btns {
  margin-top: 10px;
  display: flex;
  width: 100%;
  border-top: 1px solid #eee;
  padding: 25px 0px;
  padding-left: 100px;

  .el-icon-s-opportunity {
    color: orange;
    margin-right: 5px;
  }
}

.inputError {
  border-color: red;
}
</style>
