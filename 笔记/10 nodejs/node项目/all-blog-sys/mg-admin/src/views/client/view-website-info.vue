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
          <mk-view-item title="站点头像" label-width="70">
            <el-image
              style="width: 100px; height: 100px"
              :src="form.avatar"
              :preview-src-list="[form.avatar]">
            </el-image>
          </mk-view-item>
        </mk-view-row>
        <mk-view-row>
          <mk-view-item title="站点背景" label-width="70">
            <el-image
              style="width: 100px; height: 100px"
              :src="form.wallpaper"
              :preview-src-list="[form.wallpaper]">
            </el-image>
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="是否新年" label-width="70">
            <el-tag>{{form.isNewYear?'是':'否'}}</el-tag>
          </mk-view-item>
        </mk-view-row>
        <mk-view-row>
          <mk-view-item title="站点名称" label-width="70">
            {{ form.name }}
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="站点格言" label-width="70">
            {{ form.slogan }}
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="站点主页" label-width="70">
            {{ form.domain }}
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="站点通知" label-width="70">
            {{ form.notice }}
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="站点描述" label-width="70">
            {{ form.desc }}
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="全局样式" label-width="70">
            {{ form.globalStyle }}
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="创建时间" label-width="70">
            <mk-view-date :date="form.createdAt"/>
          </mk-view-item>
        </mk-view-row>

        <mk-view-row>
          <mk-view-item title="修改时间" label-width="70">
            <mk-view-date :date="form.updatedAt"/>
          </mk-view-item>
        </mk-view-row>

      </section>
    </section>
  </section>
</template>

<script>

export default {
  name: 'view-website-info',
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
